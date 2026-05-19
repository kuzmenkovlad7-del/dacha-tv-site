export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPublishedProductBySlug, getCategoryBySlug } from '@/lib/supabase/catalog'
import { Breadcrumb } from '@/components/catalog/Breadcrumb'
import { CTAButton } from '@/components/shared/CTAButton'
import { LAUNCH_PHONE } from '@/lib/launch-defaults'
import { formatPhoneTel, formatPhoneDisplay } from '@/lib/utils'

interface Props {
  params: Promise<{ category: string; product: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product: productSlug } = await params
  const product = await getPublishedProductBySlug(category, productSlug).catch(() => null)
  if (!product) return { title: 'Товар не знайдено' }

  const title = product.meta_title || `${product.name_ua} | Дача TV`
  const description = product.meta_description || product.short_description || `Купити ${product.name_ua} з доставкою по Україні. Ціна від ${product.price_uah} грн.`

  return {
    title,
    description,
    alternates: { canonical: `/catalog/${category}/${productSlug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(product.main_image_url ? { images: [{ url: product.main_image_url, alt: product.name_ua }] } : {}),
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { category: categorySlug, product: productSlug } = await params

  const [cat, product] = await Promise.all([
    getCategoryBySlug(categorySlug).catch(() => null),
    getPublishedProductBySlug(categorySlug, productSlug).catch(() => null),
  ])

  if (!product) notFound()

  const images: string[] = [
    ...(product.main_image_url ? [product.main_image_url] : []),
    ...((product.images as string[] | null ?? []).filter((u) => u !== product.main_image_url)),
  ]

  const hasDiscount = product.compare_price_uah && product.compare_price_uah > product.price_uah

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_ua,
    description: product.short_description ?? product.description ?? undefined,
    image: images[0] ?? undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UAH',
      price: product.price_uah,
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.dachatv.com'}/catalog/${categorySlug}/${productSlug}`,
    },
  }

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumb crumbs={[
          { label: 'Головна', href: '/' },
          { label: 'Каталог', href: '/catalog' },
          { label: cat?.name_ua ?? categorySlug, href: `/catalog/${categorySlug}` },
          { label: product.name_ua },
        ]} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div>
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-honey-100">
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={product.name_ua}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-honey-50 to-forest-50">
                  <span className="text-forest-600 font-serif font-semibold text-xl text-center px-6">
                    {product.name_ua}
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.slice(1, 6).map((url, i) => (
                  <div key={url} className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-honey-100">
                    <Image src={url} alt={`${product.name_ua} фото ${i + 2}`} fill className="object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.is_featured && (
              <span className="inline-block text-xs font-semibold bg-honey-100 text-honey-700 px-2.5 py-1 rounded-full mb-3 w-fit">
                Хіт продажів
              </span>
            )}

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-bark mb-4 leading-tight">
              {product.name_ua}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-bark">
                {product.price_uah.toLocaleString('uk-UA')} грн
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {product.compare_price_uah!.toLocaleString('uk-UA')} грн
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {product.short_description}
              </p>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={`tel:${formatPhoneTel(LAUNCH_PHONE)}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-honey-700 hover:bg-honey-800 text-white font-semibold rounded-full transition-colors text-base min-h-[52px]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {formatPhoneDisplay(LAUNCH_PHONE)}
              </a>
              <CTAButton href="/contact" variant="outline" size="md" className="flex-1">
                Залишити заявку
              </CTAButton>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              Доставка по Україні
            </div>

            {product.description && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="font-semibold text-bark mb-3 text-sm uppercase tracking-wide">Опис</h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
