import Image from 'next/image'
import type { BeekeeperProduct } from '@/types'

interface BeekeeperSectionProps {
  products: BeekeeperProduct[]
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTY4MDM0Ii8+PC9zdmc+'

export function BeekeeperSection({ products }: BeekeeperSectionProps) {
  if (products.length === 0) return null

  return (
    <div className="space-y-8">
      {products.map((product) => {
        const imageUrl = product.image_url || null

        return (
          <article
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden border border-forest-100 shadow-sm"
          >
            {imageUrl && (
              <div className="relative h-48 md:h-64">
                <Image
                  src={imageUrl}
                  alt={product.image_alt || `${product.name} — пасіка Дача TV`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="font-serif text-2xl font-bold text-bark mb-2">
                {product.name}
              </h3>

              {product.season_note && (
                <p className="text-forest-700 text-sm font-medium mb-3 inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {product.season_note}
                </p>
              )}

              {product.breeds && product.breeds.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-bark/60 mb-2">Доступні породи:</p>
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

              {product.description && (
                <p className="text-bark/70 leading-relaxed">{product.description}</p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
