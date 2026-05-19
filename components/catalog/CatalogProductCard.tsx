import Link from 'next/link'
import Image from 'next/image'
import type { CatalogProduct } from '@/types'

const BLUR_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+'

interface CatalogProductCardProps {
  product: CatalogProduct
  categorySlug: string
}

export function CatalogProductCard({ product, categorySlug }: CatalogProductCardProps) {
  const href = `/catalog/${categorySlug}/${product.slug}`
  const hasImage = Boolean(product.main_image_url)
  const hasDiscount = product.compare_price_uah && product.compare_price_uah > product.price_uah

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-honey-100 shadow-sm hover:shadow-md transition-all flex flex-col">
      <Link href={href} className="relative block aspect-square bg-honey-50 overflow-hidden">
        {hasImage ? (
          <Image
            src={product.main_image_url!}
            alt={product.name_ua}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={BLUR_URL}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-honey-50 to-forest-50">
            <span className="text-forest-600 font-serif font-semibold text-base text-center px-3 leading-tight">
              {product.name_ua}
            </span>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 text-xs font-semibold bg-honey-700 text-white px-2 py-0.5 rounded-full">
            Хіт
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 text-xs font-semibold bg-green-600 text-white px-2 py-0.5 rounded-full">
            −{Math.round((1 - product.price_uah / product.compare_price_uah!) * 100)}%
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={href}>
          <h3 className="font-serif text-base font-semibold text-bark mb-2 leading-tight line-clamp-2 hover:text-honey-700 transition-colors">
            {product.name_ua}
          </h3>
        </Link>

        {product.short_description && (
          <p className="text-xs text-bark/60 line-clamp-2 mb-3">{product.short_description}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-bark">{product.price_uah.toLocaleString('uk-UA')} грн</p>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
                {product.compare_price_uah!.toLocaleString('uk-UA')} грн
              </p>
            )}
          </div>
          <Link
            href={href}
            className="shrink-0 text-sm font-semibold px-3 py-2 bg-bark text-white rounded-full hover:bg-bark/90 transition-colors min-h-[40px] flex items-center"
          >
            Детальніше
          </Link>
        </div>
      </div>
    </article>
  )
}
