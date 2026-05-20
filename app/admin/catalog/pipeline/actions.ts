'use server'

import { revalidatePath } from 'next/cache'
import { getAdminClient } from '@/lib/supabase/admin'
import {
  syncCatalogCategories,
  importProductsToCatalog,
  publishAllCatalogCategories,
  publishAllCatalogProducts,
  type SyncCategoriesResult,
  type ImportProductsResult,
  type PublishResult,
} from '@/lib/catalog/pipeline'
import {
  autoSlug, parseCsv, normalizeHeaders, getCol, fetchCsvText,
} from '@/lib/catalog/csv-utils'

export async function syncCategoriesAction(): Promise<SyncCategoriesResult> {
  const result = await syncCatalogCategories()
  revalidatePath('/admin/catalog/pipeline')
  return result
}

export async function importProductsAction(limit: number): Promise<ImportProductsResult> {
  const result = await importProductsToCatalog(limit)
  revalidatePath('/admin/catalog/pipeline')
  return result
}

export async function publishCategoriesAction(): Promise<PublishResult> {
  const result = await publishAllCatalogCategories()
  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')
  return result
}

export async function publishProductsAction(): Promise<PublishResult> {
  const result = await publishAllCatalogProducts()
  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')
  return result
}

// ─── Direct sheet import actions for the pipeline UI ─────────────────────────

export interface SheetImportResult {
  ok: boolean
  parsed: number
  inserted: number
  updated: number
  skipped: number
  message: string
}

// Import categories directly from a "Category | Description" sheet into catalog_categories.
// Auto-generates slugs; skips rows whose name already matches an existing catalog_category.
export async function importCategoriesFromSheetAction(sheetUrl: string): Promise<SheetImportResult> {
  if (!sheetUrl.trim()) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: 'URL не вказано' }

  const fetched = await fetchCsvText(sheetUrl)
  if (!fetched.ok) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: fetched.error }

  const allRows = parseCsv(fetched.text)
  if (allRows.length < 2) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: 'Таблиця порожня' }

  const headers = allRows[0]
  const nameIdx = headers.findIndex((h) => ['category', 'категорія', 'категория', 'name', 'назва'].includes(h.toLowerCase().trim()))
  const descIdx = headers.findIndex((h) => ['description', 'опис', 'описание'].includes(h.toLowerCase().trim()))

  if (nameIdx < 0) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: 'Колонку "Category" не знайдено' }

  const dataRows = allRows.slice(1).filter((r) => (r[nameIdx] ?? '').trim())
  const client = getAdminClient()

  // Load existing categories to avoid slug/name collisions
  const { data: existing } = await client.from('catalog_categories').select('slug, name_ua, supplier_category_id')
  const existingSlugs = new Set((existing ?? []).map((c) => c.slug))
  const existingNames = new Set((existing ?? []).map((c) => c.name_ua.toLowerCase().trim()))

  let inserted = 0, updated = 0, skipped = 0

  for (const r of dataRows) {
    const nameRaw = (r[nameIdx] ?? '').trim()
    const description = descIdx >= 0 ? (r[descIdx] ?? '').trim() || null : null
    if (!nameRaw) { skipped++; continue }

    const nameLower = nameRaw.toLowerCase()

    if (existingNames.has(nameLower)) {
      // Update description if provided and not already set
      if (description) {
        const { data: found } = await client
          .from('catalog_categories')
          .select('id, description')
          .ilike('name_ua', nameRaw)
          .limit(1)
          .single()
        if (found && !found.description) {
          await client.from('catalog_categories').update({
            description,
            meta_description: description.slice(0, 160),
          }).eq('id', found.id)
          updated++
        } else {
          skipped++
        }
      } else {
        skipped++
      }
      continue
    }

    let slug = autoSlug(nameRaw)
    if (existingSlugs.has(slug)) slug = `${slug}-${Date.now()}`
    existingSlugs.add(slug)
    existingNames.add(nameLower)

    const { error } = await client.from('catalog_categories').insert({
      slug,
      name_ua: nameRaw,
      description,
      meta_title: nameRaw,
      meta_description: description ? description.slice(0, 160) : null,
      is_published: false,
      display_order: 0,
    })

    if (error) skipped++
    else inserted++
  }

  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')

  return {
    ok: true,
    parsed: dataRows.length,
    inserted,
    updated,
    skipped,
    message: `Розібрано ${dataRows.length}: додано ${inserted}, оновлено ${updated}, пропущено ${skipped}`,
  }
}

