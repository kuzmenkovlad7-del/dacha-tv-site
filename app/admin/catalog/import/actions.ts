'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

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
  description_ua: string | null
  meta_title: string | null
  meta_description: string | null
  category_raw: string | null
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

// ─── CSV helpers ─────────────────────────────────────────────────────────────

function normalizeSheetUrl(raw: string): string {
  // Convert Google Sheets share URL to CSV export URL
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return raw.trim()
  const sheetId = match[1]
  const gidMatch = raw.match(/[#&]gid=(\d+)/)
  const gid = gidMatch ? gidMatch[1] : '0'
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
}

function parseCsv(text: string): string[][] {
  // Strip UTF-8 BOM if present
  const clean = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text
  const rows: string[][] = []
  const lines = clean.split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim()) continue
    const cols: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur.trim())
        cur = ''
      } else {
        cur += ch
      }
    }
    cols.push(cur.trim())
    rows.push(cols)
  }
  return rows
}

// Flexible header → field mapping (case-insensitive, trim)
const HEADER_MAP: Record<string, string> = {
  // SKU / ID
  sku: 'sku', id: 'sku', article: 'sku', артикул: 'sku', supplier_sku: 'sku', код: 'sku',
  // Name
  name: 'name', title: 'name', назва: 'name', наименование: 'name', name_ua: 'name', 'назва (укр)': 'name',
  // Price
  price: 'price', ціна: 'price', цена: 'price', price_uah: 'price',
  // Stock
  stock: 'stock', quantity: 'stock', qty: 'stock', залишок: 'stock', кількість: 'stock', stock_quantity: 'stock',
  // Images
  images: 'images', image: 'images', photo: 'images', фото: 'images', images_url: 'images', image_url: 'images',
  // Description
  description: 'description', опис: 'description', description_ua: 'description',
  // Meta
  meta_title: 'meta_title', 'meta title': 'meta_title', 'seo title': 'meta_title',
  meta_description: 'meta_description', 'meta description': 'meta_description', 'seo description': 'meta_description',
  meta_keywords: 'meta_keywords', keywords: 'meta_keywords', 'ключові слова': 'meta_keywords',
  // Category
  category: 'category', categories: 'category', категорія: 'category', категория: 'category',
}

function mapHeaders(headers: string[]): number[] {
  return headers.map((h) => {
    const key = h.toLowerCase().trim()
    return HEADER_MAP[key] ? headers.indexOf(h) : -1
  })
}

function getCol(row: string[], headers: string[], field: string): string {
  const idx = headers.findIndex((h) => HEADER_MAP[h.toLowerCase().trim()] === field)
  return idx >= 0 ? (row[idx] ?? '').trim() : ''
}

// ─── Preview action (dry-run, no writes) ─────────────────────────────────────

