export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getPublishedCategories, getCategoryProductCount } from '@/lib/supabase/catalog'
import { CategoryCard } from '@/components/catalog/CategoryCard'

export const metadata: Metadata = {
  title: 'Каталог товарів | Дача TV',
  description: 'Широкий асортимент товарів для дому, саду та дачі. Якісні товари за доступними цінами з доставкою по Україні.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    title: 'Каталог товарів | Дача TV',
    description: 'Широкий асортимент товарів для дому, саду та дачі.',
    type: 'website',
  },
}

export default async function CatalogPage() {
  const categories = await getPublishedCategories().catch(() => [])

  const counts = await Promise.all(
    categories.map((cat) => getCategoryProductCount(cat.slug).catch(() => 0))
  )

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-3 block">
            Магазин
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Каталог товарів
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Товари для дому, саду та дачного господарства. Якість перевірена — доставка по Україні.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-bark/40 mb-2">Незабаром</p>
            <p className="text-gray-400 text-sm">Каталог товарів готується. Заходьте пізніше або зв&apos;яжіться з нами.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} productCount={counts[i]} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
