import { getAdminClient } from '@/lib/supabase/admin'
import { autoSlug } from '@/lib/catalog/csv-utils'

export interface PipelineStats {
  catalogCategories: number
  catalogCategoriesPublished: number
  catalogProducts: number
  catalogProductsDraft: number
  catalogProductsPublished: number
}

export interface SyncCategoriesResult {
  ok: boolean
  inserted: number
  skipped: number
  message: string
}

export interface ImportProductsResult {
  ok: boolean
  inserted: number
  skipped: number
  message: string
}

export interface PublishResult {
  ok: boolean
  updated: number
  message: string
}

export async function getPipelineStats(): Promise<PipelineStats> {
  const client = getAdminClient()

  const [
    { count: catalogCategories },
    { count: catalogCategoriesPublished },
    { count: catalogProducts },
    { count: catalogProductsDraft },
    { count: catalogProductsPublished },
  ] = await Promise.all([
    client.from('catalog_categories').select('id', { count: 'exact', head: true }),
    client.from('catalog_categories').select('id', { count: 'exact', head: true }).eq('is_published', true),
    client.from('catalog_products').select('id', { count: 'exact', head: true }),
    client.from('catalog_products').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    client.from('catalog_products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  return {
    catalogCategories: catalogCategories ?? 0,
    catalogCategoriesPublished: catalogCategoriesPublished ?? 0,
    catalogProducts: catalogProducts ?? 0,
    catalogProductsDraft: catalogProductsDraft ?? 0,
    catalogProductsPublished: catalogProductsPublished ?? 0,
  }
}

// Step 1: Sync categories — insert new catalog_categories from supplier_categories.
// Existing entries (matched by supplier_category_id) are skipped to preserve SEO edits.
export async function syncCatalogCategories(): Promise<SyncCategoriesResult> {
  const client = getAdminClient()

  const { data: supplierCats, error: fetchErr } = await client
    .from('supplier_categories')
    .select('supplier_id, name, name_ua')
    .order('name', { ascending: true })

  if (fetchErr || !supplierCats) {
    return { ok: false, inserted: 0, skipped: 0, message: fetchErr?.message ?? 'Failed to fetch supplier categories' }
  }

  // Fetch existing supplier_category_ids to avoid conflict
  const { data: existing } = await client
    .from('catalog_categories')
    .select('supplier_category_id')

  const existingIds = new Set((existing ?? []).map((r) => r.supplier_category_id).filter(Boolean))

  const toInsert = supplierCats
    .filter((sc) => !existingIds.has(sc.supplier_id))
    .map((sc) => {
      const displayName = (sc.name_ua || sc.name || sc.supplier_id) as string
      const baseSlug = autoSlug(displayName)
      return {
        supplier_category_id: sc.supplier_id as string,
        slug: baseSlug,
        name_ua: displayName,
        is_published: false,
        display_order: 0,
      }
    })

  const skipped = supplierCats.length - toInsert.length

  if (toInsert.length === 0) {
    return { ok: true, inserted: 0, skipped, message: `All ${skipped} categories already exist` }
  }

  // Insert in chunks; slugs may collide — append suffix on conflict
  let inserted = 0
  const CHUNK = 100
  const errors: string[] = []

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK)
    const { error } = await client
      .from('catalog_categories')
      .upsert(chunk, { onConflict: 'supplier_category_id', ignoreDuplicates: true })
    if (error) {
      // Try one-by-one with fallback slugs
      for (const row of chunk) {
        const { error: e2 } = await client.from('catalog_categories').upsert(
          { ...row, slug: `${row.slug}-${Date.now()}` },
          { onConflict: 'supplier_category_id', ignoreDuplicates: true },
        )
        if (e2) errors.push(e2.message)
        else inserted++
      }
    } else {
      inserted += chunk.length
    }
  }

  if (errors.length) {
    return { ok: false, inserted, skipped, message: `Inserted ${inserted}, ${errors.length} errors: ${errors[0]}` }
  }

  return { ok: true, inserted, skipped, message: `Inserted ${inserted} new categories, ${skipped} already existed` }
}

