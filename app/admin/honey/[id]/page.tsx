export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHoneyProductBySlug, getAllHoneyProducts } from '@/lib/supabase/queries'
import { getAdminClient } from '@/lib/supabase/admin'
import { updateHoneyProduct, deleteHoneyProduct } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Адмін — Редагувати мед',
  robots: 'noindex, nofollow',
}

const VARIETIES = ['Акація', 'Липа', 'Сонях', "Різнотрав'я", 'Сади', 'Ліс']

export default async function AdminHoneyEditPage({ params }: Props) {
  const { id } = await params
  const client = getAdminClient()
  const { data: product } = await client.from('honey_products').select('*').eq('id', id).single()

  if (!product) notFound()

  const updateWithId = updateHoneyProduct.bind(null, id)
  const deleteWithId = deleteHoneyProduct.bind(null, id)

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">Редагувати: {product.name}</h1>

      <form action={updateWithId} encType="multipart/form-data" className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-bark mb-1">Назва</label>
          <input id="name" name="name" type="text" required defaultValue={product.name}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-bark mb-1">Slug (URL)</label>
          <input id="slug" name="slug" type="text" required defaultValue={product.slug}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="variety" className="block text-sm font-semibold text-bark mb-1">Сорт</label>
          <select id="variety" name="variety" required defaultValue={product.variety}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400">
            {VARIETIES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-bark mb-1">Опис</label>
          <textarea id="description" name="description" rows={4} defaultValue={product.description ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="packaging" className="block text-sm font-semibold text-bark mb-1">Упаковка (через кому)</label>
          <input id="packaging" name="packaging" type="text" defaultValue={product.packaging?.join(', ') ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            placeholder="1L пластик, 1L скло" />
        </div>

        <div>
          <label htmlFor="display_order" className="block text-sm font-semibold text-bark mb-1">Порядок відображення</label>
          <input id="display_order" name="display_order" type="number" defaultValue={product.display_order}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div>
          <label htmlFor="youtube_video_link" className="block text-sm font-semibold text-bark mb-1">Посилання на YouTube відео</label>
          <input id="youtube_video_link" name="youtube_video_link" type="url" defaultValue={product.youtube_video_link ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="in_stock" defaultChecked={product.in_stock} className="w-4 h-4 accent-honey-600" />
            <span className="text-sm font-medium text-bark">В наявності</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} className="w-4 h-4 accent-honey-600" />
            <span className="text-sm font-medium text-bark">Популярний</span>
          </label>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-bark mb-1">Зображення (залиште порожнім щоб не змінювати)</label>
          {product.image_url && (
            <p className="text-xs text-gray-500 mb-1">Поточне: <a href={product.image_url} target="_blank" rel="noopener" className="underline">{product.image_url}</a></p>
          )}
          <input id="image" name="image" type="file" accept="image/*"
            className="w-full text-sm text-bark/70" />
        </div>

        <div>
          <label htmlFor="image_alt" className="block text-sm font-semibold text-bark mb-1">Alt-текст зображення</label>
          <input id="image_alt" name="image_alt" type="text" defaultValue={product.image_alt ?? ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400" />
        </div>

        <button type="submit"
          className="w-full bg-bark text-white font-semibold py-3 px-6 rounded-lg hover:bg-bark-light transition-colors min-h-[48px]">
          Зберегти
        </button>
      </form>

      <form action={deleteWithId} className="mt-4">
        <button type="submit"
          className="w-full bg-red-50 text-red-700 border border-red-200 font-semibold py-3 px-6 rounded-lg hover:bg-red-100 transition-colors min-h-[48px] text-sm"
          onClick={(e) => { if (!confirm('Видалити цей продукт?')) e.preventDefault() }}>
          Видалити продукт
        </button>
      </form>
    </div>
  )
}
