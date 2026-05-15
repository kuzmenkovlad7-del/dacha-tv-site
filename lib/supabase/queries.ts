import { createClient } from '@supabase/supabase-js'
import type { SiteSettings, HoneyProduct, ApiaryProduct, BeekeeperProduct, Review, FaqItem, FlowerProduct } from '@/types'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
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
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getHoneyProductBySlug(slug: string): Promise<HoneyProduct | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client.from('honey_products').select('*').eq('slug', slug).single()
  return data ?? null
}

export async function getFeaturedHoneyProducts(): Promise<HoneyProduct[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('honey_products')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
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
  if (!client) return []
  const { data } = await client
    .from('apiary_products')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getApiaryProductBySlug(slug: string): Promise<ApiaryProduct | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client.from('apiary_products').select('*').eq('slug', slug).single()
  return data ?? null
}

export async function getAllApiaryProductSlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client.from('apiary_products').select('slug')
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

export async function getAllBeekeeperProducts(): Promise<BeekeeperProduct[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('beekeeper_products')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
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
  if (!client) return []
  const { data } = await client
    .from('flower_products')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getFlowerProductBySlug(slug: string): Promise<FlowerProduct | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client.from('flower_products').select('*').eq('slug', slug).single()
  return data ?? null
}

export async function getAllFlowerSlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client.from('flower_products').select('slug')
  return (data ?? []).map((r: { slug: string }) => r.slug)
}
