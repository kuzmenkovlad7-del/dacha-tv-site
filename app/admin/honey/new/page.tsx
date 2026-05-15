export const dynamic = 'force-dynamic'
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

      <form action={createHoneyProduct} className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
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
          <label htmlFor="short_description" className="block text-sm font-semibold text-bark mb-1">Короткий опис</label>
          <textarea id="short_description" name="short_description" rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-bark mb-1">Опис</label>
          <textarea id="description" name="description" rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="aroma_notes" className="block text-sm font-semibold text-bark mb-1">Аромат</label>
          <input id="aroma_notes" name="aroma_notes" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="taste_notes" className="block text-sm font-semibold text-bark mb-1">Смак</label>
          <input id="taste_notes" name="taste_notes" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="color_note" className="block text-sm font-semibold text-bark mb-1">Колір</label>
          <input id="color_note" name="color_note" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="crystallization_note" className="block text-sm font-semibold text-bark mb-1">Кристалізація</label>
          <input id="crystallization_note" name="crystallization_note" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="recommended_use" className="block text-sm font-semibold text-bark mb-1">Рекомендовано для</label>
          <input id="recommended_use" name="recommended_use" type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price_plastic_uah" className="block text-sm font-semibold text-bark mb-1">Ціна пластик (грн)</label>
            <input id="price_plastic_uah" name="price_plastic_uah" type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label htmlFor="price_glass_uah" className="block text-sm font-semibold text-bark mb-1">Ціна скло (грн)</label>
            <input id="price_glass_uah" name="price_glass_uah" type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
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

        {/* Media */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-bark">Медіа</h3>
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1">Головне зображення (URL або /images/...)</label>
            <input name="image_url" type="text"
              placeholder="https://example.com/image.jpg або /images/honey/acacia.jpg"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-bark/70 mb-1">YouTube відео (URL)</label>
            <input name="youtube_video_link" type="text"
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
