'use server'

import { getAdminClient } from '@/lib/supabase/admin'

function getApiConfig() {
  const url = process.env.SUPPLIER_API_URL
  const key = process.env.SUPPLIER_API_KEY
  if (!url || !key) throw new Error('SUPPLIER_API_URL and SUPPLIER_API_KEY env vars are required')
  return { url: url.replace(/\/$/, ''), key }
}

async function apiFetch(path: string): Promise<unknown> {
  const { url, key } = getApiConfig()
  const res = await fetch(`${url}${path}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Supplier API ${path} → ${res.status} ${res.statusText}`)
  return res.json()
}

function toArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    return (d.data ?? d.items ?? d.products ?? d.categories ?? []) as unknown[]
  }
  return []
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

export interface SyncResult {
  ok: boolean
  synced: number
  errors: number
  message: string
}

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
    const raw = await apiFetch('/categories')
    const categories = toArray(raw)

    for (const cat of categories) {
      const c = cat as Record<string, unknown>
      const { error } = await client.from('supplier_categories').upsert(
        {
          supplier_id: String(c.id ?? c.supplier_id ?? ''),
          name: String(c.name ?? c.title ?? ''),
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
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)

    return { ok: errors === 0, synced, errors, message: `Синхронізовано ${synced} категорій` }
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
    const params = new URLSearchParams()
    if (options?.categoryId) params.set('category_id', options.categoryId)
    if (options?.page) params.set('page', String(options.page))
    if (options?.pageSize) params.set('per_page', String(options.pageSize))

    const path = `/products${params.toString() ? `?${params}` : ''}`
    const raw = await apiFetch(path)
    const products = toArray(raw)

    for (const prod of products) {
      const p = prod as Record<string, unknown>
      const sku = String(p.id ?? p.sku ?? p.supplier_sku ?? '')
      if (!sku) { errors++; continue }

      const { data: existing } = await client
        .from('supplier_products')
        .select('id')
        .eq('supplier_sku', sku)
        .single()

      const images = Array.isArray(p.images)
        ? (p.images as string[])
        : p.image ? [String(p.image)] : []

      const row = {
        supplier_sku: sku,
        supplier_category_id: p.category_id ? String(p.category_id) : null,
        name: String(p.name ?? p.title ?? ''),
        name_ua: p.name_ua ? String(p.name_ua) : null,
        slug: p.slug ? String(p.slug) : autoSlug(String(p.name ?? p.title ?? sku)),
        description: p.description ? String(p.description) : null,
        description_ua: p.description_ua ? String(p.description_ua) : null,
        short_description_ua: p.short_description_ua ? String(p.short_description_ua) : null,
        price_uah: p.price != null ? Number(p.price) : null,
        stock_quantity: p.stock != null ? Number(p.stock) : (p.quantity != null ? Number(p.quantity) : 0),
        is_in_stock: Number(p.stock ?? p.quantity ?? 0) > 0,
        main_image_url: images[0] ?? null,
        images: images.length > 0 ? images : null,
        attributes: typeof p.attributes === 'object' ? p.attributes as Record<string, unknown> : null,
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
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)

    return {
      ok: errors === 0,
      synced,
      errors,
      message: `Синхронізовано ${synced} продуктів (нових: ${isNew})`,
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
    const raw = await apiFetch('/prices')
    const items = toArray(raw)

    for (const item of items) {
      const i = item as Record<string, unknown>
      const sku = String(i.id ?? i.sku ?? '')
      if (!sku) continue

      const { error } = await client.from('supplier_products').update({
        price_uah: i.price != null ? Number(i.price) : null,
        stock_quantity: Number(i.stock ?? i.quantity ?? 0),
        is_in_stock: Number(i.stock ?? i.quantity ?? 0) > 0,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('supplier_sku', sku)

      if (error) errors++; else synced++
    }

    await client.from('supplier_sync_log').update({
      status: 'completed',
      products_updated: synced,
      products_errors: errors,
      completed_at: new Date().toISOString(),
    }).eq('id', log?.id)

    return { ok: errors === 0, synced, errors, message: `Оновлено ${synced} позицій` }
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
