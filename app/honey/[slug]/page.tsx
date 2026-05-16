import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { existsSync } from 'fs'
import { join } from 'path'
import { HoneyOrderForm } from '@/components/forms/HoneyOrderForm'
import { HoneyCard } from '@/components/honey/HoneyCard'
import { StructuredData } from '@/components/shared/StructuredData'
import { YouTubeFacade } from '@/components/shared/YouTubeFacade'
import { STATIC_HONEY, STATIC_HONEY_BY_SLUG, STATIC_HONEY_SLUGS } from '@/lib/static-catalog'
import {
  getHoneyProductBySlug,
  getAllHoneySlugs,
  getAllHoneyProducts,
} from '@/lib/supabase/queries'

interface Props {
  params: Promise<{ slug: string }>
}

// Always include all 6 production slugs so detail pages are pre-built regardless
// of whether the DB migration has run. DB slugs are merged in at build time.
export async function generateStaticParams() {
  const dbSlugs = await getAllHoneySlugs().catch(() => [])
  const allSlugs = [...new Set([...STATIC_HONEY_SLUGS, ...dbSlugs])]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dbProduct = await getHoneyProductBySlug(slug).catch(() => null)
  const product = dbProduct ?? STATIC_HONEY_BY_SLUG[slug] ?? null

  if (!product) return { title: 'Продукт не знайдено' }

  return {
    title: product.name,
    description: `Натуральний ${product.name.toLowerCase()} від сімейної пасіки на Харківщині. ${product.packaging?.join(', ') || ''}. Замовляйте напряму від пасічника.`,
    openGraph: {
      title: `${product.name} | Дача TV`,
      description: `Натуральний ${product.name.toLowerCase()} від пасіки Дача TV на Харківщині`,
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630 }] : [],
    },
  }
}

