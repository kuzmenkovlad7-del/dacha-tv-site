export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { createApiaryProduct } from './actions'
import { syncCatalogAction } from '@/app/admin/actions/seed'
import type { ApiaryProduct } from '@/types'

export const metadata: Metadata = {
  title: 'Адмін — Продукти пасіки',
  robots: 'noindex, nofollow',
}

export default async function AdminApiaryPage() {
  let products: ApiaryProduct[] = []
  try {
    const client = getAdminClient()
    const { data } = await client.from('apiary_products').select('*').order('display_order', { ascending: true })
    products = (data ?? []) as ApiaryProduct[]
  } catch { /* env not set — show empty list */ }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Продукти пасіки</h1>
          {products.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{products.length} позицій</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <form action={syncCatalogAction}>
            <button type="submit"
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Синхр.
            </button>
          </form>
          <a href="#add-form"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            + Додати
          </a>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-center py-16 px-6 mb-8">
          <p className="text-gray-900 font-semibold mb-1">Продуктів ще немає</p>
          <p className="text-sm text-gray-500 mb-6">Натисніть «Синхронізувати» щоб імпортувати каталог</p>
          <form action={syncCatalogAction}>
            <button type="submit"
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              Синхронізувати каталог
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Назва</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Порядок</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Наявн.</th>
                <th className="px-5 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{product.name}</td>
                  <td className="px-5 py-3.5 text-center text-gray-500">{product.display_order}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/apiary/${product.id}`}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Змін.
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add form */}
      <div id="add-form" className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Додати продукт</h2>
        <form action={createApiaryProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Назва</label>
              <input name="name" type="text" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Slug</label>
              <input name="slug" type="text" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Опис</label>
            <textarea name="description" rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Упаковка (через кому)</label>
              <input name="packaging" type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Порядок</label>
              <input name="display_order" type="number" defaultValue={10}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Зображення (URL або шлях)</label>
            <input name="image_url" type="text"
              placeholder="https://... або /images/dacha-tv/products/..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="in_stock" defaultChecked className="w-4 h-4 rounded accent-gray-900" />
            <span className="text-sm font-medium text-gray-700">В наявності</span>
          </label>
          <button type="submit"
            className="h-10 px-5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
            Додати
          </button>
        </form>
      </div>
    </div>
  )
}