export async function previewSheetImport(formData: FormData): Promise<ImportPreview> {
  const rawUrl = (formData.get('sheet_url') as string ?? '').trim()
  const limitStr = formData.get('limit') as string | null
  const limit = Math.min(parseInt(limitStr ?? '100', 10) || 100, 500)

  if (!rawUrl) return { ok: false, error: 'URL таблиці не вказано', total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: '' }

  const csvUrl = normalizeSheetUrl(rawUrl)

  let csvText: string
  try {
    const res = await fetch(csvUrl, { cache: 'no-store', headers: { Accept: 'text/csv,*/*' } })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status} при завантаженні таблиці`, total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
    csvText = await res.text()
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
  }

  const allRows = parseCsv(csvText)
  if (allRows.length < 2) return { ok: false, error: 'Таблиця порожня або не містить рядків даних', total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }

  const headers = allRows[0]
  const dataRows = allRows.slice(1, limit + 1)

  // Fetch existing SKUs from DB for comparison
  const client = getAdminClient()
  const skuSet = new Set(dataRows.map((r) => getCol(r, headers, 'sku')).filter(Boolean))
  const { data: existing } = await client
    .from('supplier_products')
    .select('id, supplier_sku, meta_title, meta_description, price_uah, stock_quantity')
    .in('supplier_sku', Array.from(skuSet))

  const existingBySku = new Map((existing ?? []).map((e) => [e.supplier_sku, e]))

  const rows: ImportRow[] = []
  let newCount = 0
  let updateCount = 0
  let skipCount = 0

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i]
    const sku = getCol(r, headers, 'sku')
    if (!sku) { skipCount++; continue }

    const priceStr = getCol(r, headers, 'price').replace(/[^\d.]/g, '')
    const stockStr = getCol(r, headers, 'stock').replace(/[^\d]/g, '')
    const imgRaw = getCol(r, headers, 'images')
    const images = imgRaw ? imgRaw.split(/[,;\s]+/).map((u) => u.trim()).filter(Boolean) : []

    const metaTitleNew = getCol(r, headers, 'meta_title') || null
    const metaDescNew = getCol(r, headers, 'meta_description') || null

    const ex = existingBySku.get(sku)
    const seoPreserved = !!(ex && ((ex.meta_title && metaTitleNew) || (ex.meta_description && metaDescNew)))

    rows.push({
      row_num: i + 2, // 1-indexed, +1 for header
      supplier_sku: sku,
      name: getCol(r, headers, 'name'),
      price_uah: priceStr ? Number(priceStr) : null,
      stock_quantity: stockStr ? Number(stockStr) : 0,
      is_in_stock: Number(stockStr || 0) > 0,
      main_image_url: images[0] ?? null,
      images: images.length > 0 ? images : null,
      description_ua: getCol(r, headers, 'description') || null,
      meta_title: metaTitleNew,
      meta_description: metaDescNew,
      category_raw: getCol(r, headers, 'category') || null,
      action: ex ? 'update' : 'new',
      seo_preserved: seoPreserved,
      existing_id: ex?.id,
    })

    if (ex) updateCount++
    else newCount++
  }

  return {
    ok: true,
    total: rows.length,
    new_count: newCount,
    update_count: updateCount,
    skip_count: skipCount,
    rows,
    response_url: csvUrl,
  }
}

// ─── Apply action (writes to supplier_products) ───────────────────────────────

export async function applySheetImport(
  rows: ImportRow[],
  overwriteSeo: boolean,
): Promise<ApplyResult> {
  const client = getAdminClient()
  let inserted = 0
  let updated = 0
  let errors = 0

  for (const row of rows) {
    if (row.action === 'skip') continue

    const base = {
      supplier_sku: row.supplier_sku,
      name: row.name || row.supplier_sku,
      name_ua: row.name || null,
      price_uah: row.price_uah,
      stock_quantity: row.stock_quantity,
      is_in_stock: row.is_in_stock,
      main_image_url: row.main_image_url,
      images: row.images,
      description_ua: row.description_ua,
      attributes: row.category_raw
        ? { category_raw: row.category_raw }
        : undefined,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (row.action === 'new') {
      const { error } = await client.from('supplier_products').insert({
        ...base,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
      })
      if (error) errors++; else inserted++
    } else {
      // Update: only overwrite SEO fields if overwriteSeo=true or fields were null
      const updatePayload: Record<string, unknown> = { ...base }
      if (overwriteSeo || !row.seo_preserved) {
        if (row.meta_title) updatePayload.meta_title = row.meta_title
        if (row.meta_description) updatePayload.meta_description = row.meta_description
      }

      const { error } = await client
        .from('supplier_products')
        .update(updatePayload)
        .eq('supplier_sku', row.supplier_sku)
      if (error) errors++; else updated++
    }
  }

  revalidatePath('/admin/catalog')
  revalidatePath('/admin/supplier')

  return {
    ok: errors === 0,
    inserted,
    updated,
    errors,
    message: `Імпортовано: ${inserted} нових + ${updated} оновлених${errors > 0 ? `, ${errors} помилок` : ''}`,
  }
}
