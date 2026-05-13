import type { MetadataRoute } from 'next'
import { getAllHoneySlugs } from '@/lib/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dacha-tv.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/honey`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/beekeeper`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/delivery`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), priority: 0.3 },
  ]

  const honeySlugs = await getAllHoneySlugs().catch(() => [])
  const honeyRoutes: MetadataRoute.Sitemap = honeySlugs.map((item) => ({
    url: `${BASE_URL}/honey/${item.slug.current}`,
    lastModified: new Date(),
    priority: 0.85,
  }))

  return [...staticRoutes, ...honeyRoutes]
}
