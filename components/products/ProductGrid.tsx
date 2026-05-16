import Link from 'next/link'
import { ProductCard } from './ProductCard'
import { STATIC_APIARY } from '@/lib/static-apiary'
import type { ApiaryProduct } from '@/types'

interface ProductGridProps {
  products: ApiaryProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const displayProducts = products.length > 0 ? products : STATIC_APIARY

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-bark/50 text-sm">
            Наявність та ціни уточнюйте за телефоном або через{' '}
            <Link href="/contact" className="text-honey-700 underline hover:no-underline">
              форму замовлення
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}
