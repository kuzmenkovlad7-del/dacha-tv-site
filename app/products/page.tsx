import type { Metadata } from 'next'
import { ProductGrid } from '@/components/products/ProductGrid'
import { CTAButton } from '@/components/shared/CTAButton'
import { getAllApiaryProducts } from '@/lib/supabase/queries'
import type { ApiaryProduct } from '@/types'

export const metadata: Metadata = {
  title: 'Продукти пасіки',
  description:
    'Пилок, прополіс та горіхи в меду від сімейної пасіки на Харківщині. Натуральні продукти пасічництва — замовляйте напряму.',
  openGraph: {
    title: 'Продукти пасіки | Дача TV',
    description: 'Пилок, прополіс, горіхи в меду від пасіки Дача TV',
  },
}

// Fallback static products shown when Supabase is not yet populated
const STATIC_PRODUCTS: ApiaryProduct[] = [
  {
    id: 'static-pollen',
    name: 'Квітковий пилок',
    slug: 'pollen',
    description: null,
    packaging: ['Уточнюйте при замовленні'],
    in_stock: true,
    display_order: 1,
    image_url: null,
    image_alt: null,
  },
  {
    id: 'static-propolis',
    name: 'Прополіс',
    slug: 'propolis',
    description: null,
    packaging: ['Уточнюйте при замовленні'],
    in_stock: true,
    display_order: 2,
    image_url: null,
    image_alt: null,
  },
  {
    id: 'static-nuts',
    name: 'Горіхи в меду',
    slug: 'nuts-in-honey',
    description: null,
    packaging: ['200ml'],
    in_stock: true,
    display_order: 3,
    image_url: null,
    image_alt: null,
  },
]

export default async function ProductsPage() {
  const supabaseProducts = await getAllApiaryProducts().catch(() => [])
  const products = supabaseProducts.length > 0 ? supabaseProducts : STATIC_PRODUCTS

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

      {/* Product descriptions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 border border-honey-100">
            <h2 className="font-serif text-xl font-bold text-bark mb-3">Квітковий пилок</h2>
            <p className="text-bark/70 text-sm leading-relaxed">
              Зібраний бджолами з квіток і накопичений у вуликах. Містить білки, вітаміни та мінерали. Рекомендують як природну добавку до харчування.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-honey-100">
            <h2 className="font-serif text-xl font-bold text-bark mb-3">Прополіс</h2>
            <p className="text-bark/70 text-sm leading-relaxed">
              Смолиста речовина, яку бджоли виробляють для захисту вулика. Відомий антибактеріальними властивостями. Натуральний або у вигляді настоянки.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-honey-100">
            <h2 className="font-serif text-xl font-bold text-bark mb-3">Горіхи в меду</h2>
            <p className="text-bark/70 text-sm leading-relaxed">
              200ml скляна банка горіхів, залитих свіжим медом. Чудовий подарунок або корисний перекус. Суміш горіхів та натуральний мед нашої пасіки.
            </p>
          </div>
        </div>

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
