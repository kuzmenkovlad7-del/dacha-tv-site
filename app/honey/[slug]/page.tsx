import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { HoneyOrderForm } from '@/components/forms/HoneyOrderForm'
import { HoneyCard } from '@/components/honey/HoneyCard'
import { StructuredData } from '@/components/shared/StructuredData'
import { urlFor } from '@/lib/sanity/image'
import {
  getHoneyProductBySlug,
  getAllHoneySlugs,
  getAllHoneyProducts,
} from '@/lib/sanity/queries'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllHoneySlugs().catch(() => [])
  return slugs.map((item) => ({ slug: item.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getHoneyProductBySlug(slug).catch(() => null)

  if (!product) {
    return { title: 'Продукт не знайдено' }
  }

  const imageUrl = product.image
    ? urlFor(product.image).width(1200).height(630).url()
    : undefined

  return {
    title: product.name,
    description: `Натуральний ${product.name.toLowerCase()} від сімейної пасіки на Харківщині. ${product.packaging?.join(', ') || ''}. Замовляйте напряму від пасічника.`,
    openGraph: {
      title: `${product.name} | Дача TV`,
      description: `Натуральний ${product.name.toLowerCase()} від пасіки Дача TV на Харківщині`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  }
}

const VARIETY_DETAILS: Record<
  string,
  {
    season: string
    taste: string
    crystallisation: string
    storage: string
    uses: string
  }
> = {
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
    taste: 'Ніжний, квітковий, з легким яблуневим або грушевим нотками залежно від садів.',
    crystallisation: 'Кристалізується за 2–3 місяці. Кристали м\'які та дрібні.',
    storage: 'Зберігати в прохолодному темному місці.',
    uses: 'Ідеально в чай, з сиром, як добавка до десертів.',
  },
  Ліс: {
    season: 'Червень — серпень',
    taste: 'Темний, комплексний, з мінеральними та деревними нотками. Яскраво виражений характер.',
    crystallisation: 'Кристалізується повільно. Може зберігатися рідким тривалий час.',
    storage: 'Зберігати в прохолодному темному місці.',
    uses: 'Для цінителів — самостійно або в блюдах з м\'ясом та сирами.',
  },
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiZjI0Ii8+PC9zdmc+'

export default async function HoneyProductPage({ params }: Props) {
  const { slug } = await params
  const [product, allProducts] = await Promise.all([
    getHoneyProductBySlug(slug).catch(() => null),
    getAllHoneyProducts().catch(() => []),
  ])

  if (!product) notFound()

  const details = VARIETY_DETAILS[product.variety]
  const imageUrl = product.image
    ? urlFor(product.image).width(800).height(800).url()
    : null

  const related = allProducts
    .filter((p) => p._id !== product._id && p.inStock)
    .slice(0, 3)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: details?.taste || `Натуральний ${product.name} від пасіки на Харківщині`,
    brand: { '@type': 'Brand', name: 'Дача TV' },
    offers: {
      '@type': 'Offer',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: 'UAH',
      seller: { '@type': 'Organization', name: 'Дача TV' },
    },
    image: imageUrl || undefined,
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
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.image?.alt || `${product.name} від пасіки Дача TV`}
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
            {product.isFeatured && (
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

            {!product.inStock && (
              <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
                Наразі немає в наявності. Залиште заявку — ми повідомимо, коли з&apos;явиться.
              </div>
            )}

            {/* Packaging */}
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

            {/* Details table */}
            {details && (
              <dl className="space-y-4 mb-8">
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Сезон</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.season}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Смак</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.taste}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Кристалізація</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.crystallisation}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Зберігання</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.storage}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-bark/60">Для чого</dt>
                  <dd className="col-span-2 text-sm text-bark">{details.uses}</dd>
                </div>
              </dl>
            )}

            {/* YouTube link */}
            {product.youtubeVideoLink && (
              <a
                href={product.youtubeVideoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mb-6"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Дивіться як ми збираємо {product.variety.toLowerCase()} мед →
              </a>
            )}

            {/* Order form */}
            <div id="order-form" className="bg-honey-50 rounded-2xl p-6 border border-honey-200">
              <h2 className="font-serif text-2xl font-bold text-bark mb-1">
                Замовити
              </h2>
              <p className="text-bark/60 text-sm mb-5">
                Залиште заявку — ми зв&apos;яжемося з вами найближчим часом
              </p>
              <HoneyOrderForm
                preselectedProduct={product.name}
                packagingOptions={product.packaging || []}
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
                <HoneyCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
