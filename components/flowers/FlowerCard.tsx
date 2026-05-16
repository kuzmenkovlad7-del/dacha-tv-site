import Link from 'next/link'
import Image from 'next/image'
import { existsSync } from 'fs'
import { join } from 'path'
import type { FlowerProduct } from '@/types'

function resolveLocalImage(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) return imageUrl
  return existsSync(join(process.cwd(), 'public', imageUrl)) ? imageUrl : null
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'

interface FlowerCardProps {
  product: FlowerProduct
}

export function FlowerCard({ product }: FlowerCardProps) {
  const imageUrl = resolveLocalImage(product.image_url)

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link href={`/flowers/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image_alt || `${product.name} від Дача TV`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-200 transition-colors">
            <span className="text-3xl mb-2 select-none">🌸</span>
            <span className="text-gray-500 font-medium text-sm text-center px-4">
              {product.name}
            </span>
          </div>
        )}

        {product.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Популярна
            </span>
          </div>
        )}

        {product.status !== 'available' && product.status !== 'preorder' && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">
              Немає в наявності
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-1">
          {product.variety && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {product.variety}
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {product.color && (
            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              {product.color}
            </span>
          )}
          {product.bloom_season && (
            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              {product.bloom_season}
            </span>
          )}
        </div>

        {product.price_uah && (
          <p className="text-sm font-semibold text-gray-900 mb-3">
            від {product.price_uah} грн
          </p>
        )}

        <Link
          href={`/flowers/${product.slug}`}
          className="mt-auto inline-flex items-center justify-center w-full px-4 py-3 bg-gray-900 text-white font-semibold text-sm rounded-xl transition-colors hover:bg-gray-800 min-h-[44px] group-hover:bg-gray-800"
          aria-label={`Детальніше про ${product.name}`}
        >
          Детальніше
        </Link>
      </div>
    </article>
  )
}
