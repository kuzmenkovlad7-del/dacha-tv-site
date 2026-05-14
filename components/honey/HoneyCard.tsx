import Link from 'next/link'
import Image from 'next/image'
import type { HoneyProduct } from '@/types'

interface HoneyCardProps {
  product: HoneyProduct
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiZjI0Ii8+PC9zdmc+'

const VARIETY_NOTES: Record<string, string> = {
  Акація: 'Ніжний смак, кристалізується повільно',
  Липа: 'Класичний аромат, традиційно цілющий',
  Сонях: 'Насичений, золотий, кристалізується міцно',
  "Різнотрав'я": 'Складний характер, кожна партія унікальна',
  Сади: 'Ніжний квітковий мед із садових культур',
  Ліс: 'Темний, комплексний, з мінеральними нотками',
}

export function HoneyCard({ product }: HoneyCardProps) {
  const note = VARIETY_NOTES[product.variety] || `Натуральний мед ${product.variety.toLowerCase()}`
  const imageUrl = product.image_url || null

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-bark/20 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-honey-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image_alt || `${product.name} — мед від пасіки Дача TV`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-honey-50 to-honey-200">
            <span className="text-honey-600 font-serif font-bold text-2xl text-center px-4">
              {product.variety}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-honey-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Популярний
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-bark text-white text-sm font-semibold px-4 py-2 rounded-full">
              Немає в наявності
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-bold text-bark mb-1.5">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">
          {note}
        </p>

        {/* Packaging */}
        {product.packaging && product.packaging.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.packaging.map((pack) => (
              <span
                key={pack}
                className="text-xs bg-honey-50 text-honey-800 border border-honey-200 px-2.5 py-1 rounded-full font-medium"
              >
                {pack}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/honey/${product.slug}`}
          className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-3 bg-bark text-white font-semibold text-sm rounded-full transition-colors hover:bg-bark-light min-h-[44px] group-hover:bg-honey-700"
          aria-label={`Детальніше про ${product.name}`}
        >
          Детальніше
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
