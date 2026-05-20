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

// ─── Slug helper ─────────────────────────────────────────────────────────────

function autoSlug(text: string): string {
  const map: Record<string, string> = {
    а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
    и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
    р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'yu',я:'ya',
  }
  return text.toLowerCase().split('').map((c) => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`
}

// ─── CSV helpers ─────────────────────────────────────────────────────────────

function normalizeSheetUrl(raw: string): string {
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return raw.trim()
  const sheetId = match[1]
  const gidMatch = raw.match(/[#&?]gid=(\d+)/)
  const gid = gidMatch ? gidMatch[1] : '0'
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
}

function parseCsv(text: string): string[][] {
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

// Maps normalized header → internal field name.
// NOTE: "id" is intentionally NOT mapped to "sku" — when a sheet has both ID
// and SKU columns, SKU is the match key; ID is ignored.
const HEADER_MAP: Record<string, string> = {
  // SKU — explicit column wins; "id" alone maps to sku only as fallback (handled below)
  sku: 'sku', article: 'sku', артикул: 'sku', supplier_sku: 'sku', код: 'sku',
  // Name
  name: 'name', title: 'name', назва: 'name', наименование: 'name', name_ua: 'name', 'назва (укр)': 'name',
  // Price
  price: 'price', ціна: 'price', цена: 'price', price_uah: 'price',
  // Stock
  stock: 'stock', quantity: 'stock', qty: 'stock', залишок: 'stock', кількість: 'stock', stock_quantity: 'stock', in_stock: 'stock',
  // Images
  images: 'images', image: 'images', photo: 'images', фото: 'images', images_url: 'images', image_url: 'images',
  // Description
  description: 'description', опис: 'description', description_ua: 'description', опис_ua: 'description',
  // Meta
  meta_title: 'meta_title', 'meta title': 'meta_title', 'seo title': 'meta_title',
  meta_description: 'meta_description', 'meta description': 'meta_description', 'seo description': 'meta_description',
  // Keywords: accepted but not stored (ignored gracefully)
  meta_keywords: 'meta_keywords', keywords: 'meta_keywords', 'ключові слова': 'meta_keywords',
  // Category
  category: 'category', categories: 'category', категорія: 'category', категории: 'category', категория: 'category',
  // Category SEO sheet
  'category seo': 'cat_name', category_seo: 'cat_name',
}

function getCol(row: string[], headers: string[], field: string): string {
  const idx = headers.findIndex((h) => HEADER_MAP[h.toLowerCase().trim()] === field)
  return idx >= 0 ? (row[idx] ?? '').trim() : ''
}

// Build a case-insensitive name→category mapping from DB rows
function buildCatNameMap(cats: { id: string; slug: string; name_ua: string }[]): Map<string, { id: string; slug: string }> {
  const m = new Map<string, { id: string; slug: string }>()
  for (const c of cats) {
    m.set(c.name_ua.toLowerCase().trim(), { id: c.id, slug: c.slug })
  }
  return m
}

// ─── Product import (preview) ─────────────────────────────────────────────────
// Targets catalog_products. Matches by supplier_sku.

export async function previewSheetImport(formData: FormData): Promise<ImportPreview> {
  const rawUrl = (formData.get('sheet_url') as string ?? '').trim()
  const limitStr = formData.get('limit') as string | null
  const limit = Math.min(parseInt(limitStr ?? '100', 10) || 100, 500)

  if (!rawUrl) {
    return { ok: false, error: 'URL таблиці не вказано', total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: '' }
  }

  const csvUrl = normalizeSheetUrl(rawUrl)
  let csvText: string
  try {
    const res = await fetch(csvUrl, { cache: 'no-store', headers: { Accept: 'text/csv,*/*' } })
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status} при завантаженні таблиці`, total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
    }
    csvText = await res.text()
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
  }

  const allRows = parseCsv(csvText)
  if (allRows.length < 2) {
    return { ok: false, error: 'Таблиця порожня або не містить рядків даних', total: 0, new_count: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
  }

  const headers = allRows[0]
  // If sheet has no explicit SKU column but has an ID column, treat ID as SKU
  const hasSku = headers.some((h) => HEADER_MAP[h.toLowerCase().trim()] === 'sku')
  const hasId = headers.some((h) => h.toLowerCase().trim() === 'id')
  const normalizedHeaders = headers.map((h) => {
    if (!hasSku && hasId && h.toLowerCase().trim() === 'id') return 'SKU'
    return h
  })

  const dataRows = allRows.slice(1, limit + 1)

  const client = getAdminClient()
  const skuSet = new Set(dataRows.map((r) => getCol(r, normalizedHeaders, 'sku')).filter(Boolean))

  // Fetch existing catalog_products by sku
  const [existingRes, catsRes] = await Promise.all([
    client
      .from('catalog_products')
      .select('id, supplier_sku, meta_title, meta_description, status')
      .in('supplier_sku', Array.from(skuSet)),
    client
      .from('catalog_categories')
      .select('id, slug, name_ua'),
  ])

  const existingBySku = new Map((existingRes.data ?? []).map((e) => [e.supplier_sku, e]))
  const catNameMap = buildCatNameMap(catsRes.data ?? [])

  const rows: ImportRow[] = []
  let newCount = 0, updateCount = 0, skipCount = 0

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i]
    const sku = getCol(r, normalizedHeaders, 'sku')
    if (!sku) { skipCount++; continue }

    const priceStr = getCol(r, normalizedHeaders, 'price').replace(/[^\d.]/g, '')
    const stockStr = getCol(r, normalizedHeaders, 'stock').replace(/[^\d]/g, '')
    const imgRaw = getCol(r, normalizedHeaders, 'images')
    const images = imgRaw ? imgRaw.split(/[,;\s]+/).map((u) => u.trim()).filter((u) => u.startsWith('http')) : []
    const metaTitleNew = getCol(r, normalizedHeaders, 'meta_title') || null
    const metaDescNew = getCol(r, normalizedHeaders, 'meta_description') || null
    const categoryRaw = getCol(r, normalizedHeaders, 'category') || null

    // Resolve category: use first category name if comma-separated
    const primaryCatName = categoryRaw ? categoryRaw.split(/[,;|]+/)[0].trim() : null
    const catMatch = primaryCatName ? catNameMap.get(primaryCatName.toLowerCase()) : null
    const categorySlug = catMatch?.slug ?? null

    const ex = existingBySku.get(sku)
    const seoPreserved = !!(ex && ((ex.meta_title && metaTitleNew) || (ex.meta_description && metaDescNew)))

    rows.push({
      row_num: i + 2,
      supplier_sku: sku,
      name: getCol(r, normalizedHeaders, 'name'),
      price_uah: priceStr ? Number(priceStr) : null,
      stock_quantity: stockStr ? Number(stockStr) : 0,
      is_in_stock: Number(stockStr || 0) > 0,
      main_image_url: images[0] ?? null,
      images: images.length > 0 ? images : null,
      description: getCol(r, normalizedHeaders, 'description') || null,
      meta_title: metaTitleNew,
      meta_description: metaDescNew,
      category_raw: categoryRaw,
      category_slug: categorySlug,
      action: ex ? 'update' : 'new',
      seo_preserved: seoPreserved,
      existing_id: ex?.id,
    })

    if (ex) updateCount++; else newCount++
  }

  return { ok: true, total: rows.length, new_count: newCount, update_count: updateCount, skip_count: skipCount, rows, response_url: csvUrl }
}

