import { createClient } from '@supabase/supabase-js'
import type { SiteSettings, HoneyProduct, ApiaryProduct, BeekeeperProduct, Review, FaqItem } from '@/types'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await getClient()
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()
  return data ?? null
}

export async function getAllHoneyProducts(): Promise<HoneyProduct[]> {
  const { data } = await getClient()
    .from('honey_products')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getHoneyProductBySlug(slug: string): Promise<HoneyProduct | null> {
  const { data } = await getClient()
    .from('honey_products')
    .select('*')
    .eq('slug', slug)
    .single()
  return data ?? null
}

export async function getFeaturedHoneyProducts(): Promise<HoneyProduct[]> {
  const { data } = await getClient()
    .from('honey_products')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(4)
  return data ?? []
}

export async function getAllHoneySlugs(): Promise<string[]> {
  const { data } = await getClient()
    .from('honey_products')
    .select('slug')
  return (data ?? []).map((r) => r.slug)
}

export async function getAllApiaryProducts(): Promise<ApiaryProduct[]> {
  const { data } = await getClient()
    .from('apiary_products')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getAllBeekeeperProducts(): Promise<BeekeeperProduct[]> {
  const { data } = await getClient()
    .from('beekeeper_products')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getVisibleReviews(): Promise<Review[]> {
  const { data } = await getClient()
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  const { data } = await getClient()
    .from('faq_items')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  return data ?? []
}
