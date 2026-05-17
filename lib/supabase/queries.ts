import { createClient } from '@supabase/supabase-js'
import type { SiteSettings, HoneyProduct, ApiaryProduct, BeekeeperProduct, Review, FaqItem, FlowerProduct } from '@/types'
import type { ProductSection } from '@/lib/supabase/product-media'
import { STATIC_FLOWERS } from '@/lib/flowers-static'
import { STATIC_APIARY, STATIC_APIARY_BY_SLUG, STATIC_APIARY_SLUGS, STATIC_BEEKEEPER, STATIC_BEEKEEPER_SLUGS } from '@/lib/static-apiary'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMedia(section: ProductSection, productId: string, client: any) {
  const { data } = await client
    .from('product_media')
    .select('*')
    .eq('product_section', section)
    .eq('product_id', productId)
    .order('media_type', { ascending: true })
    .order('position', { ascending: true })
  return (data ?? [])
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client.from('site_settings').select('*').eq('id', 1).single()
  return data ?? null
}

export async function getAllHoneyProducts(): Promise<HoneyProduct[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('honey_products')
    .select('*')
    .order('price_plastic_uah', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })
  if (!data || data.length === 0) return []

  const ids = data.map((p: { id: string }) => p.id)
  const { data: mediaData } = await client
    .from('product_media')
    .select('*')
    .eq('product_section', 'honey')
    .in('product_id', ids)
    .order('position', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediaByProduct: Record<string, any[]> = {}
  for (const m of (mediaData ?? [])) {
    if (!mediaByProduct[m.product_id]) mediaByProduct[m.product_id] = []
    mediaByProduct[m.product_id].push(m)
  }

  return data.map((p: HoneyProduct) => ({ ...p, media: mediaByProduct[p.id] ?? [] }))
}

export async function getHoneyProductBySlug(slug: string): Promise<HoneyProduct | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client.from('honey_products').select('*').eq('slug', slug).single()
  if (!data) return null
  const media = await fetchMedia('honey', data.id, client).catch(() => [])
  return { ...data, media }
}

export async function getFeaturedHoneyProducts(): Promise<HoneyProduct[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('honey_products')
    .select('*')
    .eq('is_featured', true)
    .order('name', { ascending: true })
    .limit(4)
  return data ?? []
}

export async function getAllHoneySlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client.from('honey_products').select('slug')
  return (data ?? []).map((r) => r.slug)
}

export async function getAllApiaryProducts(): Promise<ApiaryProduct[]> {
  const client = getClient()
  if (!client) return STATIC_APIARY
  const { data } = await client
    .from('apiary_products')
    .select('*')
    .order('price_uah', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })
  if (!data || data.length === 0) return STATIC_APIARY

  const ids = data.map((p: { id: string }) => p.id)
  const { data: mediaData } = await client
    .from('product_media')
    .select('*')
    .eq('product_section', 'apiary')
    .in('product_id', ids)
    .order('position', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediaByProduct: Record<string, any[]> = {}
  for (const m of (mediaData ?? [])) {
    if (!mediaByProduct[m.product_id]) mediaByProduct[m.product_id] = []
    mediaByProduct[m.product_id].push(m)
  }

  return data.map((p: ApiaryProduct) => ({ ...p, media: mediaByProduct[p.id] ?? [] }))
}

export async function getApiaryProductBySlug(slug: string): Promise<ApiaryProduct | null> {
  const client = getClient()
  if (!client) return STATIC_APIARY_BY_SLUG[slug] ?? null
  const { data } = await client.from('apiary_products').select('*').eq('slug', slug).single()
  if (!data) return STATIC_APIARY_BY_SLUG[slug] ?? null
  const media = await fetchMedia('apiary', data.id, client).catch(() => [])
  return { ...data, media }
}

