export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAdminClient } from '@/lib/supabase/admin'
import { updateFlowerProduct, deleteFlowerProduct } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Адмін — Редагувати квітку',
  robots: 'noindex, nofollow',
}

export default async function AdminFlowerEditPage({ params }: Props) {
  const { id } = await params
  const client = getAdminClient()
  const { data: product } = await client.from('flower_products').select('*').eq('id', id).single()

  if (!product) notFound()

  const updateWithId = updateFlowerProduct.bind(null, id)
  const deleteWithId = deleteFlowerProduct.bind(null, id)

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">
        Редагувати: {product.name}
      </h1>

      <form action={updateWithId} className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Назва</label>
            <input name="name" type="text" required defaultValue={product.name}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Slug (URL)</label>
            <input name="slug" type="text" required defaultValue={product.slug}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Категорія</label>
            <select name="category" defaultValue={product.category}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400">
              <option value="chrysanthemum">Хризантема</option>
              <option value="other">Інше</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Сорт</label>
            <input name="variety" type="text" defaultValue={product.variety ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Короткий опис</label>
          <textarea name="short_description" rows={2} defaultValue={product.short_description ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Повний опис</label>
          <textarea name="full_description" rows={4} defaultValue={product.full_description ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Колір</label>
            <input name="color" type="text" defaultValue={product.color ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Сезон цвітіння</label>
            <input name="bloom_season" type="text" defaultValue={product.bloom_season ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Висота (см)</label>
            <input name="height_cm" type="number" defaultValue={product.height_cm ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Ціна (грн)</label>
            <input name="price_uah" type="number" defaultValue={product.price_uah ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Порядок</label>
            <input name="display_order" type="number" defaultValue={product.display_order}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Освітлення</label>
          <input name="lighting" type="text" defaultValue={product.lighting ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">YouTube відео</label>
          <input name="youtube_video_url" type="url" defaultValue={product.youtube_video_url ?? ''}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input type="checkbox" name="in_stock" defaultChecked={product.in_stock} className="w-5 h-5 accent-honey-600" />
            <span className="text-base font-medium text-bark">В наявності</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} className="w-5 h-5 accent-honey-600" />
            <span className="text-base font-medium text-bark">Популярна</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Зображення (URL або шлях)</label>
          <input name="image_url" type="text" defaultValue={product.image_url ?? ''}
            placeholder="https://... або /images/dacha-tv/flowers/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Alt-текст зображення</label>
          <input name="image_alt" type="text" defaultValue={product.image_alt ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <button type="submit"
          className="w-full bg-bark text-white font-semibold py-4 px-6 rounded-xl hover:bg-bark-light transition-colors min-h-[52px] text-base">
          Зберегти зміни
        </button>
      </form>

      <form action={deleteWithId} className="mt-4">
        <button type="submit"
          className="w-full bg-red-50 text-red-700 border border-red-200 font-semibold py-4 px-6 rounded-xl hover:bg-red-100 transition-colors min-h-[52px] text-sm"
          onClick={(e) => { if (!confirm('Видалити цю квітку?')) e.preventDefault() }}>
          Видалити квітку
        </button>
      </form>
    </div>
  )
}