// ─── Product import (apply) ──────────────────────────────────────────────────
// Writes to catalog_products. New products → status='draft'.
// Existing products: update content/SEO fields only (no status change).

export async function applySheetImport(rows: ImportRow[], overwriteSeo: boolean): Promise<ApplyResult> {
  const client = getAdminClient()
  let inserted = 0, updated = 0, errors = 0

  // Collect slugs already in catalog_products to avoid collisions on insert
  const newRows = rows.filter((r) => r.action === 'new' && r.name)
  const slugCandidates = newRows.map((r) => autoSlug(`${r.name} ${r.supplier_sku}`))
  const { data: existingSlugs } = await client
    .from('catalog_products')
    .select('slug')
    .in('slug', slugCandidates)
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

  // Batch insert
  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const { error } = await client.from('catalog_products').insert(toInsert.slice(i, i + CHUNK))
    if (error) errors += Math.min(CHUNK, toInsert.length - i)
    else inserted += Math.min(CHUNK, toInsert.length - i)
  }

  // Updates (N updates, but typically small batch from sheet)
  for (const { sku, payload } of toUpdate) {
    const { error } = await client.from('catalog_products').update(payload).eq('supplier_sku', sku)
    if (error) errors++; else updated++
  }

  revalidatePath('/admin/catalog')
  revalidatePath('/catalog')

  return {
    ok: errors === 0,
    inserted,
    updated,
    errors,
    message: `Імпортовано: ${inserted} нових + ${updated} оновлених${errors > 0 ? `, ${errors} помилок` : ''}`,
  }
}

