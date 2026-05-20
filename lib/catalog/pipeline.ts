import { getAdminClient } from '@/lib/supabase/admin'
import { autoSlug } from '@/lib/catalog/csv-utils'

export interface PipelineStats {
  supplierCategories: number
  supplierProductsNew: number        // is_approved=false → not yet in catalog
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

export interface SyncProductsResult {
  ok: boolean
  inserted: number
  updated: number
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
    { count: supplierCategories },
    { count: supplierProductsNew },
    { count: catalogCategories },
    { count: catalogCategoriesPublished },
    { count: catalogProducts },
    { count: catalogProductsDraft },
    { count: catalogProductsPublished },
  ] = await Promise.all([
    client.from('supplier_categories').select('id', { count: 'exact', head: true }),
    client.from('supplier_products').select('id', { count: 'exact', head: true })
      .eq('is_approved', false).not('name', 'is', null).not('main_image_url', 'is', null).gt('price_uah', 0),
    client.from('catalog_categories').select('id', { count: 'exact', head: true }),
    client.from('catalog_categories').select('id', { count: 'exact', head: true }).eq('is_published', true),
    client.from('catalog_products').select('id', { count: 'exact', head: true }),
    client.from('catalog_products').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    client.from('catalog_products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  return {
    supplierCategories: supplierCategories ?? 0,
    supplierProductsNew: supplierProductsNew ?? 0,
    catalogCategories: catalogCategories ?? 0,
    catalogCategoriesPublished: catalogCategoriesPublished ?? 0,
    catalogProducts: catalogProducts ?? 0,
    catalogProductsDraft: catalogProductsDraft ?? 0,
    catalogProductsPublished: catalogProductsPublished ?? 0,
  }
}

// Step 3: Create/update catalog_categories from supplier_categories.
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

  const { data: existing } = await client.from('catalog_categories').select('supplier_category_id')
  const existingIds = new Set((existing ?? []).map((r) => r.supplier_category_id).filter(Boolean))

  const toInsert = supplierCats
    .filter((sc) => !existingIds.has(sc.supplier_id))
    .map((sc) => {
      const displayName = (sc.name_ua || sc.name || sc.supplier_id) as string
      return {
        supplier_category_id: sc.supplier_id as string,
        slug: autoSlug(displayName),
        name_ua: displayName,
        is_published: false,
        display_order: 0,
      }
    })

  const skipped = supplierCats.length - toInsert.length
  if (toInsert.length === 0) {
    return { ok: true, inserted: 0, skipped, message: `All ${skipped} categories already exist` }
  }

  let inserted = 0
  const CHUNK = 100
  const errors: string[] = []

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK)
    const { error } = await client
      .from('catalog_categories')
      .upsert(chunk, { onConflict: 'supplier_category_id', ignoreDuplicates: true })
    if (error) {
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
  return { ok: true, inserted, skipped, message: `Додано ${inserted} нових категорій, ${skipped} вже існували` }
}

// Step 5: Create catalog_products from supplier_products.
// Price, stock, images come from API (supplier_products) — NEVER from Google Sheets.
// Existing catalog products: update price_uah and main_image_url from API only.
// New products: insert with status='draft'.
// SEO fields (description, meta_title, meta_description) are NOT set here — Step 6 handles those.
export async function syncProductsToCatalog(limit: number): Promise<SyncProductsResult> {
  const client = getAdminClient()

  const { data: supplierProducts, error: fetchErr } = await client
    .from('supplier_products')
    .select('id, supplier_sku, name, name_ua, slug, supplier_category_id, price_uah, main_image_url, images')
    .eq('is_approved', false)
    .not('name', 'is', null)
    .not('main_image_url', 'is', null)
    .gt('price_uah', 0)
    .limit(limit)

  if (fetchErr || !supplierProducts) {
    return { ok: false, inserted: 0, updated: 0, skipped: 0, message: fetchErr?.message ?? 'Failed to fetch supplier products' }
  }

  if (supplierProducts.length === 0) {
    return { ok: true, inserted: 0, updated: 0, skipped: 0, message: 'Нових товарів для синхронізації немає' }
  }

  // Resolve category slug via supplier_category_id → catalog_categories.slug
  const catIds = [...new Set(supplierProducts.map((p) => p.supplier_category_id).filter(Boolean))]
  const catSlugMap = new Map<string, string>()
  if (catIds.length > 0) {
    const { data: cats } = await client
      .from('catalog_categories')
      .select('supplier_category_id, slug')
      .in('supplier_category_id', catIds)
    for (const c of cats ?? []) {
      if (c.supplier_category_id) catSlugMap.set(c.supplier_category_id, c.slug)
    }
  }

  // Check which SKUs already exist in catalog_products
  const skus = supplierProducts.map((p) => p.supplier_sku as string)
  const { data: existingRows } = await client
    .from('catalog_products')
    .select('supplier_sku')
    .in('supplier_sku', skus)
  const existingSkus = new Set((existingRows ?? []).map((r) => r.supplier_sku as string))

  const toInsert: Record<string, unknown>[] = []
  const toUpdatePrice: { sku: string; price_uah: number; main_image_url: string | null; images: unknown }[] = []

  for (const sp of supplierProducts) {
    const sku = sp.supplier_sku as string
    if (existingSkus.has(sku)) {
      // Already in catalog — update price and images from API only
      toUpdatePrice.push({
        sku,
        price_uah: sp.price_uah as number,
        main_image_url: sp.main_image_url as string | null,
        images: sp.images,
      })
      continue
    }
    const name = (sp.name_ua || sp.name || '') as string
    const slug = sp.slug ? String(sp.slug) : autoSlug(`${name} ${sku}`)
    const categorySlug = sp.supplier_category_id ? (catSlugMap.get(sp.supplier_category_id) ?? null) : null

    toInsert.push({
      supplier_product_id: sp.id as string,
      supplier_sku: sku,
      name_ua: name,
      slug,
      category_slug: categorySlug,
      price_uah: sp.price_uah as number,
      main_image_url: sp.main_image_url as string | null,
      images: sp.images ?? null,
      status: 'draft',
      is_featured: false,
      display_order: 0,
    })
  }

  let inserted = 0, updated = 0
  const errors: string[] = []
  const CHUNK = 200

  // Insert new products
  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const { error } = await client
      .from('catalog_products')
      .upsert(toInsert.slice(i, i + CHUNK), { onConflict: 'supplier_sku', ignoreDuplicates: true })
    if (error) errors.push(error.message)
    else inserted += Math.min(CHUNK, toInsert.length - i)
  }

