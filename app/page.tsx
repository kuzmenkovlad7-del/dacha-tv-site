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
  getFeaturedProducts,
  getVisibleReviews,
  getSiteConfig,
  getHomepageConfig,
} from '@/lib/sanity/queries'

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

export default async function HomePage() {
  const [featuredProducts, reviews, siteConfig, homepageConfig] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getVisibleReviews().catch(() => []),
    getSiteConfig().catch(() => null),
    getHomepageConfig().catch(() => null),
  ])

  // Use homepage config products if available, otherwise use featured flag
  const displayProducts =
    homepageConfig?.featuredProductIds && homepageConfig.featuredProductIds.length > 0
      ? homepageConfig.featuredProductIds
      : featuredProducts

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dacha-tv.com'}/#business`,
    name: 'Дача TV',
    description:
      'Сімейна пасіка на Харківщині. Натуральний мед, пилок, прополіс та бджолині пакети напряму від виробника.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dacha-tv.com',
    telephone: siteConfig?.phone || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Коротич',
      addressLocality: 'Коротич',
      addressRegion: 'Харківська область',
      addressCountry: 'UA',
    },
    sameAs: [
      siteConfig?.youtubeUrl,
      siteConfig?.facebookUrl,
      siteConfig?.instagramUrl,
      siteConfig?.tiktokUrl,
    ].filter(Boolean),
  }

  return (
    <>
      <StructuredData data={localBusinessSchema} />

      <Hero
        tagline={homepageConfig?.heroTagline}
        subtext={homepageConfig?.heroSubtext}
        siteConfig={siteConfig}
      />

      <ProductPreview products={displayProducts} />

      <BrandStory />

      <YouTubeSection siteConfig={siteConfig} />

      <HowToOrder siteConfig={siteConfig} />

      {reviews.length > 0 && <Reviews reviews={reviews} />}

      <BeekeeperTeaser />

      <DeliveryTeaser />
    </>
  )
}
