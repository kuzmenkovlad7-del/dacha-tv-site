export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllFlowerProducts } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Адмін — Квіти',
  robots: 'noindex, nofollow',
}

export default async function AdminFlowersPage() {
  const products = await getAllFlowerProducts().catch(() => [])

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-bark">Квіти</h1>
        <Link
          href="/admin/flowers/new"
          className="bg-bark text-white font-semibold px-4 py-2 rounded-lg hover:bg-bark-light transition-colors text-sm min-h-[40px] flex items-center"
        >
          + Додати
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-bark/50">Немає квітів</div>
      ) : (
        <div className="bg-white rounded-2xl border border-honey-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-honey-100 bg-honey-50">
                <th className="text-left px-4 py-3 font-semibold text-bark/70">Назва</th>
                <th className="text-left px-4 py-3 font-semibold text-bark/70 hidden sm:table-cell">Сорт</th>
                <th className="text-center px-4 py-3 font-semibold text-bark/70">Порядок</th>
                <th className="text-center px-4 py-3 font-semibold text-bark/70">В наявн.</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-honey-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-bark">{product.name}</td>
                  <td className="px-4 py-3 text-bark/70 hidden sm:table-cell">{product.variety ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-bark/70">{product.display_order}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/flowers/${product.id}`}
                      className="text-honey-700 hover:text-honey-900 font-medium transition-colors"
                    >
                      Редагувати
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
