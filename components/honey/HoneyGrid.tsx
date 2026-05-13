import { HoneyCard } from './HoneyCard'
import type { HoneyProduct } from '@/types'

interface HoneyGridProps {
  products: HoneyProduct[]
}

export function HoneyGrid({ products }: HoneyGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-bark/60 text-lg">
          Продукти тимчасово відсутні. Перевірте пізніше або зателефонуйте нам.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <HoneyCard key={product._id} product={product} />
      ))}
    </div>
  )
}
