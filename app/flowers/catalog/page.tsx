import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllFlowerProducts } from '@/lib/supabase/queries'
import type { FlowerProduct } from '@/types'

export const metadata: Metadata = {
  title: 'Каталог хризантем — Дача TV',
  description:
    'Колекція хризантем від домашнього розсадника Дача TV. Помпонові, кущові, великоквіткові та рідкісні сорти на Харківщині.',
  openGraph: {
    title: 'Каталог хризантем | Дача TV',
    description: 'Колекція хризантем — понад 50 сортів від домашнього розсадника.',
  },
}

const VARIETY_ORDER = [
  'Помпонова',
  'Кущова',
  'Великоквіткова',
  'Дрібноквіткова',
  'Компактна',
  'Анемонова',
  'Павукоподібна',
]

const VARIETY_DESCRIPTIONS: Record<string, string> = {
  'Помпонова': 'Класичні кулясті суцвіття. Улюбленці флористів — щільні, симетричні, довговазні.',
  'Кущова': 'Один стебель — безліч квіток. Природна пишність без зайвих зусиль.',
  'Великоквіткова': 'Одна квітка на стеблі, діаметр до 25 см. Для виставок і розкішних букетів.',
  'Дрібноквіткова': 'Легка хмарка з сотень крихітних суцвіть. Витонченість у масштабі.',
  'Компактна': 'Низькорослі форми до 35 см. Ідеальні для вазонів і балконів.',
  'Анемонова': 'Плоскі крайові пелюстки + пухнастий центр. Виглядає як дві квітки в одній.',
  'Павукоподібна': 'Довгі трубчасті звивисті пелюстки. Екзотика у вашому саду.',
}

