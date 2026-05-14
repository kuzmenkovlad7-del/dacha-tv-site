import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { GeneralContactForm } from '@/components/forms/GeneralContactForm'
import { StructuredData } from '@/components/shared/StructuredData'
import { getApiaryProductBySlug, getAllApiaryProductSlugs } from '@/lib/supabase/queries'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllApiaryProductSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getApiaryProductBySlug(slug).catch(() => null)

  if (!product) {
    return { title: 'Продукт не знайдено' }
  }

  return {
    title: product.name,
    description:
      product.short_description ||
      product.description ||
      `${product.name} від сімейної пасіки Дача TV на Харківщині.`,
    openGraph: {
      title: `${product.name} | Дача TV`,
      description: product.short_description || product.description || product.name,
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630 }] : [],
    },
  }
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiZjI0Ii8+PC9zdmc+'

export default async function ApiaryProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getApiaryProductBySlug(slug).catch(() => null)

  if (!product) notFound()

  const allImages = [
    ...(product.image_url ? [{ src: product.image_url, alt: product.image_alt || product.name }] : []),
    ...(product.gallery_images || []).map((src) => ({ src, alt: product.name })),
  ]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description || product.name,
    brand: { '@type': 'Brand', name: 'Дача TV' },
    offers: {
      '@type': 'Offer',
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Дача TV' },
    },
    image: product.image_url || undefined,
  }

  return (
    <div className="bg-cream min-h-screen">
      <StructuredData data={productSchema} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Навігація" className="text-sm text-bark/50">
          <Link href="/" className="hover:text-honey-700">Головна</Link>
          <span className="mx-2">›</span>
          <Link href="/products" className="hover:text-honey-700">Продукти пасіки</Link>
          <span className="mx-2">›</span>
          <span className="text-bark">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-honey-50">
              {allImages.length > 0 ? (
                <Image
                  src={allImages[0].src}
                  alt={allImages[0].alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest-50 to-forest-100">
                  <span className="text-forest-600 font-serif font-bold text-3xl text-center px-6">
                    {product.name}
                  </span>
                </div>
              )}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Немає в наявності
                  </span>
                </div>
              )}
            </div>

            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.slice(1).map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-honey-50 flex-shrink-0">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.weight_g && (
              <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-2 block">
                {product.weight_g}г
              </span>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-bark mb-3">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="text-bark/70 text-lg leading-relaxed mb-6">
                {product.short_description}
              </p>
            )}

            {!product.in_stock && (
              <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
                Наразі немає в наявності. Залиште заявку — ми повідомимо, коли з&apos;явиться.
              </div>
            )}

            {/* Packaging tags */}
            {product.packaging && product.packaging.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.packaging.map((pack) => (
                  <span
                    key={pack}
                    className="text-sm bg-honey-50 text-honey-700 border border-honey-200 px-3 py-1 rounded-full font-medium"
                  >
                    {pack}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && !product.short_description && (
              <p className="text-bark/70 leading-relaxed mb-6">{product.description}</p>
            )}
            {product.description && product.short_description && (
              <p className="text-bark/70 leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Composition */}
            {product.composition && (
              <div className="mb-5">
                <h2 className="font-semibold text-bark text-sm uppercase tracking-wide mb-1.5">Склад</h2>
                <p className="text-bark/70 text-sm leading-relaxed">{product.composition}</p>
              </div>
            )}

            {/* Usage */}
            {product.usage_notes && (
              <div className="mb-5">
                <h2 className="font-semibold text-bark text-sm uppercase tracking-wide mb-1.5">Застосування</h2>
                <p className="text-bark/70 text-sm leading-relaxed">{product.usage_notes}</p>
              </div>
            )}

            {/* Storage */}
            {product.storage_info && (
              <div className="mb-8">
                <h2 className="font-semibold text-bark text-sm uppercase tracking-wide mb-1.5">Зберігання</h2>
                <p className="text-bark/70 text-sm leading-relaxed">{product.storage_info}</p>
              </div>
            )}

            {/* Order form */}
            <div id="order-form" className="bg-forest-50 rounded-2xl p-6 border border-forest-200">
              <h2 className="font-serif text-2xl font-bold text-bark mb-1">
                Замовити
              </h2>
              <p className="text-bark/60 text-sm mb-5">
                Залиште заявку — ми зв&apos;яжемося з вами найближчим часом
              </p>
              <GeneralContactForm source={`/products/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
