import type { MetadataRoute } from 'next'
import { getAllHoneySlugs, getAllFlowerSlugs } from '@/lib/supabase/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dacha-tv.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/honey`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/flowers`, lastModified: new Date(), priority: 0.85 },
    { url: `${BASE_URL}/beekeeper`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/delivery`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), priority: 0.3 },
  ]

  const [honeySlugs, flowerSlugs] = await Promise.all([
    getAllHoneySlugs().catch(() => []),
    getAllFlowerSlugs().catch(() => []),
  ])

  const honeyRoutes: MetadataRoute.Sitemap = honeySlugs.map((slug) => ({
    url: `${BASE_URL}/honey/${slug}`,
    lastModified: new Date(),
    priority: 0.85,
  }))

  const flowerRoutes: MetadataRoute.Sitemap = flowerSlugs.map((slug) => ({
    url: `${BASE_URL}/flowers/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))

  return [...staticRoutes, ...honeyRoutes, ...flowerRoutes]
}
