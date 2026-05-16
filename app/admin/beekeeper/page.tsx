export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { createBeekeeperProduct } from './actions'
import { syncCatalogAction } from '@/app/admin/actions/seed'
import { MediaFields } from '@/components/admin/MediaFields'

export const metadata: Metadata = {
  title: 'Адмін — Пасічникам',
  robots: 'noindex, nofollow',
}

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
const LABEL = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

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

interface BKProduct { id: string; name: string; product_type: string; display_order: number; status: string }

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
      status: String(r.status ?? 'available'),
    }))
  } catch { /* env not configured */ }

  return (
    <div className="px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Пасічникам</h1>
          {products.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{products.length} позицій</p>
          )}
        </div>
        <form action={syncCatalogAction}>
          <button type="submit"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Синхр.
          </button>
        </form>
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-center py-12 px-6 mb-8">
          <p className="text-gray-900 font-semibold mb-1">Продуктів ще немає</p>
          <p className="text-sm text-gray-500 mb-5">Натисніть «Синхр.» щоб імпортувати базові продукти</p>
          <form action={syncCatalogAction}>
            <button type="submit"
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              Синхронізувати каталог
            </button>
          </form>
        </div>
      )}

      {/* Products table */}
      {products.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Назва</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Тип</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Наявн.</th>
                <th className="px-5 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{product.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{TYPE_LABELS[product.product_type] ?? product.product_type}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.status === 'available' ? 'bg-green-500' : product.status === 'preorder' ? 'bg-amber-400' : 'bg-gray-300'}`} title={product.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/beekeeper/${product.id}`}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      Змін.
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline create form */}
      <div id="create" className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Додати продукт</h2>
        <form action={createBeekeeperProduct} className="space-y-4">
          <div>
            <label className={LABEL}>Назва</label>
            <input name="name" type="text" required className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Тип продукту</label>
            <select name="product_type" required className={INPUT}>
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Породи (через кому)</label>
              <input name="breeds" type="text" placeholder="Buckfast, Карніка" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Примітка про сезон</label>
              <input name="season_note" type="text" placeholder="Доступні з квітня по серпень" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Статус</label>
            <select name="status" defaultValue="available" className={INPUT}>
              <option value="available">В наявності</option>
              <option value="preorder">Передзамовлення</option>
              <option value="out_of_stock">Немає в наявності</option>
              <option value="archived">Архів</option>
            </select>
          </div>

          <MediaFields />

          <details className="border border-gray-100 rounded-lg">
            <summary className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none list-none flex items-center gap-2">
              <span>▸</span> Додатково
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              <div>
                <label className={LABEL}>Slug (URL)</label>
                <input name="slug" type="text" placeholder="bee-packages (авто якщо порожньо)" className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Опис</label>
                <textarea name="description" rows={3} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Порядок відображення</label>
                <input name="display_order" type="number" defaultValue={10} className={INPUT} />
              </div>
            </div>
          </details>

          <button type="submit"
            className="h-10 px-5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
            Додати
          </button>
        </form>
      </div>
    </div>
  )
}
