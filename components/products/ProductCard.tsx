import Link from 'next/link'
import Image from 'next/image'
import type { ApiaryProduct } from '@/types'

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiZjI0Ii8+PC9zdmc+'

interface ProductCardProps {
  product: ApiaryProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image_url || null
  const blurb = product.short_description || product.description || null

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-honey-100 flex flex-col">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-honey-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image_alt || `${product.name} від пасіки Дача TV`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest-50 to-forest-100">
            <span className="text-forest-600 font-serif font-semibold text-lg text-center px-4">
              {product.name}
            </span>
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
              Немає в наявності
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-semibold text-bark mb-1">
          {product.name}
        </h3>

        {blurb && (
          <p className="text-sm text-bark/60 leading-relaxed mb-3 line-clamp-2">
            {blurb}
          </p>
        )}

        {product.packaging && product.packaging.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
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

        <div className="mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="w-full inline-flex items-center justify-center gap-1 px-4 py-3 bg-bark text-white font-semibold text-sm rounded-full transition-colors min-h-[44px] hover:bg-bark/90"
          >
            Детальніше
          </Link>
        </div>
      </div>
    </article>
  )
}
