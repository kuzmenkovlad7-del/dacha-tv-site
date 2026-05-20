'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import {
  autoSlug, parseCsv, HEADER_MAP, normalizeHeaders, getCol, fetchCsvText,
} from '@/lib/catalog/csv-utils'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ImportRow {
  row_num: number
  supplier_sku: string
  name: string
  price_uah: number | null
  stock_quantity: number
  is_in_stock: boolean
  main_image_url: string | null
  images: string[] | null
  description: string | null
  meta_title: string | null
  meta_description: string | null
  category_raw: string | null
  category_slug: string | null
  action: 'new' | 'update' | 'skip'
  seo_preserved: boolean
  existing_id?: string
}

export interface ImportPreview {
  ok: boolean
  error?: string
  total: number
  new_count: number
  update_count: number
  skip_count: number
  rows: ImportRow[]
  response_url: string
}

export interface ApplyResult {
  ok: boolean
  inserted: number
  updated: number
  errors: number
  message: string
}

export interface CatSeoRow {
  row_num: number
  name_raw: string
  description: string | null
  matched_slug: string | null
  matched_id: string | null
  action: 'update' | 'skip'
}

export interface CatSeoPreview {
  ok: boolean
  error?: string
  total: number
  update_count: number
  skip_count: number
  rows: CatSeoRow[]
  response_url: string
}

export interface CatSeoResult {
  ok: boolean
  updated: number
  skipped: number
  errors: number
  message: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildCatNameMap(cats: { id: string; slug: string; name_ua: string }[]): Map<string, { id: string; slug: string }> {
  const m = new Map<string, { id: string; slug: string }>()
  for (const c of cats) m.set(c.name_ua.toLowerCase().trim(), { id: c.id, slug: c.slug })
  return m
}

// ─── Product import (preview) ─────────────────────────────────────────────────

export async function previewSheetImport(formData: FormData): Promise<ImportPreview> {
  const rawUrl = (formData.get('sheet_url') as string ?? '').trim()
  const limitStr = formData.get('limit') as string | null
  const limit = Math.min(parseInt(limitStr ?? '100', 10) || 100, 500)

  if (!rawUrl) return { ok: false, error: 'URL таблиці не вказано', total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: '' }

  const fetched = await fetchCsvText(rawUrl)
  if (!fetched.ok) return { ok: false, error: fetched.error, total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: fetched.csvUrl }

  const allRows = parseCsv(fetched.text)
  if (allRows.length < 2) return { ok: false, error: 'Таблиця порожня або не містить рядків даних', total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: fetched.csvUrl }

  const headers = normalizeHeaders(allRows[0])
  const dataRows = allRows.slice(1, limit + 1)

  const client = getAdminClient()
  const skuSet = new Set(dataRows.map((r) => getCol(r, headers, 'sku')).filter(Boolean))

  const [existingRes, catsRes] = await Promise.all([
    client.from('catalog_products').select('id, supplier_sku, meta_title, meta_description').in('supplier_sku', Array.from(skuSet)),
    client.from('catalog_categories').select('id, slug, name_ua'),
  ])

  const existingBySku = new Map((existingRes.data ?? []).map((e) => [e.supplier_sku, e]))
  const catNameMap = buildCatNameMap(catsRes.data ?? [])

  const rows: ImportRow[] = []
  let newCount = 0, updateCount = 0, skipCount = 0

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i]
    const sku = getCol(r, headers, 'sku')
    if (!sku) { skipCount++; continue }

    const priceStr = getCol(r, headers, 'price').replace(/[^\d.]/g, '')
    const stockStr = getCol(r, headers, 'stock').replace(/[^\d]/g, '')
    const imgRaw = getCol(r, headers, 'images')
    const images = imgRaw ? imgRaw.split(/[,;\s]+/).map((u) => u.trim()).filter((u) => u.startsWith('http')) : []
    const metaTitleNew = getCol(r, headers, 'meta_title') || null
    const metaDescNew = getCol(r, headers, 'meta_description') || null
    const categoryRaw = getCol(r, headers, 'category') || null
    const primaryCatName = categoryRaw ? categoryRaw.split(/[,;|]+/)[0].trim() : null
    const catMatch = primaryCatName ? catNameMap.get(primaryCatName.toLowerCase()) : null

