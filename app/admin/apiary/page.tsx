export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { createApiaryProduct } from './actions'
import { seedLaunchDataAction } from '@/app/admin/actions/seed'
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-bark">Продукти пасіки</h1>
        <a href="#add-form" className="bg-bark text-white font-semibold px-4 py-2 rounded-lg text-sm min-h-[40px] flex items-center hover:bg-bark-light transition-colors">+ Додати</a>
      </div>

      {/* Products list */}
      {products.length === 0 ? (
        <div className="text-center py-8 text-bark/50 text-sm">
          <p className="mb-4">Немає продуктів</p>
          <form action={seedLaunchDataAction}>
            <button type="submit"
              className="bg-honey-700 hover:bg-honey-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]">
              Заповнити стартовими даними
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-honey-100 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-honey-100 bg-honey-50">
                <th className="text-left px-4 py-3 font-semibold text-bark/70">Назва</th>
                <th className="text-center px-4 py-3 font-semibold text-bark/70">Порядок</th>
                <th className="text-center px-4 py-3 font-semibold text-bark/70">В наявності</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-honey-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-bark">{product.name}</td>
                  <td className="px-4 py-3 text-center text-bark/70">{product.display_order}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/apiary/${product.id}`}
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

      {/* Add form */}
      <div id="add-form" className="bg-white rounded-2xl border border-honey-100 p-6 max-w-2xl">
        <h2 className="font-serif text-lg font-bold text-bark mb-4">Додати продукт</h2>
        <form action={createApiaryProduct} className="space-y-4">
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
            <label className="block text-sm font-semibold text-bark mb-1">Опис</label>
            <textarea name="description" rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-bark mb-1">Упаковка (через кому)</label>
              <input name="packaging" type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-bark mb-1">Порядок</label>
              <input name="display_order" type="number" defaultValue={10}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Зображення (URL або шлях)</label>
            <input name="image_url" type="text"
              placeholder="https://... або /images/dacha-tv/products/..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="in_stock" defaultChecked className="w-4 h-4 accent-honey-600" />
            <span className="text-sm font-medium text-bark">В наявності</span>
          </label>
          <button type="submit"
            className="bg-bark text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-bark-light transition-colors text-sm min-h-[44px]">
            Додати
          </button>
        </form>
      </div>
    </div>
  )
}
