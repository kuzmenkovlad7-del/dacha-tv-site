export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAdminClient } from '@/lib/supabase/admin'
import { updateBeekeeperProduct, deleteBeekeeperProduct } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Адмін — Редагувати продукт',
  robots: 'noindex, nofollow',
}

const PRODUCT_TYPES = [
  { value: 'bee_packages', label: 'Бджолопакети' },
  { value: 'bee_colonies', label: 'Бджолосімї' },
  { value: 'empty_hives', label: 'Порожні вулики' },
  { value: 'hives_with_bees', label: 'Вулики з бджолами' },
]

export default async function AdminBeekeeperEditPage({ params }: Props) {
  const { id } = await params
  const client = getAdminClient()
  const { data: product } = await client.from('beekeeper_products').select('*').eq('id', id).single()

  if (!product) notFound()

  const updateWithId = updateBeekeeperProduct.bind(null, id)
  const deleteWithId = deleteBeekeeperProduct.bind(null, id)

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">Редагувати: {product.name}</h1>

      <form action={updateWithId} encType="multipart/form-data" className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Назва</label>
          <input name="name" type="text" required defaultValue={product.name}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Slug</label>
          <input name="slug" type="text" required defaultValue={product.slug}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Тип продукту</label>
          <select name="product_type" required defaultValue={product.product_type}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400">
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Опис</label>
          <textarea name="description" rows={4} defaultValue={product.description ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Породи (через кому)</label>
          <input name="breeds" type="text" defaultValue={product.breeds?.join(', ') ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Примітка про сезон</label>
          <input name="season_note" type="text" defaultValue={product.season_note ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Порядок відображення</label>
          <input name="display_order" type="number" defaultValue={product.display_order}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Зображення (залиште порожнім щоб не змінювати)</label>
          {product.image_url && (
            <p className="text-xs text-gray-500 mb-1">Поточне: <a href={product.image_url} target="_blank" rel="noopener" className="underline">{product.image_url}</a></p>
          )}
          <input name="image" type="file" accept="image/*" className="w-full text-sm text-bark/70" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-bark mb-1">Alt-текст зображення</label>
          <input name="image_alt" type="text" defaultValue={product.image_alt ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <button type="submit"
          className="w-full bg-bark text-white font-semibold py-3 px-6 rounded-lg hover:bg-bark-light transition-colors min-h-[48px]">
          Зберегти
        </button>
      </form>

      <form action={deleteWithId} className="mt-4">
        <button type="submit"
          className="w-full bg-red-50 text-red-700 border border-red-200 font-semibold py-3 px-6 rounded-lg hover:bg-red-100 transition-colors min-h-[48px] text-sm">
          Видалити продукт
        </button>
      </form>
    </div>
  )
}
