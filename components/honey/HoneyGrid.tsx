import Link from 'next/link'
import { HoneyCard } from './HoneyCard'
import { STATIC_HONEY } from '@/lib/static-catalog'
import type { HoneyProduct } from '@/types'

interface HoneyGridProps {
  products: HoneyProduct[]
}

export function HoneyGrid({ products }: HoneyGridProps) {
  const displayProducts = products.length > 0 ? products : STATIC_HONEY

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <HoneyCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-10 text-center text-bark/50 text-sm">
          Актуальна наявність і ціни — за телефоном або через{' '}
          <Link href="/contact" className="text-honey-700 underline hover:no-underline">
            форму замовлення
          </Link>
          .
        </p>
      )}
    </div>
  )
}
