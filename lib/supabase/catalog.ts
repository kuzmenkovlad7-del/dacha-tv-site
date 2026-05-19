import { createClient } from '@supabase/supabase-js'
import type { CatalogCategory, CatalogProduct } from '@/types'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export const CATALOG_PAGE_SIZE = 24

export async function getPublishedCategories(): Promise<CatalogCategory[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('catalog_categories')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('name_ua', { ascending: true })
  return (data ?? []) as CatalogCategory[]
}

export async function getCategoryBySlug(slug: string): Promise<CatalogCategory | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client
    .from('catalog_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return (data ?? null) as CatalogCategory | null
}

export async function getPublishedProductsByCategory(
  categorySlug: string,
  page: number,
): Promise<{ products: CatalogProduct[]; total: number }> {
  const client = getClient()
  if (!client) return { products: [], total: 0 }
  const from = (page - 1) * CATALOG_PAGE_SIZE
  const to = from + CATALOG_PAGE_SIZE - 1
  const { data, count } = await client
    .from('catalog_products')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('category_slug', categorySlug)
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })
    .order('name_ua', { ascending: true })
    .range(from, to)
  return { products: (data ?? []) as CatalogProduct[], total: count ?? 0 }
}

export async function getPublishedProductBySlug(
  categorySlug: string,
  productSlug: string,
): Promise<CatalogProduct | null> {
  const client = getClient()
  if (!client) return null
  const { data } = await client
    .from('catalog_products')
    .select('*')
    .eq('status', 'published')
    .eq('category_slug', categorySlug)
    .eq('slug', productSlug)
    .single()
  return (data ?? null) as CatalogProduct | null
}

export async function getPublishedCatalogSlugs(): Promise<{ category: string; product: string }[]> {
  const client = getClient()
  if (!client) return []
  const { data } = await client
    .from('catalog_products')
    .select('slug, category_slug')
    .eq('status', 'published')
    .not('category_slug', 'is', null)
  return (data ?? []).map((r) => ({ category: r.category_slug as string, product: r.slug as string }))
}

export async function getCategoryProductCount(categorySlug: string): Promise<number> {
  const client = getClient()
  if (!client) return 0
  const { count } = await client
    .from('catalog_products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('category_slug', categorySlug)
  return count ?? 0
}
