import Link from 'next/link'
import Image from 'next/image'
import { CTAButton } from '@/components/shared/CTAButton'
import { urlFor } from '@/lib/sanity/image'
import type { HoneyProduct } from '@/types'

interface HoneyCardProps {
  product: HoneyProduct
}

// Honey-gold blurDataURL placeholder
const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiZjI0Ii8+PC9zdmc+'

const VARIETY_NOTES: Record<string, string> = {
  Акація: 'Ніжний смак, кристалізується повільно — ідеально для подарунка',
  Липа: 'Класичний аромат, традиційно цілющий — серце Харківщини',
  Сонях: 'Насичений, золотий, кристалізується міцно — справжня осінь',
  "Різнотрав'я": 'Складний характер від різнотрав\'я — кожна партія унікальна',
  Сади: 'Ніжний квітковий мед із садових культур — ранній сезон',
  Ліс: 'Темний, комплексний, з мінеральними нотками — лісова глибина',
}

export function HoneyCard({ product }: HoneyCardProps) {
  const note = VARIETY_NOTES[product.variety] || `Натуральний мед ${product.variety.toLowerCase()}`
  const hasValidImage = product.image?.asset?._ref && product.image.asset._ref.length > 0
  const imageUrl = hasValidImage
    ? urlFor(product.image).width(400).height(400).url()
    : null

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-honey-100 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-honey-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image?.alt || `${product.name} — мед від пасіки Дача TV`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-honey-100 to-honey-200">
            <span className="text-honey-600 font-serif font-semibold text-lg text-center px-4">
              {product.variety}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="bg-honey-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Найпопулярніший
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
              Немає в наявності
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-semibold text-bark mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-bark/70 mb-3 leading-relaxed flex-1">
          {note}
        </p>

        {/* Packaging */}
        {product.packaging && product.packaging.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.packaging.map((pack) => (
              <span
                key={pack}
                className="text-xs bg-honey-50 text-honey-700 border border-honey-200 px-2 py-0.5 rounded-full"
              >
                {pack}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/honey/${product.slug.current}`}
          className="inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-honey-50 hover:bg-honey-100 text-honey-800 font-semibold text-sm rounded-lg transition-colors min-h-[44px] border border-honey-200"
          aria-label={`Детальніше про ${product.name}`}
        >
          Детальніше
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
