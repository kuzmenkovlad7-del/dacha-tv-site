export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { syncCatalogAction } from '@/app/admin/actions/seed'
import type { FlowerProduct } from '@/types'

export const metadata: Metadata = {
  title: 'Адмін — Квіти',
  robots: 'noindex, nofollow',
}

export default async function AdminFlowersPage() {
  let products: FlowerProduct[] = []
  let dbError: string | null = null
  try {
    const client = getAdminClient()
    const { data, error } = await client.from('flower_products').select('*').order('display_order', { ascending: true })
    if (error) dbError = error.message
    else products = (data ?? []) as FlowerProduct[]
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Помилка підключення'
  }

  return (
    <div className="px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Квіти</h1>
          {products.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{products.length} позицій</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Sync button — always visible */}
          <form action={syncCatalogAction}>
            <button type="submit"
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Синхронізувати каталог
            </button>
          </form>
          <Link
            href="/admin/flowers/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            + Додати
          </Link>
        </div>
      </div>

      {/* Error state */}
      {dbError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 font-medium">Помилка БД</p>
          <p className="text-xs text-red-600 mt-1 font-mono">{dbError}</p>
        </div>
      )}

      {/* Empty state */}
      {!dbError && products.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="text-center py-16 px-6">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold mb-1">Квітів ще немає в базі</p>
            <p className="text-sm text-gray-500 mb-6">Натисніть «Синхронізувати каталог» щоб імпортувати всі 50 сортів хризантем</p>
            <form action={syncCatalogAction}>
              <button type="submit"
                className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Синхронізувати каталог
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      {products.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Назва</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Сорт</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Колір</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Порядок</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Наявн.</th>
                <th className="px-5 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{product.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{product.variety ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{product.color ?? '—'}</td>
                  <td className="px-5 py-3.5 text-center text-gray-500">{product.display_order}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/flowers/${product.id}`}
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
    </div>
  )
}
