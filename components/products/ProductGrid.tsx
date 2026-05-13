'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { HoneyOrderForm } from '@/components/forms/HoneyOrderForm'
import type { ApinaryProduct } from '@/types'

interface ProductGridProps {
  products: ApinaryProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

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
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onOrder={() => setSelectedProduct(product.name)}
          />
        ))}
      </div>

      {/* Inline order form */}
      {selectedProduct && (
        <div id="order-form" className="max-w-lg mx-auto scroll-mt-8">
          <div className="bg-honey-50 rounded-2xl p-6 border border-honey-200">
            <h2 className="font-serif text-2xl font-bold text-bark mb-2">
              Залишити заявку
            </h2>
            <p className="text-bark/70 mb-6">
              Замовлення: <strong>{selectedProduct}</strong>
            </p>
            <HoneyOrderForm
              preselectedProduct={selectedProduct}
              productOptions={products.map((p) => p.name)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
