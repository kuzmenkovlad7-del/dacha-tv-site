import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { existsSync } from 'fs'
import { join } from 'path'
import { FlowerInquiryForm } from '@/components/forms/FlowerInquiryForm'
import { YouTubeFacade } from '@/components/shared/YouTubeFacade'
import { StructuredData } from '@/components/shared/StructuredData'
import { getFlowerProductBySlug, getAllFlowerSlugs, getAllFlowerProducts } from '@/lib/supabase/queries'
import { FlowerCard } from '@/components/flowers/FlowerCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllFlowerSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getFlowerProductBySlug(slug).catch(() => null)
  if (!product) return { title: 'Квітку не знайдено' }
  return {
    title: `${product.name} | Дача TV`,
    description: product.short_description || `${product.name} — хризантема від домашнього розсадника Дача TV.`,
    openGraph: {
      title: `${product.name} | Дача TV`,
      description: product.short_description || product.name,
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630 }] : [],
    },
  }
}

function resolveLocalImage(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) return imageUrl
  return existsSync(join(process.cwd(), 'public', imageUrl)) ? imageUrl : null
}

function extractYouTubeId(url: string | null): string | null {
  if (!url) return null
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'

export default async function FlowerProductPage({ params }: Props) {
  const { slug } = await params

  const [product, allProducts] = await Promise.all([
    getFlowerProductBySlug(slug).catch(() => null),
    getAllFlowerProducts().catch(() => []),
  ])

  if (!product) notFound()

  const heroImage = resolveLocalImage(product.image_url)
  const youtubeId = extractYouTubeId(product.youtube_video_url)
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.status === 'available' || p.status === 'preorder'))
    .slice(0, 3)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.name,
    brand: { '@type': 'Brand', name: 'Дача TV' },
    offers: {
      '@type': 'Offer',
      availability: (product.status === 'available' || product.status === 'preorder')
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Дача TV' },
    },
    image: product.image_url || undefined,
  }

  return (
    <div className="bg-white min-h-screen">
      <StructuredData data={productSchema} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Навігація" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700 transition-colors">Головна</Link>
          <span className="mx-2">›</span>
          <Link href="/flowers" className="hover:text-gray-700 transition-colors">Квіти</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={product.image_alt || `${product.name} від Дача TV`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <span className="text-6xl mb-3 select-none">🌸</span>
                  <span className="text-gray-400 font-medium text-center px-6">{product.name}</span>
                </div>
              )}

              {product.is_featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-900 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    Популярна
                  </span>
                </div>
              )}

              {product.status !== 'available' && product.status !== 'preorder' && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Немає в наявності
                  </span>
                </div>
              )}
            </div>

            {(product.gallery_images ?? []).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {(product.gallery_images ?? []).map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={src}
                      alt={product.image_alt || product.name}
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
            {product.variety && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {product.category === 'chrysanthemum' ? 'Хризантема' : product.category} · {product.variety}
              </p>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                {product.short_description}
              </p>
            )}

            {product.status !== 'available' && product.status !== 'preorder' && (
              <div className="bg-gray-100 text-gray-600 rounded-xl px-4 py-3 mb-5 text-sm">
                Наразі немає в наявності. Залиште заявку — повідомимо, коли з&apos;явиться.
              </div>
            )}

            {/* Details */}
            <dl className="space-y-3 mb-6 border-t border-gray-100 pt-5">
              {product.color && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Колір</dt>
                  <dd className="col-span-2 text-sm text-gray-800">{product.color}</dd>
                </div>
              )}
              {product.bloom_season && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Цвітіння</dt>
                  <dd className="col-span-2 text-sm text-gray-800">{product.bloom_season}</dd>
                </div>
              )}
              {product.height_cm && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Висота</dt>
                  <dd className="col-span-2 text-sm text-gray-800">до {product.height_cm} см</dd>
                </div>
              )}
              {product.lighting && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Освітлення</dt>
                  <dd className="col-span-2 text-sm text-gray-800">{product.lighting}</dd>
                </div>
              )}
              {product.packaging_note && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Упаковка</dt>
                  <dd className="col-span-2 text-sm text-gray-800">{product.packaging_note}</dd>
                </div>
              )}
            </dl>

            {product.price_uah && (
              <div className="flex items-baseline gap-2 mb-6 py-3 border-t border-b border-gray-100">
                <span className="text-2xl font-bold text-gray-900">від {product.price_uah} грн</span>
              </div>
            )}

            {product.full_description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.full_description}
              </p>
            )}

            {product.video_url && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Відео про цю квітку
                </p>
                <video src={product.video_url} controls className="w-full rounded-xl" />
              </div>
            )}

            {youtubeId && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  {product.video_url ? 'Також на YouTube' : 'Відео про цю квітку'}
                </p>
                <YouTubeFacade videoId={youtubeId} title={`Відео: ${product.name}`} />
              </div>
            )}

            {(product.youtube_video_urls ?? []).filter(Boolean).map((url, i) => {
              const vid = extractYouTubeId(url)
              return vid ? (
                <div key={i} className="mb-4">
                  <YouTubeFacade videoId={vid} title={`Відео ${i + 2}: ${product.name}`} />
                </div>
              ) : null
            })}

            {/* Inquiry form */}
            <div id="order-form" className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Замовити</h2>
              <p className="text-gray-500 text-sm mb-5">
                Залиште заявку — уточнимо наявність і домовимося про передачу.
              </p>
              <FlowerInquiryForm
                preselectedProduct={product.name}
                source={`/flowers/${slug}`}
              />
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
              Інші сорти
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <FlowerCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
