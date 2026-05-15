export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { deleteBeekeeperProduct, createBeekeeperProduct } from './actions'
import { syncCatalogAction } from '@/app/admin/actions/seed'

export const metadata: Metadata = {
  title: 'Адмін — Для пасічників',
  robots: 'noindex, nofollow',
}

const PRODUCT_TYPES = [
  { value: 'bee_packages', label: 'Бджолопакети' },
  { value: 'bee_colonies', label: 'Бджолосімї' },
  { value: 'empty_hives', label: 'Порожні вулики' },
  { value: 'hives_with_bees', label: 'Вулики з бджолами' },
]

const TYPE_LABELS: Record<string, string> = {
  bee_packages: 'Бджолопакети',
  bee_colonies: 'Бджолосімї',
  empty_hives: 'Порожні вулики',
  hives_with_bees: 'Вулики з бджолами',
}

interface BKProduct { id: string; name: string; product_type: string; display_order: number }

export default async function AdminBeekeeperPage() {
  let products: BKProduct[] = []
  try {
    const client = getAdminClient()
    const { data } = await client.from('beekeeper_products').select('*').order('display_order', { ascending: true })
    products = (data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id ?? ''),
      name: String(r.name ?? ''),
      product_type: String(r.product_type ?? ''),
      display_order: Number(r.display_order ?? 0),
    }))
  } catch { /* env not set — show empty list */ }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Пасічникам</h1>
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

      {products.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-center py-16 px-6 mb-8">
          <p className="text-gray-900 font-semibold mb-1">Продуктів ще немає</p>
          <p className="text-sm text-gray-500 mb-2">Додайте продукт за допомогою форми нижче</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Назва</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Тип</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Порядок</th>
                <th className="px-5 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{product.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{TYPE_LABELS[product.product_type] ?? product.product_type}</td>
                  <td className="px-5 py-3.5 text-center text-gray-500">{product.display_order}</td>
                  <td className="px-5 py-3.5 text-right flex gap-3 justify-end">
                    <Link
                      href={`/admin/beekeeper/${product.id}`}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Змін.
                    </Link>
                    <form action={deleteBeekeeperProduct.bind(null, product.id)} className="inline">
                      <button type="submit"
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                        Вид.
                      </button>
                    </form>
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
        <form action={createBeekeeperProduct} className="space-y-4">
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
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Тип продукту</label>
            <select name="product_type" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent">
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Опис</label>
            <textarea name="description" rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Породи (через кому)</label>
              <input name="breeds" type="text"
                placeholder="Buckfast, Карніка"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Порядок</label>
              <input name="display_order" type="number" defaultValue={10}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Примітка про сезон</label>
            <input name="season_note" type="text"
              placeholder="Доступні з квітня по серпень"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          {/* Media */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Медіа</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Головне зображення (URL або /images/...)</label>
              <input name="image_url" type="text"
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">YouTube відео (URL)</label>
              <input name="youtube_url" type="text"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
            </div>
          </div>

          <button type="submit"
            className="h-10 px-5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
            Додати
          </button>
        </form>
      </div>
    </div>
  )
}
