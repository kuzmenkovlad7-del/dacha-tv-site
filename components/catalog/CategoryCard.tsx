import Link from 'next/link'
import Image from 'next/image'
import type { CatalogCategory } from '@/types'

interface CategoryCardProps {
  category: CatalogCategory
  productCount?: number
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-honey-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative aspect-[4/3] bg-honey-50 overflow-hidden">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name_ua}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-honey-50 to-forest-50">
            <span className="text-4xl opacity-30" aria-hidden="true">🛍</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-serif font-semibold text-bark text-lg leading-tight mb-1">
          {category.name_ua}
        </h2>
        {productCount != null && (
          <p className="text-xs text-gray-400">{productCount} товарів</p>
        )}
        {category.description && !productCount && (
          <p className="text-sm text-bark/60 line-clamp-2 mt-1">{category.description}</p>
        )}
      </div>
    </Link>
  )
}
