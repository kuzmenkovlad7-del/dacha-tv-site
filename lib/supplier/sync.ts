'use server'

import { getAdminClient } from '@/lib/supabase/admin'

// ─── API config ───────────────────────────────────────────────────────────────
// personal.cab uses a single base endpoint with query-param routing:
//   GET {SUPPLIER_API_URL}?key=KEY&method=METHOD&type=json
// Do NOT append REST paths. Do NOT use Bearer auth.

function getApiConfig() {
  const url = process.env.SUPPLIER_API_URL
  const key = process.env.SUPPLIER_API_KEY
  if (!url || !key) throw new Error('SUPPLIER_API_URL and SUPPLIER_API_KEY env vars are required')
  return { base: url.replace(/\/$/, ''), key }
}

interface ApiFetchResult {
  raw: unknown
  safeUrl: string   // key masked for logging
  httpStatus: number
  topLevelKeys: string[]
}

async function apiFetch(method: string, extra: Record<string, string> = {}): Promise<ApiFetchResult> {
  const { base, key } = getApiConfig()
  const params = new URLSearchParams({ key, method, type: 'json', ...extra })
  const fullUrl = `${base}?${params}`
  const safeUrl = `${base}?method=${method}&type=json&key=***`

  const res = await fetch(fullUrl, { cache: 'no-store', headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`personal.cab API method=${method} → ${res.status} ${res.statusText}`)

  const raw = await res.json()
  const topLevelKeys = raw && typeof raw === 'object' ? Object.keys(raw as object) : []
  return { raw, safeUrl, httpStatus: res.status, topLevelKeys }
}

// ─── Response normalisation ───────────────────────────────────────────────────

function extractProducts(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (!raw || typeof raw !== 'object') return []
  const d = raw as Record<string, unknown>

  // Explicit array keys — personal.cab uses "products" or "tovar"
  for (const k of ['products', 'tovar', 'data', 'items', 'result', 'results', 'list', 'goods']) {
    if (Array.isArray(d[k])) return d[k] as unknown[]
  }

  // Object-map keyed by id (some APIs return {"123": {...}, "124": {...}})
  const vals = Object.values(d)
  if (vals.length > 0 && typeof vals[0] === 'object' && vals[0] !== null) {
    const first = vals[0] as Record<string, unknown>
    if (first.id != null || first.name != null || first.price != null) return vals
  }

  return []
}

function extractCategories(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (!raw || typeof raw !== 'object') return []
  const d = raw as Record<string, unknown>

  for (const k of ['categories', 'cats', 'groups', 'sections', 'data', 'result', 'results', 'list', 'items']) {
    if (Array.isArray(d[k])) return d[k] as unknown[]
  }
  return []
}

// Derive unique categories from a products array when no dedicated categories endpoint exists
function deriveCategories(products: unknown[]): unknown[] {
  const seen = new Map<string, unknown>()
  for (const p of products) {
    if (!p || typeof p !== 'object') continue
    const prod = p as Record<string, unknown>
    const catId = String(prod.category_id ?? prod.cat_id ?? prod.group_id ?? '').trim()
    if (!catId || seen.has(catId)) continue
    seen.set(catId, {
      id: catId,
      name: String(prod.category ?? prod.category_name ?? prod.cat_name ?? prod.group ?? catId),
    })
  }
  return Array.from(seen.values())
}

function autoSlug(text: string): string {
  const map: Record<string, string> = {
    а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
    и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
    р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'yu',я:'ya',
  }
  return text.toLowerCase().split('').map((c) => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`
}

function summarise(records: unknown[], limit = 3): unknown[] {
  return records.slice(0, limit).map((r) => {
    if (!r || typeof r !== 'object') return r
    const o = r as Record<string, unknown>
    return {
      id: o.id ?? o.supplier_id,
      sku: o.sku ?? o.vendor_code ?? o.article,
      name: o.name ?? o.title,
      price: o.price ?? o.price_uah ?? o.retail_price,
      stock: o.quantity ?? o.stock ?? o.count,
      category_id: o.category_id ?? o.cat_id,
    }
  })
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SyncResult {
  ok: boolean
  synced: number
  errors: number
  message: string
}

// ─── Categories sync ──────────────────────────────────────────────────────────

export async function syncSupplierCategories(): Promise<SyncResult> {
  const client = getAdminClient()

  const { data: log } = await client
    .from('supplier_sync_log')
    .insert({ sync_type: 'categories', status: 'running', triggered_by: 'admin' })
    .select('id')
    .single()

  let synced = 0
  let errors = 0

  try {
    // Try dedicated categories method first; fall back to deriving from products
    let categories: unknown[] = []
    let safeUrl = ''
    let httpStatus = 0
    let topLevelKeys: string[] = []
    let source = 'get_categories'

    try {
      const result = await apiFetch('get_categories')
      safeUrl = result.safeUrl
      httpStatus = result.httpStatus
      topLevelKeys = result.topLevelKeys
      categories = extractCategories(result.raw)
    } catch {
      // dedicated endpoint not available — fall through to product-derived
    }

    if (categories.length === 0) {
      source = 'derived_from_get_products'
      const result = await apiFetch('get_products')
      safeUrl = result.safeUrl
      httpStatus = result.httpStatus
      topLevelKeys = result.topLevelKeys
      const products = extractProducts(result.raw)
      categories = deriveCategories(products)
    }

    const debugInfo = {
      source,
      safe_url: safeUrl,
      http_status: httpStatus,
      response_top_keys: topLevelKeys,
      response_count: categories.length,
      sample_records: summarise(categories),
    }

    if (categories.length === 0) {
      await client.from('supplier_sync_log').update({
        status: 'completed',
        categories_total: 0,
        error_details: { ...debugInfo, warning: 'API returned 0 categories and no category_id found in products' },
        completed_at: new Date().toISOString(),
      }).eq('id', log?.id)
      return { ok: false, synced: 0, errors: 0, message: 'API повернуло 0 категорій — перевірте URL та ключ' }
    }

    for (const cat of categories) {
      const c = cat as Record<string, unknown>
      const supplierId = String(c.id ?? c.supplier_id ?? c.category_id ?? '').trim()
      if (!supplierId) { errors++; continue }

      const { error } = await client.from('supplier_categories').upsert(
        {
          supplier_id: supplierId,
          name: String(c.name ?? c.title ?? c.category_name ?? supplierId),
          name_ua: c.name_ua ? String(c.name_ua) : null,
          slug: c.slug ? String(c.slug) : null,
          parent_supplier_id: c.parent_id ? String(c.parent_id) : null,
          raw_data: c,
          synced_at: new Date().toISOString(),
        },
        { onConflict: 'supplier_id' },
      )
      if (error) errors++; else synced++
    }

    await client.from('supplier_sync_log').update({
      status: 'completed',
      categories_total: synced,
      products_errors: errors,
      error_details: { ...debugInfo, synced, errors },
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)

    return { ok: errors === 0, synced, errors, message: `Збережено ${synced} категорій (у відповіді: ${categories.length}, джерело: ${source})` }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await client.from('supplier_sync_log').update({
      status: 'failed',
      error_details: { message: msg },
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)
    throw e
  }
}

// ─── Products sync ────────────────────────────────────────────────────────────

export async function syncSupplierProducts(options?: {
  categoryId?: string
  page?: number
  pageSize?: number
}): Promise<SyncResult> {
  const client = getAdminClient()

  const { data: log } = await client
    .from('supplier_sync_log')
    .insert({ sync_type: 'products', status: 'running', triggered_by: 'admin' })
    .select('id')
    .single()

  let synced = 0
  let isNew = 0
  let errors = 0

  try {
    const extra: Record<string, string> = {}
    if (options?.categoryId) extra.category_id = options.categoryId
    if (options?.page) extra.page = String(options.page)
    // Note: personal.cab may not support per_page — only add if confirmed supported
    // if (options?.pageSize) extra.per_page = String(options.pageSize)

    const { raw, safeUrl, httpStatus, topLevelKeys } = await apiFetch('get_products', extra)
    const products = extractProducts(raw)

    const debugInfo = {
      safe_url: safeUrl,
      http_status: httpStatus,
      response_top_keys: topLevelKeys,
      response_count: products.length,
      sample_records: summarise(products),
    }

    if (products.length === 0) {
      await client.from('supplier_sync_log').update({
        status: 'completed',
        products_total: 0,
        error_details: { ...debugInfo, warning: 'API returned 0 products — check URL, key, and method' },
        completed_at: new Date().toISOString(),
      }).eq('id', log?.id)
      return { ok: false, synced: 0, errors: 0, message: `API повернуло 0 продуктів. Ключі у відповіді: ${topLevelKeys.join(', ') || 'none'}` }
    }

    for (const prod of products) {
      const p = prod as Record<string, unknown>

      // SKU: personal.cab typically uses id or vendor_code
      const sku = String(
        p.id ?? p.vendor_code ?? p.sku ?? p.article ?? p.supplier_sku ?? ''
      ).trim()
      if (!sku) { errors++; continue }

      const { data: existing } = await client
        .from('supplier_products')
        .select('id')
        .eq('supplier_sku', sku)
        .single()

      // Images: handle string, array, or comma-separated
      let images: string[] = []
      if (Array.isArray(p.images)) {
        images = (p.images as unknown[]).map(String).filter(Boolean)
      } else if (typeof p.images === 'string' && p.images) {
        images = p.images.split(',').map((s) => s.trim()).filter(Boolean)
      } else if (p.image) {
        images = [String(p.image)]
      } else if (p.photo) {
        images = [String(p.photo)]
      }

      // Price: personal.cab may use price, retail_price, price_uah
      const priceRaw = p.price ?? p.retail_price ?? p.price_uah ?? p.cost
      // Stock: personal.cab typically uses quantity or count
      const stockRaw = p.quantity ?? p.count ?? p.stock ?? p.stock_quantity ?? p.qty

      const row = {
        supplier_sku: sku,
        supplier_category_id: p.category_id != null ? String(p.category_id) : (p.cat_id != null ? String(p.cat_id) : null),
        name: String(p.name ?? p.title ?? ''),
        name_ua: p.name_ua ? String(p.name_ua) : null,
        slug: p.slug ? String(p.slug) : autoSlug(String(p.name ?? p.title ?? sku)),
        description: p.description ? String(p.description) : null,
        description_ua: p.description_ua ? String(p.description_ua) : null,
        short_description_ua: p.short_description_ua ? String(p.short_description_ua) : null,
        price_uah: priceRaw != null ? Number(priceRaw) : null,
        stock_quantity: stockRaw != null ? Number(stockRaw) : 0,
        is_in_stock: Number(stockRaw ?? 0) > 0,
        main_image_url: images[0] ?? null,
        images: images.length > 0 ? images : null,
        attributes: p.attributes && typeof p.attributes === 'object'
          ? p.attributes as Record<string, unknown>
          : null,
        weight_kg: p.weight != null ? Number(p.weight) : null,
        raw_data: p,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = existing
        ? await client.from('supplier_products').update(row).eq('supplier_sku', sku)
        : await client.from('supplier_products').insert(row)

      if (error) errors++
      else { synced++; if (!existing) isNew++ }
    }

    await client.from('supplier_sync_log').update({
      status: 'completed',
      products_total: synced,
      products_new: isNew,
      products_updated: synced - isNew,
      products_errors: errors,
      error_details: { ...debugInfo, synced, errors, new: isNew },
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)

    return {
      ok: errors === 0,
      synced,
      errors,
      message: `Збережено ${synced} продуктів (нових: ${isNew}, у відповіді: ${products.length})`,
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await client.from('supplier_sync_log').update({
      status: 'failed',
      error_details: { message: msg },
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)
    throw e
  }
}

// ─── Prices + stock sync ──────────────────────────────────────────────────────
// personal.cab has no dedicated prices endpoint — re-fetch get_products for fresh data.

export async function syncPricesAndStock(): Promise<SyncResult> {
  const client = getAdminClient()

  const { data: log } = await client
    .from('supplier_sync_log')
    .insert({ sync_type: 'prices_stock', status: 'running', triggered_by: 'admin' })
    .select('id')
    .single()

  let synced = 0
  let errors = 0

  try {
    const { raw, safeUrl, httpStatus, topLevelKeys } = await apiFetch('get_products')
    const items = extractProducts(raw)

    const debugInfo = {
      safe_url: safeUrl,
      http_status: httpStatus,
      response_top_keys: topLevelKeys,
      response_count: items.length,
      sample_records: summarise(items),
    }

    for (const item of items) {
      const i = item as Record<string, unknown>
      const sku = String(i.id ?? i.vendor_code ?? i.sku ?? i.article ?? '').trim()
      if (!sku) continue

      const stockRaw = i.quantity ?? i.count ?? i.stock ?? i.stock_quantity
      const priceRaw = i.price ?? i.retail_price ?? i.price_uah
      const { error } = await client.from('supplier_products').update({
        price_uah: priceRaw != null ? Number(priceRaw) : null,
        stock_quantity: Number(stockRaw ?? 0),
        is_in_stock: Number(stockRaw ?? 0) > 0,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('supplier_sku', sku)

      if (error) errors++; else synced++
    }

    await client.from('supplier_sync_log').update({
      status: 'completed',
      products_updated: synced,
      products_errors: errors,
      error_details: { ...debugInfo, synced, errors },
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)

    return { ok: errors === 0, synced, errors, message: `Оновлено ціни/залишки для ${synced} позицій (у відповіді: ${items.length})` }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await client.from('supplier_sync_log').update({
      status: 'failed',
      error_details: { message: msg },
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)
    throw e
  }
}
