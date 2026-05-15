export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAdminClient } from '@/lib/supabase/admin'
import { updateApiaryProduct, deleteApiaryProduct } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Адмін — Редагувати продукт пасіки',
  robots: 'noindex, nofollow',
}

export default async function AdminApiaryEditPage({ params }: Props) {
  const { id } = await params
  const client = getAdminClient()
  const { data: product } = await client.from('apiary_products').select('*').eq('id', id).single()

  if (!product) notFound()

  const updateWithId = updateApiaryProduct.bind(null, id)
  const deleteWithId = deleteApiaryProduct.bind(null, id)

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

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Опис (короткий)</label>
          <textarea name="description" rows={2} defaultValue={product.description ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Склад</label>
          <textarea name="composition" rows={2} defaultValue={product.composition ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Застосування</label>
          <textarea name="usage_notes" rows={2} defaultValue={product.usage_notes ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Зберігання</label>
          <textarea name="storage_info" rows={2} defaultValue={product.storage_info ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Упаковка (через кому)</label>
            <input name="packaging" type="text" defaultValue={product.packaging?.join(', ') ?? ''}
              placeholder="35 г, 70 г"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Ціна (грн)</label>
            <input name="price_uah" type="number" defaultValue={product.price_uah ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Порядок відображення</label>
            <input name="display_order" type="number" defaultValue={product.display_order}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bark mb-1">Вага (г)</label>
            <input name="weight_g" type="number" defaultValue={product.weight_g ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-honey-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">YouTube відео (посилання)</label>
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
            <span className="text-base font-medium text-bark">Популярний</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Зображення (URL або шлях)</label>
          <input name="image_url" type="text" defaultValue={product.image_url ?? ''}
            placeholder="https://... або /images/dacha-tv/products/..."
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
          onClick={(e) => { if (!confirm('Видалити цей продукт?')) e.preventDefault() }}>
          Видалити продукт
        </button>
      </form>
    </div>
  )
}
