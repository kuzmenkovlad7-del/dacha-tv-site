export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import type { CatalogCategory } from '@/types'
import { publishCategoryAction, unpublishCategoryAction } from './actions'

export const metadata: Metadata = { title: 'Адмін — Категорії каталогу', robots: 'noindex, nofollow' }

export default async function CatalogCategoriesPage() {
  let categories: CatalogCategory[] = []
  let errorMsg: string | null = null
  let tablesMissing = false

  try {
    const client = getAdminClient()
    const { data, error } = await client
      .from('catalog_categories')
      .select('*')
      .order('is_published', { ascending: false })
      .order('display_order', { ascending: true })
      .order('name_ua', { ascending: true })

    if (error) {
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        tablesMissing = true
      } else {
        errorMsg = error.message
      }
    } else {
      categories = (data ?? []) as CatalogCategory[]
    }
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : 'Помилка завантаження'
  }

  const publishedCount = categories.filter((c) => c.is_published).length

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Категорії каталогу</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {publishedCount} опублікованих · {categories.length - publishedCount} прихованих
          </p>
        </div>
        <Link
          href="/admin/catalog/pipeline"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          → Пайплайн імпорту
        </Link>
      </div>

      {tablesMissing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="font-semibold text-amber-800">Таблиця catalog_categories не існує</p>
          <p className="text-sm text-amber-700 mt-1">Запустіть міграції 037–040 у Supabase SQL Editor.</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <p className="font-semibold text-red-700">Помилка</p>
          <p className="text-sm text-red-600 font-mono mt-1">{errorMsg}</p>
        </div>
      )}

      {categories.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400">Назва</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 hidden sm:table-cell">Slug</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 hidden md:table-cell">Опис</th>
                  <th className="text-center px-5 py-2.5 text-xs font-medium text-gray-400">Статус</th>
                  <th className="px-5 py-2.5 w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => {
                  const pub = publishCategoryAction.bind(null, cat.id)
                  const unpub = unpublishCategoryAction.bind(null, cat.id)
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{cat.name_ua}</td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-500 hidden sm:table-cell">{cat.slug}</td>
                      <td className="px-5 py-3 text-xs text-gray-400 max-w-[200px] truncate hidden md:table-cell" title={cat.description ?? ''}>
                        {cat.description || '—'}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {cat.is_published ? 'Публічна' : 'Прихована'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {cat.is_published ? (
                          <form action={unpub}>
                            <button type="submit" className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">Сховати</button>
                          </form>
                        ) : (
                          <form action={pub}>
                            <button type="submit" className="text-xs text-green-700 hover:text-green-900 font-medium transition-colors">Опублікувати</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!tablesMissing && !errorMsg && categories.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
          <p className="text-gray-900 font-semibold mb-1">Категорій ще немає</p>
          <p className="text-sm text-gray-500 mb-4">Спочатку синхронізуйте категорії у Пайплайні (Кроки 1 → 3).</p>
          <Link href="/admin/catalog/pipeline" className="text-sm font-medium text-bark hover:underline">Відкрити Пайплайн →</Link>
        </div>
      )}
    </div>
  )
}
