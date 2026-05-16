export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { getProductMedia } from '@/lib/supabase/product-media'
import { MediaManager } from '@/components/admin/MediaManager'
import { updateBeekeeperProduct, deleteBeekeeperProduct } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Адмін — Редагувати продукт',
  robots: 'noindex, nofollow',
}

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
const LABEL = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

const PRODUCT_TYPES = [
  { value: 'bee_packages', label: 'Бджолопакети' },
  { value: 'bee_colonies', label: 'Бджолосімї' },
  { value: 'empty_hives', label: 'Порожні вулики' },
  { value: 'hives_with_bees', label: 'Вулики з бджолами' },
  { value: 'apiary_supply', label: 'Товар пасічника' },
]

export default async function AdminBeekeeperEditPage({ params }: Props) {
  const { id } = await params

  let product: Record<string, unknown> | null = null
  let loadError: string | null = null
  let productMedia: Awaited<ReturnType<typeof getProductMedia>> = []

  try {
    const client = getAdminClient()
    const { data, error } = await client.from('beekeeper_products').select('*').eq('id', id).single()
    if (error) loadError = error.message
    else {
      product = data as Record<string, unknown>
      productMedia = await getProductMedia('beekeeper', id, client).catch(() => [])
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : 'Помилка підключення'
  }

  if (!loadError && !product) notFound()

  if (loadError) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-2xl">
        <Link href="/admin/beekeeper" className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">← Назад</Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="font-semibold text-red-700">Помилка завантаження</p>
          <p className="text-sm text-red-600 mt-1 font-mono">{loadError}</p>
        </div>
      </div>
    )
  }

  const p = product!
  const updateWithId = updateBeekeeperProduct.bind(null, id)
  const deleteWithId = deleteBeekeeperProduct.bind(null, id)

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/beekeeper" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Пасічникам</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700 font-medium truncate">{String(p.name)}</span>
      </div>

      <form action={updateWithId} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-5">
        <h1 className="text-base font-semibold text-gray-900">Редагувати продукт</h1>

        <div>
          <label className={LABEL}>Назва</label>
          <input name="name" type="text" required defaultValue={String(p.name ?? '')} className={INPUT} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Породи (через кому)</label>
            <input name="breeds" type="text" defaultValue={Array.isArray(p.breeds) ? (p.breeds as string[]).join(', ') : String(p.breeds ?? '')} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Примітка про сезон</label>
            <input name="season_note" type="text" defaultValue={String(p.season_note ?? '')} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Статус</label>
          <select name="status" defaultValue={String(p.status ?? 'available')} className={INPUT}>
            <option value="available">В наявності</option>
            <option value="preorder">Передзамовлення</option>
            <option value="out_of_stock">Немає в наявності</option>
            <option value="archived">Архів</option>
          </select>
        </div>

        <MediaManager initialMedia={productMedia} productName={String(p.name ?? '')} />

        <details className="border border-gray-100 rounded-lg">
          <summary className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none list-none flex items-center gap-2">
            <span>▸</span> Додатково
          </summary>
          <div className="px-4 pb-4 pt-2 space-y-4">
            <div>
              <label className={LABEL}>Slug (URL)</label>
              <input name="slug" type="text" required defaultValue={String(p.slug ?? '')} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Тип продукту</label>
              <select name="product_type" defaultValue={String(p.product_type ?? '')} className={INPUT}>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Опис</label>
              <textarea name="description" rows={3} defaultValue={String(p.description ?? '')} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Повний опис</label>
              <textarea name="full_description" rows={4} defaultValue={String(p.full_description ?? '')} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Порядок відображення</label>
              <input name="display_order" type="number" defaultValue={String(p.display_order ?? 10)} className={INPUT} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" defaultChecked={Boolean(p.is_featured)} className="w-4 h-4 rounded accent-gray-900" />
              <span className="text-sm font-medium text-gray-700">Топ-продукт</span>
            </label>
          </div>
        </details>

        <button type="submit"
          className="w-full h-11 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Зберегти зміни
        </button>
      </form>

      <form action={deleteWithId} className="mt-3">
        <button type="submit"
          className="w-full h-10 bg-white text-red-600 border border-red-200 font-medium rounded-lg hover:bg-red-50 transition-colors text-sm">
          Видалити продукт
        </button>
      </form>
    </div>
  )
}
