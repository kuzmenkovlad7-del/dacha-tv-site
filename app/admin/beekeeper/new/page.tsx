export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { createBeekeeperProduct } from '../actions'

export const metadata: Metadata = {
  title: 'Адмін — Новий продукт для пасічників',
  robots: 'noindex, nofollow',
}

const PRODUCT_TYPES = [
  { value: 'bee_packages', label: 'Бджолопакети' },
  { value: 'bee_colonies', label: 'Бджолосімї' },
  { value: 'empty_hives', label: 'Порожні вулики' },
  { value: 'hives_with_bees', label: 'Вулики з бджолами' },
]

export default function AdminBeekeeperNewPage() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">Новий продукт для пасічників</h1>

      <form action={createBeekeeperProduct} className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Назва</label>
          <input name="name" type="text" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Slug (URL)</label>
          <input name="slug" type="text" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            placeholder="napryklad-bdzhylopakety" />
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
          <textarea name="description" rows={4}
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
          <label className="block text-sm font-semibold text-bark mb-1">Порядок відображення</label>
          <input name="display_order" type="number" defaultValue={10}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        {/* Media */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-bark">Медіа</h3>
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1">Головне зображення (URL або /images/...)</label>
            <input name="image_url" type="text"
              placeholder="https://example.com/image.jpg або /images/beekeeper/..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1">YouTube відео (URL)</label>
            <input name="youtube_url" type="text"
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1">Alt-текст зображення</label>
            <input name="image_alt" type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <button type="submit"
          className="w-full bg-bark text-white font-semibold py-3 px-6 rounded-lg hover:bg-bark-light transition-colors min-h-[48px]">
          Створити
        </button>
      </form>
    </div>
  )
}