export async function getAllApiaryProductSlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return STATIC_APIARY_SLUGS
  const { data } = await client.from('apiary_products').select('slug')
  const dbSlugs = (data ?? []).map((r: { slug: string }) => r.slug)
  return dbSlugs.length > 0 ? dbSlugs : STATIC_APIARY_SLUGS
}

export async function getAllBeekeeperProducts(): Promise<BeekeeperProduct[]> {
  const client = getClient()
  if (!client) return STATIC_BEEKEEPER
  const { data } = await client
    .from('beekeeper_products')
    .select('*')
    .order('product_type', { ascending: true })
    .order('name', { ascending: true })
  if (!data || data.length === 0) return STATIC_BEEKEEPER

  // Batch-fetch all product_media for beekeeper in one query
  const ids = data.map((p: { id: string }) => p.id)
  const { data: mediaData } = await client
    .from('product_media')
    .select('*')
    .eq('product_section', 'beekeeper')
    .in('product_id', ids)
    .order('position', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediaByProduct: Record<string, any[]> = {}
  for (const m of (mediaData ?? [])) {
    if (!mediaByProduct[m.product_id]) mediaByProduct[m.product_id] = []
    mediaByProduct[m.product_id].push(m)
  }

  return data.map((p: BeekeeperProduct) => ({ ...p, media: mediaByProduct[p.id] ?? [] }))
}

export async function getBeekeeperProductBySlug(slug: string): Promise<BeekeeperProduct | null> {
  const client = getClient()
  const staticFallback = STATIC_BEEKEEPER.find((p) => p.slug === slug) ?? null
  if (!client) return staticFallback
  const { data } = await client.from('beekeeper_products').select('*').eq('slug', slug).single()
  if (!data) return staticFallback
  const media = await fetchMedia('beekeeper', data.id, client).catch(() => [])
  return { ...data, media }
}

export async function getAllBeekeeperSlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return STATIC_BEEKEEPER_SLUGS
  const { data } = await client.from('beekeeper_products').select('slug')
  const dbSlugs = (data ?? []).map((r: { slug: string }) => r.slug)
  return dbSlugs.length > 0 ? dbSlugs : STATIC_BEEKEEPER_SLUGS
}

export async function getVisibleReviews(): Promise<Review[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('faq_items')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getAllFlowerProducts(): Promise<FlowerProduct[]> {
  const client = getClient()
  if (!client) return STATIC_FLOWERS
  const { data } = await client
    .from('flower_products')
    .select('*')
    .order('variety', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })
  if (!data || data.length === 0) return STATIC_FLOWERS

  const ids = data.map((p: { id: string }) => p.id)
  const { data: mediaData } = await client
    .from('product_media')
    .select('*')
    .eq('product_section', 'flowers')
    .in('product_id', ids)
    .order('position', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediaByProduct: Record<string, any[]> = {}
  for (const m of (mediaData ?? [])) {
    if (!mediaByProduct[m.product_id]) mediaByProduct[m.product_id] = []
    mediaByProduct[m.product_id].push(m)
  }

  return data.map((p: FlowerProduct) => ({ ...p, media: mediaByProduct[p.id] ?? [] }))
}

export async function getFlowerProductBySlug(slug: string): Promise<FlowerProduct | null> {
  const client = getClient()
  if (!client) return STATIC_FLOWERS.find((f) => f.slug === slug) ?? null
  const { data } = await client.from('flower_products').select('*').eq('slug', slug).single()
  if (!data) return STATIC_FLOWERS.find((f) => f.slug === slug) ?? null
  const media = await fetchMedia('flowers', data.id, client).catch(() => [])
  return { ...data, media }
}

export async function getAllFlowerSlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return STATIC_FLOWERS.map((f) => f.slug)
  const { data } = await client.from('flower_products').select('slug')
  const dbSlugs = (data ?? []).map((r: { slug: string }) => r.slug)
  if (dbSlugs.length > 0) return dbSlugs
  return STATIC_FLOWERS.map((f) => f.slug)
}