function ColorDot({ color }: { color: string | null }) {
  if (!color) return null
  const normalized = color.toLowerCase()
  let bg = 'bg-gray-300'
  if (normalized.includes('біл')) bg = 'bg-white border border-gray-200'
  else if (normalized.includes('жовт') || normalized.includes('золот')) bg = 'bg-yellow-300'
  else if (normalized.includes('рожев') || normalized.includes('персик')) bg = 'bg-pink-300'
  else if (normalized.includes('малин') || normalized.includes('бордо') || normalized.includes('бургун')) bg = 'bg-rose-700'
  else if (normalized.includes('помаранч') || normalized.includes('оранж')) bg = 'bg-orange-400'
  else if (normalized.includes('бронз') || normalized.includes('теракот') || normalized.includes('мідн')) bg = 'bg-amber-600'
  else if (normalized.includes('лілов') || normalized.includes('фіолет') || normalized.includes('бузков')) bg = 'bg-purple-400'
  else if (normalized.includes('лаванд')) bg = 'bg-violet-300'
  else if (normalized.includes('зелен') || normalized.includes('салат') || normalized.includes('лайм')) bg = 'bg-green-400'
  else if (normalized.includes('шоколад') || normalized.includes('коричн')) bg = 'bg-amber-900'
  else if (normalized.includes('кремов') || normalized.includes('вершк')) bg = 'bg-amber-100 border border-gray-200'
  else if (normalized.includes('темно-черв') || normalized.includes('оксамит')) bg = 'bg-red-900'
  return <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${bg}`} aria-hidden="true" />
}

function CatalogCard({ product }: { product: FlowerProduct }) {
  return (
    <Link
      href={`/flowers/${product.slug}`}
      className="group block border-b border-gray-100 py-5 hover:bg-gray-50 transition-colors px-1"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ColorDot color={product.color} />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              {product.color}
            </span>
            {product.is_featured && (
              <span className="text-[10px] font-semibold text-white bg-gray-900 px-2 py-0.5 rounded-full">
                Хіт
              </span>
            )}
          </div>
          <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-1">
              {product.short_description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {product.price_uah && (
            <p className="text-sm font-semibold text-gray-900">від {product.price_uah} грн</p>
          )}
          {product.bloom_season && (
            <p className="text-xs text-gray-400 mt-0.5">{product.bloom_season}</p>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-700 transition-colors mt-1.5">
            Детальніше
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function FlowersCatalogPage() {
  const allProducts = await getAllFlowerProducts().catch(() => [])

  const featured = allProducts.filter((p) => p.is_featured && p.in_stock)

  const byVariety = VARIETY_ORDER.reduce<Record<string, FlowerProduct[]>>((acc, v) => {
    const group = allProducts.filter((p) => p.variety === v && p.in_stock)
    if (group.length) acc[v] = group
    return acc
  }, {})

  const otherVarieties = [
    ...new Set(allProducts.filter((p) => p.variety && !VARIETY_ORDER.includes(p.variety) && p.in_stock).map((p) => p.variety!)),
  ]
  for (const v of otherVarieties) {
    byVariety[v] = allProducts.filter((p) => p.variety === v && p.in_stock)
  }

  const total = allProducts.filter((p) => p.in_stock).length

  return (
    <div className="bg-white min-h-screen">

      {/* Editorial header — dark, full-bleed */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-16 pb-14 md:pt-24 md:pb-20">
          <nav className="text-xs text-white/30 mb-10 flex items-center gap-2">
            <Link href="/" className="hover:text-white/60 transition-colors">Головна</Link>
            <span>›</span>
            <Link href="/flowers" className="hover:text-white/60 transition-colors">Квіти</Link>
            <span>›</span>
            <span className="text-white/60">Каталог</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em] mb-5">
                Домашній розсадник · Харківщина · Хризантеми
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none tracking-tight mb-5">
                Колекція
              </h1>
              <p className="text-white/50 text-lg max-w-lg leading-relaxed">
                {total} сортів хризантем. Від класичних помпонів до рідкісних spider. Вирощено вдома — для вас.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-6xl font-bold text-white/10 font-serif tabular-nums">{total}</p>
              <p className="text-xs text-white/30 uppercase tracking-widest">сортів</p>
            </div>
          </div>

          {/* Featured names strip */}
          {featured.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Рекомендовані</p>
              <div className="flex flex-wrap gap-2">
                {featured.map((p) => (
                  <Link
                    key={p.id}
                    href={`/flowers/${p.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded-full transition-all"
                  >
                    <ColorDot color={p.color} />
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Catalog body */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 md:py-16">

        {/* Variety jump nav */}
        {Object.keys(byVariety).length > 1 && (
          <div className="mb-12 pb-8 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Різновиди</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(byVariety).map(([variety, products]) => (
                <a
                  key={variety}
                  href={`#${encodeURIComponent(variety)}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-full transition-all"
                >
                  {variety}
                  <span className="text-xs text-gray-400">{products.length}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Variety sections */}
        <div className="space-y-16">
          {Object.entries(byVariety).map(([variety, products]) => (
            <section key={variety} id={encodeURIComponent(variety)}>

              {/* Variety header — large editorial */}
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-8 pb-6 border-b-2 border-gray-900">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {variety}
                  </h2>
                  {VARIETY_DESCRIPTIONS[variety] && (
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-md">
                      {VARIETY_DESCRIPTIONS[variety]}
                    </p>
                  )}
                </div>
                <div className="flex items-end justify-start md:justify-end">
                  <span className="text-4xl font-bold text-gray-100 font-serif tabular-nums select-none">
                    {String(products.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Products list */}
              <div className="divide-y divide-gray-50">
                {products.map((product) => (
                  <CatalogCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Не знаєте що обрати?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Залиште заявку — підберемо сорти під ваш запит, колір і бюджет.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/flowers#order-form"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors min-h-[48px] text-sm"
            >
              Залишити заявку
            </Link>
            <Link
              href="/flowers"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-500 transition-colors min-h-[48px] text-sm"
            >
              Фото каталог
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
