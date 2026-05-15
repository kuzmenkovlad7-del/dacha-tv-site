import type { Metadata } from 'next'
import Link from 'next/link'
import { FlowerGrid } from '@/components/flowers/FlowerGrid'
import { FlowerInquiryForm } from '@/components/forms/FlowerInquiryForm'
import { getAllFlowerProducts } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Квіти — хризантеми від Дача TV',
  description: 'Хризантеми та квіти від домашнього розсадника. Помпонові та кущові сорти, зимостійкі, перевірені на Харківщині.',
  openGraph: {
    title: 'Квіти | Дача TV',
    description: 'Хризантеми та квіти від домашнього розсадника на Харківщині.',
  },
}

export default async function FlowersPage() {
  const products = await getAllFlowerProducts().catch(() => [])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <nav aria-label="Навігація" className="text-sm text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <span className="text-white/70">Квіти</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              Домашній розсадник
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Хризантеми
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Сорти, перевірені на Харківщині. Вирощуємо вдома з любов&apos;ю — для букетів,
              саду і подарунків.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Каталог
          </h2>
          <span className="text-sm text-gray-400">
            {products.length} {products.length === 1 ? 'сорт' : products.length < 5 ? 'сорти' : 'сортів'}
          </span>
        </div>

        <FlowerGrid products={products} />
      </div>

      {/* Inquiry section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2 text-center">
            Замовити квіти
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center">
            Залиште заявку — уточнимо наявність і домовимося про доставку або самовивіз.
          </p>
          <FlowerInquiryForm source="/flowers" />
        </div>
      </div>
    </div>
  )
}
