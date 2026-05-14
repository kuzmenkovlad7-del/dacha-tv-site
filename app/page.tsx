import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { ProductPreview } from '@/components/home/ProductPreview'
import { BrandStory } from '@/components/home/BrandStory'
import { YouTubeSection } from '@/components/home/YouTubeSection'
import { HowToOrder } from '@/components/home/HowToOrder'
import { Reviews } from '@/components/home/Reviews'
import { BeekeeperTeaser } from '@/components/home/BeekeeperTeaser'
import { DeliveryTeaser } from '@/components/home/DeliveryTeaser'
import { StructuredData } from '@/components/shared/StructuredData'
import {
  getFeaturedHoneyProducts,
  getVisibleReviews,
  getSiteSettings,
} from '@/lib/supabase/queries'
import type { HoneyProduct } from '@/types'

export const metadata: Metadata = {
  title: 'Дача TV — Натуральний мед від сімейної пасіки на Харківщині',
  description:
    'Купити натуральний мед від пасічника на Харківщині. Акація, Липа, Сонях, Різнотрав\'я — без домішок, пряма поставка. Бджолопакети та вулики.',
  openGraph: {
    title: 'Дача TV — Натуральний мед від сімейної пасіки',
    description: 'Справжній мед від нашої пасіки — до вашого столу. Сімейна пасіка на Харківщині.',
    images: [{ url: '/images/og/home.jpg', width: 1200, height: 630, alt: 'Дача TV — Пасіка на Харківщині' }],
  },
}

// Static fallback so the home page always shows honey products before Supabase is populated
const STATIC_HONEY_FALLBACK: HoneyProduct[] = [
  { id: 'f-acacia', name: 'Мед Акація', slug: 'acacia', variety: 'Акація', description: null, packaging: ['1L пластик', '1L скло'], is_featured: true, in_stock: true, display_order: 1, image_url: null, image_alt: null, youtube_video_link: null },
  { id: 'f-linden', name: 'Мед Липа', slug: 'linden', variety: 'Липа', description: null, packaging: ['1L пластик', '1L скло'], is_featured: true, in_stock: true, display_order: 2, image_url: null, image_alt: null, youtube_video_link: null },
  { id: 'f-sunflower', name: 'Мед Сонях', slug: 'sunflower', variety: 'Сонях', description: null, packaging: ['1L пластик', '1L скло'], is_featured: true, in_stock: true, display_order: 3, image_url: null, image_alt: null, youtube_video_link: null },
  { id: 'f-wildflower', name: "Мед Різнотрав'я", slug: 'wildflower', variety: "Різнотрав'я", description: null, packaging: ['1L пластик', '1L скло'], is_featured: false, in_stock: true, display_order: 4, image_url: null, image_alt: null, youtube_video_link: null },
]

export default async function HomePage() {
  const [featuredHoneyProducts, reviews, siteSettings] = await Promise.all([
    getFeaturedHoneyProducts().catch(() => []),
    getVisibleReviews().catch(() => []),
    getSiteSettings().catch(() => null),
  ])

  const displayProducts = featuredHoneyProducts.length > 0 ? featuredHoneyProducts : STATIC_HONEY_FALLBACK

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dacha-tv.com'}/#business`,
    name: 'Дача TV',
    description:
      'Сімейна пасіка на Харківщині. Натуральний мед, пилок, прополіс та бджолині пакети напряму від виробника.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dacha-tv.com',
    telephone: siteSettings?.phone || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Коротич',
      addressLocality: 'Коротич',
      addressRegion: 'Харківська область',
      addressCountry: 'UA',
    },
    sameAs: [
      siteSettings?.youtube_url,
      siteSettings?.facebook_url,
      siteSettings?.instagram_url,
      siteSettings?.tiktok_url,
    ].filter(Boolean),
  }

  return (
    <>
      <StructuredData data={localBusinessSchema} />

      <Hero
        tagline={siteSettings?.hero_tagline ?? undefined}
        subtext={siteSettings?.hero_subtext ?? undefined}
        siteSettings={siteSettings}
      />

      <ProductPreview products={displayProducts} />

      <BrandStory />

      <YouTubeSection siteSettings={siteSettings} />

      <HowToOrder siteSettings={siteSettings} />

      {reviews.length > 0 && <Reviews reviews={reviews} />}

      <BeekeeperTeaser />

      <DeliveryTeaser />
    </>
  )
}