// Import products directly from the product Google Sheet into catalog_products.
// Matches existing products by supplier_sku; new products get status='draft'.
export async function importProductsFromSheetAction(sheetUrl: string, limit: number): Promise<SheetImportResult> {
  if (!sheetUrl.trim()) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: 'URL не вказано' }

  const fetched = await fetchCsvText(sheetUrl)
  if (!fetched.ok) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: fetched.error }

  const allRows = parseCsv(fetched.text)
  if (allRows.length < 2) return { ok: false, parsed: 0, inserted: 0, updated: 0, skipped: 0, message: 'Таблиця порожня' }

  const headers = normalizeHeaders(allRows[0])
  const dataRows = allRows.slice(1, limit + 1)

  const client = getAdminClient()

  // Load catalog categories for name → slug mapping
  const { data: cats } = await client.from('catalog_categories').select('slug, name_ua')
  const catNameMap = new Map((cats ?? []).map((c) => [c.name_ua.toLowerCase().trim(), c.slug]))

  // Load existing catalog_products slugs and SKUs to avoid collisions
  const { data: existingProds } = await client.from('catalog_products').select('supplier_sku, slug, meta_title, meta_description')
  const existingBySku = new Map((existingProds ?? []).map((p) => [p.supplier_sku, p]))
  const takenSlugs = new Set((existingProds ?? []).map((p) => p.slug))

  const toInsert: Record<string, unknown>[] = []
  const toUpdate: { sku: string; payload: Record<string, unknown> }[] = []
  let skipped = 0

  for (const r of dataRows) {
    const sku = getCol(r, headers, 'sku')
    if (!sku) { skipped++; continue }

    const name = getCol(r, headers, 'name')
    const priceStr = getCol(r, headers, 'price').replace(/[^\d.]/g, '')
    const imgRaw = getCol(r, headers, 'images')
    const images = imgRaw ? imgRaw.split(/[,;\s]+/).map((u) => u.trim()).filter((u) => u.startsWith('http')) : []
    const description = getCol(r, headers, 'description') || null
    const metaTitle = getCol(r, headers, 'meta_title') || null
    const metaDesc = getCol(r, headers, 'meta_description') || null
    const categoryRaw = getCol(r, headers, 'category') || null
    const primaryCat = categoryRaw ? categoryRaw.split(/[,;|]+/)[0].trim().toLowerCase() : null
    const categorySlug = primaryCat ? (catNameMap.get(primaryCat) ?? null) : null

    const ex = existingBySku.get(sku)

    if (ex) {
      // Update content fields; never overwrite existing SEO if already set
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (name) payload.name_ua = name
      if (priceStr) payload.price_uah = Number(priceStr)
      if (description) payload.description = description
      if (images[0]) payload.main_image_url = images[0]
      if (images.length) payload.images = images
      if (categorySlug) payload.category_slug = categorySlug
      if (metaTitle && !ex.meta_title) payload.meta_title = metaTitle
      if (metaDesc && !ex.meta_description) payload.meta_description = metaDesc
      toUpdate.push({ sku, payload })
    } else {
      if (!name || !priceStr) { skipped++; continue }
      let slug = autoSlug(`${name} ${sku}`)
      if (takenSlugs.has(slug)) slug = `${slug}-${Date.now()}`
      takenSlugs.add(slug)
      toInsert.push({
        supplier_sku: sku,
        name_ua: name,
        slug,
        category_slug: categorySlug,
        description,
        price_uah: Number(priceStr),
        main_image_url: images[0] ?? null,
        images: images.length ? images : null,
        meta_title: metaTitle,
        meta_description: metaDesc,
        status: 'draft',
        is_featured: false,
        display_order: 0,
      })
    }
  }

  let inserted = 0, updated = 0, errors = 0
  const CHUNK = 100

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const { error } = await client.from('catalog_products').insert(toInsert.slice(i, i + CHUNK))
    if (error) { errors += Math.min(CHUNK, toInsert.length - i); console.error('insert error', error.message) }
    else inserted += Math.min(CHUNK, toInsert.length - i)
  }

  for (const { sku, payload } of toUpdate) {
    const { error } = await client.from('catalog_products').update(payload).eq('supplier_sku', sku)
    if (error) errors++; else updated++
  }

  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')

  const parsed = dataRows.length
  const ok = errors === 0
  return {
    ok,
    parsed,
    inserted,
    updated,
    skipped: skipped + errors,
    message: `Розібрано ${parsed}: додано ${inserted}, оновлено ${updated}, пропущено ${skipped}${errors ? `, помилок ${errors}` : ''}`,
  }
}
