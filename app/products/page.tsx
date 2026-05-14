import type { Metadata } from 'next'
import { ProductGrid } from '@/components/products/ProductGrid'
import { CTAButton } from '@/components/shared/CTAButton'
import { getAllApiaryProducts } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Продукти пасіки',
  description:
    'Пилок, прополіс та горіхи в меду від сімейної пасіки на Харківщині. Натуральні продукти пасічництва — замовляйте напряму.',
  openGraph: {
    title: 'Продукти пасіки | Дача TV',
    description: 'Пилок, прополіс, горіхи в меду від пасіки Дача TV',
  },
}

export default async function ProductsPage() {
  const products = await getAllApiaryProducts().catch(() => [])

  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-3 block">Продукти пасіки</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Більше від пасіки
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Крім меду, наша пасіка дає й інші цінні продукти — пилок, прополіс та горіхи в меду.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid products={products} />
      </div>

      {/* CTA */}
      <div className="bg-bark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream mb-4">
            Потрібна допомога у виборі?
          </h2>
          <p className="text-cream/70 mb-6">
            Зателефонуйте або залиште заявку — ми відповімо на всі питання
          </p>
          <CTAButton href="/contact" variant="white">
            Зв&apos;язатись з нами
          </CTAButton>
        </div>
      </div>
    </div>
  )
}
