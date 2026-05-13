import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBeekeeperProducts } from '@/lib/supabase/queries'
import { deleteBeekeeperProduct, createBeekeeperProduct } from './actions'

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

export default async function AdminBeekeeperPage() {
  const products = await getAllBeekeeperProducts().catch(() => [])

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-bark">Для пасічників</h1>
      </div>

      {/* Products list */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl border border-honey-100 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-honey-100 bg-honey-50">
                <th className="text-left px-4 py-3 font-semibold text-bark/70">Назва</th>
                <th className="text-left px-4 py-3 font-semibold text-bark/70">Тип</th>
                <th className="text-center px-4 py-3 font-semibold text-bark/70">Порядок</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-honey-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-bark">{product.name}</td>
                  <td className="px-4 py-3 text-bark/70">{product.product_type}</td>
                  <td className="px-4 py-3 text-center text-bark/70">{product.display_order}</td>
                  <td className="px-4 py-3 text-right flex gap-3 justify-end">
                    <Link
                      href={`/admin/beekeeper/${product.id}`}
                      className="text-honey-700 hover:text-honey-900 font-medium transition-colors"
                    >
                      Редагувати
                    </Link>
                    <form action={deleteBeekeeperProduct.bind(null, product.id)} className="inline">
                      <button type="submit"
                        className="text-red-600 hover:text-red-800 text-xs font-medium transition-colors">
                        Видалити
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
      <div className="bg-white rounded-2xl border border-honey-100 p-6 max-w-2xl">
        <h2 className="font-serif text-lg font-bold text-bark mb-4">Додати продукт</h2>
        <form action={createBeekeeperProduct} encType="multipart/form-data" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-bark mb-1">Назва</label>
              <input name="name" type="text" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-bark mb-1">Slug</label>
              <input name="slug" type="text" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Тип продукту</label>
            <select name="product_type" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400">
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Опис</label>
            <textarea name="description" rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Породи (через кому)</label>
            <input name="breeds" type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="Buckfast, Карніка" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Примітка про сезон</label>
            <input name="season_note" type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="Доступні з квітня по серпень" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Порядок</label>
            <input name="display_order" type="number" defaultValue={10}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Зображення</label>
            <input name="image" type="file" accept="image/*" className="w-full text-sm text-bark/70" />
          </div>

          <button type="submit"
            className="bg-bark text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-bark-light transition-colors text-sm min-h-[44px]">
            Додати
          </button>
        </form>
      </div>
    </div>
  )
}