const VARIETY_DETAILS: Record<string, {
  season: string
  taste: string
  crystallisation: string
  storage: string
  uses: string
}> = {
  Акація: {
    season: 'Кінець травня — початок червня',
    taste: 'Ніжний, квітковий, злегка вершковий. Один з найсвітліших сортів.',
    crystallisation: 'Кристалізується дуже повільно — іноді залишається рідким до року і більше.',
    storage: 'Зберігати в прохолодному темному місці. Не ставити в холодильник — зайва вологість.',
    uses: 'Щоденне вживання, чай, дитяче харчування, подарунки. Ідеальний для тих, хто не любить дуже насиченого смаку.',
  },
  Липа: {
    season: 'Липень',
    taste: 'Насичений, квітковий аромат з легкою гірчинкою. Традиційно вважається найбільш корисним.',
    crystallisation: 'Кристалізується за 2–3 місяці після відкачки. Кристали середнього розміру.',
    storage: 'Зберігати в прохолодному темному місці при температурі до +20°C.',
    uses: 'Підтримка імунітету, чай при застуді, щоденне вживання. Класичний вибір.',
  },
  Сонях: {
    season: 'Серпень — початок вересня',
    taste: 'Насичений, жирний, з характерним смаком соняшника. Дуже ситний.',
    crystallisation: 'Кристалізується дуже швидко — вже через 2–4 тижні після відкачки. Кристали дрібні та тверді.',
    storage: 'Зберігати при кімнатній температурі. Після кристалізації можна злегка підігріти на водяній бані.',
    uses: 'Намазати на хліб, додати в кашу. Ідеально підходить для тривалого зберігання.',
  },
  "Різнотрав'я": {
    season: 'Червень — серпень',
    taste: 'Складний, багатошаровий смак від різноманіття польових квітів. Кожна партія трохи відрізняється.',
    crystallisation: 'Кристалізується за 1–3 місяці. Залежить від складу нектару.',
    storage: 'Зберігати в прохолодному темному місці.',
    uses: 'Універсальний. Щоденне вживання, випічка, чай.',
  },
  Сади: {
    season: 'Квітень — травень',
    taste: "Ніжний, квітковий, з легким яблуневим або грушевим нотками залежно від садів.",
    crystallisation: "Кристалізується за 2–3 місяці. Кристали м'які та дрібні.",
    storage: 'Зберігати в прохолодному темному місці.',
    uses: 'Ідеально в чай, з сиром, як добавка до десертів.',
  },
  Ліс: {
    season: 'Червень — серпень',
    taste: "Темний, комплексний, з мінеральними та деревними нотками. Яскраво виражений характер.",
    crystallisation: 'Кристалізується повільно. Може зберігатися рідким тривалий час.',
    storage: 'Зберігати в прохолодному темному місці.',
    uses: "Для цінителів — самостійно або в блюдах з м'ясом та сирами.",
  },
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiZjI0Ii8+PC9zdmc+'

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

export default async function HoneyProductPage({ params }: Props) {
  const { slug } = await params

  const [dbProduct, allDbProducts] = await Promise.all([
    getHoneyProductBySlug(slug).catch(() => null),
    getAllHoneyProducts().catch(() => []),
  ])

  // Fall back to static catalog if DB doesn't have the slug yet
  const product = dbProduct ?? STATIC_HONEY_BY_SLUG[slug] ?? null
  if (!product) notFound()

  const allProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_HONEY
  const details = VARIETY_DETAILS[product.variety]
  const heroImage = resolveLocalImage(product.image_url)
  const youtubeId = extractYouTubeId(product.youtube_video_link)

  const related = allProducts
    .filter((p) => p.id !== product.id && p.in_stock)
    .slice(0, 3)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || details?.taste || `Натуральний ${product.name} від пасіки на Харківщині`,
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
          <Link href="/honey" className="hover:text-honey-700">Мед</Link>
          <span className="mx-2">›</span>
          <span className="text-bark">{product.name}</span>
        </nav>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-honey-50">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={product.image_alt || `${product.name} від пасіки Дача TV`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-honey-100 to-honey-300">
                <span className="text-honey-700 font-serif font-bold text-3xl">
                  {product.variety}
                </span>
              </div>
            )}
            {product.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-honey-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                  Найпопулярніший
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-bark mb-3">
              {product.name}
            </h1>

            {(product.short_description || details?.taste) && (
              <p className="text-bark/70 text-base leading-relaxed mb-4">
                {product.short_description || details?.taste}
              </p>
            )}

            {!product.in_stock && (
              <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
                Наразі немає в наявності. Залиште заявку — ми повідомимо, коли з&apos;явиться.
              </div>
            )}

            {/* Packaging */}
            {product.packaging && product.packaging.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.packaging.map((pack) => (
                  <span key={pack} className="text-sm bg-honey-50 text-honey-700 border border-honey-200 px-3 py-1 rounded-full font-medium">
                    {pack}
                  </span>
                ))}
              </div>
            )}

            {/* Price block */}
            {(product.price_plastic_uah || product.price_glass_uah) && (
              <div className="flex flex-wrap gap-4 mb-6 py-3 border-t border-b border-honey-100">
                {product.price_plastic_uah && (
                  <div>
                    <span className="text-xs text-bark/50 block mb-0.5">Пластик</span>
                    <span className="text-xl font-bold text-bark">{product.price_plastic_uah} грн</span>
                  </div>
                )}
                {product.price_glass_uah && (
                  <div>
                    <span className="text-xs text-bark/50 block mb-0.5">Скло</span>
                    <span className="text-xl font-bold text-bark">{product.price_glass_uah} грн</span>
                  </div>
                )}
              </div>
            )}

            {/* Details table */}
            <dl className="space-y-3 mb-6">
              {details?.season && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Сезон</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.season}</dd>
                </div>
              )}
              {product.aroma_notes && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Аромат</dt>
                  <dd className="col-span-2 text-sm text-bark">{product.aroma_notes}</dd>
                </div>
              )}
              {(product.taste_notes || details?.taste) && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Смак</dt>
                  <dd className="col-span-2 text-sm text-bark">{product.taste_notes || details?.taste}</dd>
                </div>
              )}
              {product.color_note && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Колір</dt>
                  <dd className="col-span-2 text-sm text-bark">{product.color_note}</dd>
                </div>
              )}
              {(product.crystallization_note || details?.crystallisation) && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Кристалізація</dt>
                  <dd className="col-span-2 text-sm text-bark">{product.crystallization_note || details?.crystallisation}</dd>
                </div>
              )}
              {details?.storage && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Зберігання</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.storage}</dd>
                </div>
              )}
              {(product.recommended_use || details?.uses) && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Рекомендовано</dt>
                  <dd className="col-span-2 text-sm text-bark">{product.recommended_use || details?.uses}</dd>
                </div>
              )}
              {product.packaging_note && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Упаковка</dt>
                  <dd className="col-span-2 text-sm text-bark">{product.packaging_note}</dd>
                </div>
              )}
            </dl>

            {product.full_description && (
              <div className="prose prose-sm text-bark/80 mb-6 leading-relaxed">
                <p>{product.full_description}</p>
              </div>
            )}

            {product.video_url && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-bark/50 uppercase tracking-widest mb-2">
                  Відео про цей мед
                </p>
                <video src={product.video_url} controls className="w-full rounded-xl" />
              </div>
            )}

            {youtubeId && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-bark/50 uppercase tracking-widest mb-2">
                  {product.video_url ? 'Також на YouTube' : 'Відео про цей мед'}
                </p>
                <YouTubeFacade
                  videoId={youtubeId}
                  title={`Дивіться як ми збираємо ${product.variety.toLowerCase()} мед`}
                />
              </div>
            )}

            {(product.youtube_video_urls ?? []).filter(Boolean).map((url, i) => {
              const vid = extractYouTubeId(url)
              return vid ? (
                <div key={i} className="mb-4">
                  <YouTubeFacade videoId={vid} title={`Відео ${i + 2} про ${product.name}`} />
                </div>
              ) : null
            })}

            {/* Order form */}
            <div id="order-form" className="bg-honey-50 rounded-2xl p-6 border border-honey-200">
              <h2 className="font-serif text-2xl font-bold text-bark mb-1">Замовити</h2>
              <p className="text-bark/60 text-sm mb-5">
                Залиште заявку — ми зв&apos;яжемося з вами найближчим часом
              </p>
              <HoneyOrderForm
                preselectedProduct={product.name}
                packagingOptions={product.packaging || []}
                source={`/honey/${slug}`}
              />
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-bark mb-8">
              Також може зацікавити
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <HoneyCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