    const ex = existingBySku.get(sku)
    const seoPreserved = !!(ex && ((ex.meta_title && metaTitleNew) || (ex.meta_description && metaDescNew)))

    rows.push({
      row_num: i + 2,
      supplier_sku: sku,
      name: getCol(r, headers, 'name'),
      price_uah: priceStr ? Number(priceStr) : null,
      stock_quantity: stockStr ? Number(stockStr) : 0,
      is_in_stock: Number(stockStr || 0) > 0,
      main_image_url: images[0] ?? null,
      images: images.length > 0 ? images : null,
      description: getCol(r, headers, 'description') || null,
      meta_title: metaTitleNew,
      meta_description: metaDescNew,
      category_raw: categoryRaw,
      category_slug: catMatch?.slug ?? null,
      action: ex ? 'update' : 'new',
      seo_preserved: seoPreserved,
      existing_id: ex?.id,
    })

    if (ex) updateCount++; else newCount++
  }

  return { ok: true, total: rows.length, new_count: newCount, update_count: updateCount, skip_count: skipCount, rows, response_url: fetched.csvUrl }
}

// ─── Product import (apply) ──────────────────────────────────────────────────

export async function applySheetImport(rows: ImportRow[], overwriteSeo: boolean): Promise<ApplyResult> {
  const client = getAdminClient()
  let inserted = 0, updated = 0, errors = 0

  const newRows = rows.filter((r) => r.action === 'new' && r.name)
  const slugCandidates = newRows.map((r) => autoSlug(`${r.name} ${r.supplier_sku}`))
  const { data: existingSlugs } = await client.from('catalog_products').select('slug').in('slug', slugCandidates)
  const takenSlugs = new Set((existingSlugs ?? []).map((s) => s.slug))

  const CHUNK = 100
  const toInsert: Record<string, unknown>[] = []
  const toUpdate: { sku: string; payload: Record<string, unknown> }[] = []

  for (const row of rows) {
    if (row.action === 'skip') continue

    if (row.action === 'new') {
      if (!row.name || row.price_uah == null) { errors++; continue }
      let slug = autoSlug(`${row.name} ${row.supplier_sku}`)
      if (takenSlugs.has(slug)) slug = `${slug}-${Date.now()}`
      takenSlugs.add(slug)
      toInsert.push({
        supplier_sku: row.supplier_sku,
        name_ua: row.name,
        slug,
        category_slug: row.category_slug,
        description: row.description,
        price_uah: row.price_uah,
        main_image_url: row.main_image_url,
        images: row.images,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        status: 'draft',
        is_featured: false,
        display_order: 0,
      })
    } else {
      const payload: Record<string, unknown> = {
        name_ua: row.name || undefined,
        description: row.description,
        main_image_url: row.main_image_url,
        images: row.images,
        updated_at: new Date().toISOString(),
      }
      if (row.price_uah != null) payload.price_uah = row.price_uah
      if (row.category_slug) payload.category_slug = row.category_slug
      if (overwriteSeo || !row.seo_preserved) {
        if (row.meta_title) payload.meta_title = row.meta_title
        if (row.meta_description) payload.meta_description = row.meta_description
      }
      toUpdate.push({ sku: row.supplier_sku, payload })
    }
  }

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const { error } = await client.from('catalog_products').insert(toInsert.slice(i, i + CHUNK))
    if (error) errors += Math.min(CHUNK, toInsert.length - i)
    else inserted += Math.min(CHUNK, toInsert.length - i)
  }

  for (const { sku, payload } of toUpdate) {
    const { error } = await client.from('catalog_products').update(payload).eq('supplier_sku', sku)
    if (error) errors++; else updated++
  }

  revalidatePath('/admin/catalog')
  revalidatePath('/catalog')

  return {
    ok: errors === 0,
    inserted, updated, errors,
    message: `Імпортовано: ${inserted} нових + ${updated} оновлених${errors > 0 ? `, ${errors} помилок` : ''}`,
  }
}