// Step 2: Import eligible supplier products into catalog_products.
// "Eligible" means: name not null, main_image_url not null, price_uah > 0, is_approved = false.
// Uses ignoreDuplicates=true — existing catalog products (matched by supplier_sku) are NOT overwritten.
export async function importProductsToCatalog(limit: number): Promise<ImportProductsResult> {
  const client = getAdminClient()

  const { data: supplierProducts, error: fetchErr } = await client
    .from('supplier_products')
    .select('id, supplier_sku, name, name_ua, slug, supplier_category_id, price_uah, main_image_url, images, attributes, short_description_ua, description_ua')
    .eq('is_approved', false)
    .not('name', 'is', null)
    .not('main_image_url', 'is', null)
    .gt('price_uah', 0)
    .limit(limit)

  if (fetchErr || !supplierProducts) {
    return { ok: false, inserted: 0, skipped: 0, message: fetchErr?.message ?? 'Failed to fetch supplier products' }
  }

  if (supplierProducts.length === 0) {
    return { ok: true, inserted: 0, skipped: 0, message: 'No eligible products remaining' }
  }

  // Resolve supplier_category_id → catalog category slug
  const supplierCategoryIds = [...new Set(supplierProducts.map((p) => p.supplier_category_id).filter(Boolean))]
  const categorySlugMap: Map<string, string> = new Map()

  if (supplierCategoryIds.length > 0) {
    const { data: catRows } = await client
      .from('catalog_categories')
      .select('supplier_category_id, slug')
      .in('supplier_category_id', supplierCategoryIds)
    for (const r of catRows ?? []) {
      if (r.supplier_category_id) categorySlugMap.set(r.supplier_category_id, r.slug)
    }
  }

  const rows = supplierProducts.map((sp) => {
    const name = (sp.name_ua || sp.name || '') as string
    const sku = sp.supplier_sku as string
    const slug = sp.slug ? String(sp.slug) : autoSlug(`${name} ${sku}`)
    const categorySlug = sp.supplier_category_id ? (categorySlugMap.get(sp.supplier_category_id) ?? null) : null

    return {
      supplier_product_id: sp.id as string,
      supplier_sku: sku,
      name_ua: name,
      slug,
      category_slug: categorySlug,
      short_description: (sp.short_description_ua ?? null) as string | null,
      description: (sp.description_ua ?? null) as string | null,
      price_uah: sp.price_uah as number,
      compare_price_uah: null,
      main_image_url: sp.main_image_url as string,
      images: (sp.images ?? null) as string[] | null,
      attributes: (sp.attributes ?? null) as Record<string, unknown> | null,
      status: 'draft' as const,
      is_featured: false,
      display_order: 0,
    }
  })

  // Mark processed supplier products as approved (to exclude from next batch)
  const processedIds = supplierProducts.map((sp) => sp.id as string)

  let inserted = 0
  const CHUNK = 200
  const errors: string[] = []

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK)
    const { error } = await client
      .from('catalog_products')
      .upsert(chunk, { onConflict: 'supplier_sku', ignoreDuplicates: true })
    if (error) {
      errors.push(error.message)
    } else {
      inserted += chunk.length
    }
  }

  // Mark supplier products as approved so they don't appear in next batch
  for (let i = 0; i < processedIds.length; i += 500) {
    await client
      .from('supplier_products')
      .update({ is_approved: true })
      .in('id', processedIds.slice(i, i + 500))
  }

  if (errors.length) {
    return { ok: false, inserted, skipped: rows.length - inserted, message: `${errors.length} chunk error(s): ${errors[0]}` }
  }

  return {
    ok: true,
    inserted,
    skipped: rows.length - inserted,
    message: `Imported ${inserted} products (${rows.length - inserted} already existed)`,
  }
}

// Step 3: Publish all catalog categories
export async function publishAllCatalogCategories(): Promise<PublishResult> {
  const client = getAdminClient()
  const { data, error } = await client
    .from('catalog_categories')
    .update({ is_published: true })
    .eq('is_published', false)
    .select('id')

  if (error) return { ok: false, updated: 0, message: error.message }
  return { ok: true, updated: data?.length ?? 0, message: `Published ${data?.length ?? 0} categories` }
}

// Step 4: Publish all catalog products (set status=published)
export async function publishAllCatalogProducts(): Promise<PublishResult> {
  const client = getAdminClient()

  // Batch update — Supabase doesn't support limit on update, so we fetch IDs first
  const { data: ids, error: fetchErr } = await client
    .from('catalog_products')
    .select('id')
    .eq('status', 'draft')

  if (fetchErr) return { ok: false, updated: 0, message: fetchErr.message }
  if (!ids || ids.length === 0) return { ok: true, updated: 0, message: 'All products already published' }

  const idList = ids.map((r) => r.id)
  let updated = 0
  const CHUNK = 500

  for (let i = 0; i < idList.length; i += CHUNK) {
    const { error } = await client
      .from('catalog_products')
      .update({ status: 'published' })
      .in('id', idList.slice(i, i + CHUNK))
    if (!error) updated += Math.min(CHUNK, idList.length - i)
  }

  return { ok: true, updated, message: `Published ${updated} products` }
}
