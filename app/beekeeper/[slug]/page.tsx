import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { StructuredData } from '@/components/shared/StructuredData'
import { BeekeeperInquiryForm } from '@/components/forms/BeekeeperInquiryForm'
import { getBeekeeperProductBySlug, getAllBeekeeperSlugs } from '@/lib/supabase/queries'

interface Props {
  params: Promise<{ slug: string }>
}

const TYPE_LABELS: Record<string, string> = {
  bee_packages: 'Бджолопакети',
  bee_colonies: "Бджолосім'ї",
  empty_hives: 'Порожні вулики',
  hives_with_bees: 'Вулики з бджолами',
  apiary_supply: 'Товари пасічника',
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWE1YzM1Ii8+PC9zdmc+'

export async function generateStaticParams() {
  const slugs = await getAllBeekeeperSlugs().catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getBeekeeperProductBySlug(slug).catch(() => null)
  if (!product) return { title: 'Продукт не знайдено' }

  const media = product.media ?? []
  const primaryImg = media.find((m) => m.media_type === 'image' && m.is_primary) ?? media.find((m) => m.media_type === 'image')
  const ogImage = primaryImg?.url ?? product.image_url

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} від пасіки Дача TV на Харківщині. Пряма комунікація з пасічником — без посередників.`,
    openGraph: {
      title: `${product.name} | Дача TV`,
      description: product.description || product.name,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function BeekeeperProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getBeekeeperProductBySlug(slug).catch(() => null)
  if (!product) notFound()

  const media = product.media ?? []
  const primaryImg = media.find((m) => m.media_type === 'image' && m.is_primary) ?? media.find((m) => m.media_type === 'image') ?? null
  const galleryImgs = media.filter((m) => m.media_type === 'image' && m !== primaryImg)

  const allImages = media.length > 0
    ? [
        ...(primaryImg ? [{ src: primaryImg.url, alt: primaryImg.alt ?? product.name }] : []),
        ...galleryImgs.map((m) => ({ src: m.url, alt: m.alt ?? product.name })),
      ]
    : product.image_url
      ? [{ src: product.image_url, alt: product.image_alt ?? product.name }]
      : []

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    brand: { '@type': 'Brand', name: 'Дача TV' },
    offers: {
      '@type': 'Offer',
      availability: (product.status === 'available' || product.status === 'preorder')
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Дача TV' },
    },
  }

  const isUnavailable = product.status !== 'available' && product.status !== 'preorder'

  return (
    <div className="bg-cream min-h-screen">
      <StructuredData data={productSchema} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Навігація" className="text-sm text-bark/50">
          <Link href="/" className="hover:text-honey-700">Головна</Link>
          <span className="mx-2">›</span>
          <Link href="/beekeeper" className="hover:text-honey-700">Для пасічників</Link>
          <span className="mx-2">›</span>
          <span className="text-bark">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest-50">
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
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest-50 to-forest-200">
                  <span className="text-forest-600 font-serif font-bold text-3xl text-center px-6">
                    {product.name}
                  </span>
                </div>
              )}
              {isUnavailable && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Немає в наявності
                  </span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.slice(1).map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-forest-50 flex-shrink-0">
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
            {product.product_type && (
              <span className="text-xs font-semibold text-forest-700 uppercase tracking-widest mb-2 block">
                {TYPE_LABELS[product.product_type] ?? product.product_type}
              </span>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-bark mb-3">
              {product.name}
            </h1>

            {isUnavailable && (
              <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
                Наразі немає в наявності. Залиште заявку — ми повідомимо, коли з&apos;явиться.
              </div>
            )}

            {product.season_note && (
              <p className="text-forest-700 text-sm font-medium mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {product.season_note}
              </p>
            )}

            {product.breeds && product.breeds.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-bark/50 uppercase tracking-widest mb-2">
                  Доступні породи
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.breeds.map((breed) => (
                    <span
                      key={breed}
                      className="text-sm bg-forest-50 text-forest-700 border border-forest-200 px-3 py-1 rounded-full font-medium"
                    >
                      {breed}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(product.full_description || product.description) && (
              <p className="text-bark/70 leading-relaxed mb-6">
                {product.full_description || product.description}
              </p>
            )}

            {/* Inquiry form */}
            <div id="inquiry-form" className="bg-forest-50 rounded-2xl p-6 border border-forest-200">
              <h2 className="font-serif text-2xl font-bold text-bark mb-1">
                Залишити заявку
              </h2>
              <p className="text-bark/60 text-sm mb-5">
                Щоб дізнатись наявність та вартість — залиште заявку або зателефонуйте
              </p>
              <BeekeeperInquiryForm source={`/beekeeper/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
