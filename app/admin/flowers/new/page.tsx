export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { createFlowerProduct } from '../actions'

export const metadata: Metadata = {
  title: 'Адмін — Нова квітка',
  robots: 'noindex, nofollow',
}

export default function AdminFlowersNewPage() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">Нова квітка</h1>

      <form action={createFlowerProduct} encType="multipart/form-data" className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Назва</label>
            <input name="name" type="text" required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Slug (URL)</label>
            <input name="slug" type="text" required
              placeholder="chrysanthemum-bronze-autumn"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Категорія</label>
            <select name="category"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400">
              <option value="chrysanthemum">Хризантема</option>
              <option value="other">Інше</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Сорт</label>
            <input name="variety" type="text"
              placeholder="Помпонова, Кущова..."
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Короткий опис</label>
          <textarea name="short_description" rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Повний опис</label>
          <textarea name="full_description" rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Колір</label>
            <input name="color" type="text" placeholder="Бронзово-помаранчевий"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Сезон цвітіння</label>
            <input name="bloom_season" type="text" placeholder="Вересень — жовтень"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Висота (см)</label>
            <input name="height_cm" type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Ціна (грн)</label>
            <input name="price_uah" type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Порядок</label>
            <input name="display_order" type="number" defaultValue={10}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Освітлення</label>
          <input name="lighting" type="text" placeholder="Повне сонце / Напівтінь"
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">YouTube відео</label>
          <input name="youtube_video_url" type="url"
            placeholder="https://youtube.com/watch?v=..."
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input type="checkbox" name="in_stock" defaultChecked className="w-5 h-5 accent-honey-600" />
            <span className="text-base font-medium text-bark">В наявності</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input type="checkbox" name="is_featured" className="w-5 h-5 accent-honey-600" />
            <span className="text-base font-medium text-bark">Популярна</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Зображення</label>
          <input name="image" type="file" accept="image/*"
            className="w-full text-sm text-bark/70 mb-2" />
          <p className="text-xs text-bark/40 mb-1">Або вкажіть шлях до файлу з папки public:</p>
          <input name="image_path" type="text"
            placeholder="/images/dacha-tv/flowers/назва-файлу.jpg"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Alt-текст зображення</label>
          <input name="image_alt" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <button type="submit"
          className="w-full bg-bark text-white font-semibold py-4 px-6 rounded-xl hover:bg-bark-light transition-colors min-h-[52px] text-base">
          Створити квітку
        </button>
      </form>
    </div>
  )
}
