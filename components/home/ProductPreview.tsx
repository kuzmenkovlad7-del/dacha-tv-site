import Link from 'next/link'
import { HoneyCard } from '@/components/honey/HoneyCard'
import { CTAButton } from '@/components/shared/CTAButton'
import type { HoneyProduct } from '@/types'

interface ProductPreviewProps {
  products: HoneyProduct[]
}

export function ProductPreview({ products }: ProductPreviewProps) {
  if (products.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-cream" aria-labelledby="products-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="products-heading" className="font-serif text-3xl md:text-4xl font-bold text-bark mb-4">
            Наш мед
          </h2>
          <p className="text-lg text-bark/70 max-w-2xl mx-auto">
            Сезонний мед без домішок. Кожен сорт зібраний у свій час і відповідає природному циклу цвітіння.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {products.map((product) => (
            <HoneyCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <CTAButton href="/honey" variant="outline" size="md">
            Переглянути всі сорти →
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