// ─── Category SEO import (preview) ───────────────────────────────────────────

export async function previewCategorySeoImport(formData: FormData): Promise<CatSeoPreview> {
  const rawUrl = (formData.get('cat_sheet_url') as string ?? '').trim()
  if (!rawUrl) return { ok: false, error: 'URL таблиці не вказано', total: 0, update_count: 0, skip_count: 0, rows: [], response_url: '' }

  const fetched = await fetchCsvText(rawUrl)
  if (!fetched.ok) return { ok: false, error: fetched.error, total: 0, update_count: 0, skip_count: 0, rows: [], response_url: fetched.csvUrl }

  const allRows = parseCsv(fetched.text)
  if (allRows.length < 2) return { ok: false, error: 'Таблиця порожня', total: 0, update_count: 0, skip_count: 0, rows: [], response_url: fetched.csvUrl }

  const headers = allRows[0]
  const dataRows = allRows.slice(1)

  const nameIdx = headers.findIndex((h) => ['category', 'категорія', 'категория', 'name', 'назва'].includes(h.toLowerCase().trim()))
  const descIdx = headers.findIndex((h) => ['description', 'опис', 'описание'].includes(h.toLowerCase().trim()))

  if (nameIdx < 0) return { ok: false, error: 'Не знайдено колонку "Category" або "Категорія"', total: 0, update_count: 0, skip_count: 0, rows: [], response_url: fetched.csvUrl }

  const client = getAdminClient()
  const { data: cats } = await client.from('catalog_categories').select('id, slug, name_ua')
  const catNameMap = new Map((cats ?? []).map((c) => [c.name_ua.toLowerCase().trim(), { id: c.id, slug: c.slug }]))

  const rows: CatSeoRow[] = []
  let updateCount = 0, skipCount = 0

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i]
    const nameRaw = (r[nameIdx] ?? '').trim()
    const description = descIdx >= 0 ? (r[descIdx] ?? '').trim() || null : null
    if (!nameRaw) { skipCount++; continue }

    const match = catNameMap.get(nameRaw.toLowerCase())
    if (!match) {
      rows.push({ row_num: i + 2, name_raw: nameRaw, description, matched_slug: null, matched_id: null, action: 'skip' })
      skipCount++
      continue
    }
    rows.push({ row_num: i + 2, name_raw: nameRaw, description, matched_slug: match.slug, matched_id: match.id, action: 'update' })
    updateCount++
  }

  return { ok: true, total: rows.length, update_count: updateCount, skip_count: skipCount, rows, response_url: fetched.csvUrl }
}

// ─── Category SEO import (apply) ─────────────────────────────────────────────

export async function applyCategorySeoImport(rows: CatSeoRow[]): Promise<CatSeoResult> {
  const client = getAdminClient()
  let updated = 0, skipped = 0, errors = 0

  for (const row of rows) {
    if (row.action === 'skip' || !row.matched_id) { skipped++; continue }
    const payload: Record<string, unknown> = {}
    if (row.description) {
      payload.description = row.description
      payload.meta_description = row.description.slice(0, 160)
    }
    if (Object.keys(payload).length === 0) { skipped++; continue }
    const { error } = await client.from('catalog_categories').update(payload).eq('id', row.matched_id)
    if (error) errors++; else updated++
  }

  revalidatePath('/admin/catalog/categories')
  revalidatePath('/catalog')

  return {
    ok: errors === 0, updated, skipped, errors,
    message: `Оновлено ${updated} категорій${skipped > 0 ? `, ${skipped} пропущено` : ''}${errors > 0 ? `, ${errors} помилок` : ''}`,
  }
}

// ─── Helpers exported for HEADER_MAP reference ────────────────────────────────
export { HEADER_MAP }
