import type { Metadata } from 'next'
import { createHoneyProduct } from '../actions'

export const metadata: Metadata = {
  title: 'Адмін — Новий мед',
  robots: 'noindex, nofollow',
}

const VARIETIES = ['Акація', 'Липа', 'Сонях', "Різнотрав'я", 'Сади', 'Ліс']

export default function AdminHoneyNewPage() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">Новий продукт меду</h1>

      <form action={createHoneyProduct} encType="multipart/form-data" className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-bark mb-1">Назва</label>
          <input id="name" name="name" type="text" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-bark mb-1">Slug (URL)</label>
          <input id="slug" name="slug" type="text" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            placeholder="napryklad-akatsievyi-med" />
        </div>

        <div>
          <label htmlFor="variety" className="block text-sm font-semibold text-bark mb-1">Сорт</label>
          <select id="variety" name="variety" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400">
            {VARIETIES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-bark mb-1">Опис</label>
          <textarea id="description" name="description" rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="packaging" className="block text-sm font-semibold text-bark mb-1">Упаковка (через кому)</label>
          <input id="packaging" name="packaging" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            placeholder="1L пластик, 1L скло" />
        </div>

        <div>
          <label htmlFor="display_order" className="block text-sm font-semibold text-bark mb-1">Порядок відображення</label>
          <input id="display_order" name="display_order" type="number" defaultValue={10}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="youtube_video_link" className="block text-sm font-semibold text-bark mb-1">Посилання на YouTube відео</label>
          <input id="youtube_video_link" name="youtube_video_link" type="url"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="in_stock" defaultChecked className="w-4 h-4 accent-honey-600" />
            <span className="text-sm font-medium text-bark">В наявності</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" className="w-4 h-4 accent-honey-600" />
            <span className="text-sm font-medium text-bark">Популярний</span>
          </label>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-bark mb-1">Зображення</label>
          <input id="image" name="image" type="file" accept="image/*"
            className="w-full text-sm text-bark/70" />
        </div>

        <div>
          <label htmlFor="image_alt" className="block text-sm font-semibold text-bark mb-1">Alt-текст зображення</label>
          <input id="image_alt" name="image_alt" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <button type="submit"
          className="w-full bg-bark text-white font-semibold py-3 px-6 rounded-lg hover:bg-bark-light transition-colors min-h-[48px]">
          Створити
        </button>
      </form>
    </div>
  )
}
