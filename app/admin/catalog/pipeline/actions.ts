'use server'

import { revalidatePath } from 'next/cache'
import { getAdminClient } from '@/lib/supabase/admin'
import { syncSupplierCategories, syncSupplierProducts } from '@/lib/supplier/sync'
import {
  syncCatalogCategories,
  syncProductsToCatalog,
  publishAllCatalogCategories,
  publishAllCatalogProducts,
  type SyncCategoriesResult,
  type SyncProductsResult,
  type PublishResult,
} from '@/lib/catalog/pipeline'
import { parseCsv, normalizeHeaders, getCol, fetchCsvText } from '@/lib/catalog/csv-utils'
import type { SyncResult } from '@/lib/supplier/sync'

// ─── Step 1: API → supplier_categories ───────────────────────────────────────

export async function syncApiCategoriesAction(): Promise<SyncResult> {
  const result = await syncSupplierCategories()
  revalidatePath('/admin/catalog/pipeline')
  return result
}

// ─── Step 2: API → supplier_products ─────────────────────────────────────────

export async function syncApiProductsAction(): Promise<SyncResult> {
  const result = await syncSupplierProducts({ pageSize: 1000 })
  revalidatePath('/admin/catalog/pipeline')
  return result
}

// ─── Step 3: supplier_categories → catalog_categories ────────────────────────

export async function syncCatalogCategoriesAction(): Promise<SyncCategoriesResult> {
  const result = await syncCatalogCategories()
  revalidatePath('/admin/catalog/pipeline')
  return result
}

// ─── Step 4: Google Sheet → catalog_categories SEO ───────────────────────────
// Sheet: Category | Description
// Matches by name_ua (case-insensitive normalization).
// Updates: description, meta_title (only if empty), meta_description (derived from description).
// Never changes: slug, supplier_category_id, is_published.

export interface SeoApplyResult {
  ok: boolean
  updated: number
  skipped: number
  notFound: number
  message: string
}

export async function applyCategorySeoAction(sheetUrl: string): Promise<SeoApplyResult> {
  if (!sheetUrl.trim()) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: 'URL не вказано' }

  const fetched = await fetchCsvText(sheetUrl)
  if (!fetched.ok) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: fetched.error }

  const allRows = parseCsv(fetched.text)
  if (allRows.length < 2) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: 'Таблиця порожня' }

  const headers = allRows[0]
  const nameIdx = headers.findIndex((h) => ['category', 'категорія', 'категория', 'name', 'назва'].includes(h.toLowerCase().trim()))
  const descIdx = headers.findIndex((h) => ['description', 'опис', 'описание'].includes(h.toLowerCase().trim()))

  if (nameIdx < 0) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: 'Не знайдено колонку "Category"' }

  const client = getAdminClient()
  const { data: cats } = await client.from('catalog_categories').select('id, name_ua, meta_title, meta_description, description')
  const catMap = new Map((cats ?? []).map((c) => [c.name_ua.toLowerCase().trim(), c]))

  let updated = 0, skipped = 0, notFound = 0

  for (const r of allRows.slice(1)) {
    const nameRaw = (r[nameIdx] ?? '').trim()
    if (!nameRaw) { skipped++; continue }

    const description = descIdx >= 0 ? (r[descIdx] ?? '').trim() || null : null
    const cat = catMap.get(nameRaw.toLowerCase())
    if (!cat) { notFound++; continue }

    const payload: Record<string, unknown> = {}
    if (description && !cat.description) payload.description = description
    if (description && !cat.meta_description) payload.meta_description = description.slice(0, 160)
    if (!cat.meta_title) payload.meta_title = nameRaw

    if (Object.keys(payload).length === 0) { skipped++; continue }

    const { error } = await client.from('catalog_categories').update(payload).eq('id', cat.id)
    if (error) skipped++
    else updated++
  }

  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')

  return {
    ok: true, updated, skipped, notFound,
    message: `SEO категорій: оновлено ${updated}, вже є ${skipped}, не знайдено в каталозі ${notFound}`,
  }
}

// ─── Step 5: supplier_products → catalog_products ────────────────────────────
// Price, images from API. SEO fields left empty for Step 6 to fill.

export async function syncProductsToCatalogAction(limit: number): Promise<SyncProductsResult> {
  const result = await syncProductsToCatalog(limit)
  revalidatePath('/admin/catalog/pipeline')
  return result
}

// ─── Step 6: Google Sheet → catalog_products SEO ─────────────────────────────
// Sheet headers: ID | Name | SKU | Price | Categories | Stock | Images | Description | Meta Title | Meta Description | Meta Keywords
// Matches by SKU.
// Updates ONLY: description, meta_title, meta_description.
// NEVER touches: price_uah, main_image_url, images, status (those come from API in Steps 2 + 5).

export async function applyProductSeoAction(sheetUrl: string): Promise<SeoApplyResult> {
  if (!sheetUrl.trim()) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: 'URL не вказано' }

  const fetched = await fetchCsvText(sheetUrl)
  if (!fetched.ok) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: fetched.error }

  const allRows = parseCsv(fetched.text)
  if (allRows.length < 2) return { ok: false, updated: 0, skipped: 0, notFound: 0, message: 'Таблиця порожня' }

  const headers = normalizeHeaders(allRows[0])
  const dataRows = allRows.slice(1)

  // Load all catalog_products SKUs and their current SEO state
  const client = getAdminClient()
  const { data: existingProds } = await client
    .from('catalog_products')
    .select('id, supplier_sku, description, meta_title, meta_description')

  const prodMap = new Map((existingProds ?? []).map((p) => [p.supplier_sku, p]))

  let updated = 0, skipped = 0, notFound = 0

  for (const r of dataRows) {
    const sku = getCol(r, headers, 'sku')
    if (!sku) { skipped++; continue }

    const description = getCol(r, headers, 'description') || null
    const metaTitle = getCol(r, headers, 'meta_title') || null
    const metaDesc = getCol(r, headers, 'meta_description') || null
    // meta_keywords: accepted, ignored — no field in catalog_products

    const prod = prodMap.get(sku)
    if (!prod) { notFound++; continue }

    const payload: Record<string, unknown> = {}
    // Only fill fields that are currently empty (preserve hand-written SEO)
    if (description && !prod.description) payload.description = description
    if (metaTitle && !prod.meta_title) payload.meta_title = metaTitle
    if (metaDesc && !prod.meta_description) payload.meta_description = metaDesc

    if (Object.keys(payload).length === 0) { skipped++; continue }

    const { error } = await client
      .from('catalog_products')
      .update(payload)
      .eq('id', prod.id)

    if (error) skipped++
    else updated++
  }

  revalidatePath('/admin/catalog/pipeline')

  return {
    ok: true, updated, skipped, notFound,
    message: `SEO товарів: оновлено ${updated}, вже є ${skipped}, не знайдено в каталозі ${notFound}`,
  }
}

// ─── Step 7: Publish categories ───────────────────────────────────────────────

export async function publishCategoriesAction(): Promise<PublishResult> {
  const result = await publishAllCatalogCategories()
  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')
  return result
}

// ─── Step 8: Publish products ─────────────────────────────────────────────────

export async function publishProductsAction(): Promise<PublishResult> {
  const result = await publishAllCatalogProducts()
  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')
  return result
}