  // Update prices for existing products (API data wins — never from sheet)
  for (const { sku, price_uah, main_image_url, images } of toUpdatePrice) {
    const { error } = await client
      .from('catalog_products')
      .update({ price_uah, main_image_url, images, updated_at: new Date().toISOString() })
      .eq('supplier_sku', sku)
    if (error) errors.push(error.message)
    else updated++
  }

  // Mark all processed supplier_products as approved (excludes from next batch)
  const processedIds = supplierProducts.map((p) => p.id as string)
  for (let i = 0; i < processedIds.length; i += 500) {
    await client
      .from('supplier_products')
      .update({ is_approved: true })
      .in('id', processedIds.slice(i, i + 500))
  }

  if (errors.length) {
    return { ok: false, inserted, updated, skipped: 0, message: `${errors.length} errors: ${errors[0]}` }
  }
  return {
    ok: true, inserted, updated, skipped: 0,
    message: `Додано ${inserted} нових товарів, оновлено ціни у ${updated} існуючих`,
  }
}

// Step 7: Publish all unpublished catalog categories
export async function publishAllCatalogCategories(): Promise<PublishResult> {
  const client = getAdminClient()
  const { data, error } = await client
    .from('catalog_categories')
    .update({ is_published: true })
    .eq('is_published', false)
    .select('id')
  if (error) return { ok: false, updated: 0, message: error.message }
  return { ok: true, updated: data?.length ?? 0, message: `Опубліковано ${data?.length ?? 0} категорій` }
}

// Step 8: Publish all draft catalog products
export async function publishAllCatalogProducts(): Promise<PublishResult> {
  const client = getAdminClient()
  const { data: ids, error: fetchErr } = await client
    .from('catalog_products')
    .select('id')
    .eq('status', 'draft')
  if (fetchErr) return { ok: false, updated: 0, message: fetchErr.message }
  if (!ids || ids.length === 0) return { ok: true, updated: 0, message: 'Всі товари вже опубліковані' }

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
  return { ok: true, updated, message: `Опубліковано ${updated} товарів` }
}