// ─── Category SEO import (preview) ───────────────────────────────────────────
// Sheet columns: Category | Description
// Matches catalog_categories by name_ua, updates description field.

export async function previewCategorySeoImport(formData: FormData): Promise<CatSeoPreview> {
  const rawUrl = (formData.get('cat_sheet_url') as string ?? '').trim()
  if (!rawUrl) {
    return { ok: false, error: 'URL таблиці не вказано', total: 0, update_count: 0, skip_count: 0, rows: [], response_url: '' }
  }

  const csvUrl = normalizeSheetUrl(rawUrl)
  let csvText: string
  try {
    const res = await fetch(csvUrl, { cache: 'no-store', headers: { Accept: 'text/csv,*/*' } })
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, total: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
    }
    csvText = await res.text()
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), total: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
  }

  const allRows = parseCsv(csvText)
  if (allRows.length < 2) {
    return { ok: false, error: 'Таблиця порожня', total: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
  }

  const headers = allRows[0]
  const dataRows = allRows.slice(1)

  // Detect name column: "Category" or "Категорія"
  const nameIdx = headers.findIndex((h) => {
    const k = h.toLowerCase().trim()
    return k === 'category' || k === 'категорія' || k === 'категория' || k === 'name' || k === 'назва'
  })
  const descIdx = headers.findIndex((h) => {
    const k = h.toLowerCase().trim()
    return k === 'description' || k === 'опис' || k === 'описание'
  })

  if (nameIdx < 0) {
    return { ok: false, error: 'Не знайдено колонку "Category" або "Категорія"', total: 0, update_count: 0, skip_count: 0, rows: [], response_url: csvUrl }
  }

  const client = getAdminClient()
  const { data: cats } = await client.from('catalog_categories').select('id, slug, name_ua')
  const catNameMap = buildCatNameMap(cats ?? [])

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

  return { ok: true, total: rows.length, update_count: updateCount, skip_count: skipCount, rows, response_url: csvUrl }
}

// ─── Category SEO import (apply) ─────────────────────────────────────────────

export async function applyCategorySeoImport(rows: CatSeoRow[]): Promise<CatSeoResult> {
  const client = getAdminClient()
  let updated = 0, skipped = 0, errors = 0

  for (const row of rows) {
    if (row.action === 'skip' || !row.matched_id) { skipped++; continue }

    const payload: Record<string, unknown> = {}
    if (row.description) payload.description = row.description
    // Auto-fill meta_description from description if not set
    if (row.description) payload.meta_description = row.description.slice(0, 160)

    if (Object.keys(payload).length === 0) { skipped++; continue }

    const { error } = await client
      .from('catalog_categories')
      .update(payload)
      .eq('id', row.matched_id)

    if (error) errors++; else updated++
  }

  revalidatePath('/admin/catalog/categories')
  revalidatePath('/catalog')

  return {
    ok: errors === 0,
    updated,
    skipped,
    errors,
    message: `Оновлено ${updated} категорій${skipped > 0 ? `, ${skipped} пропущено` : ''}${errors > 0 ? `, ${errors} помилок` : ''}`,
  }
}
