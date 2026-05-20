export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getPipelineStats } from '@/lib/catalog/pipeline'
import { PipelineClient } from './PipelineClient'

export const metadata: Metadata = { title: 'Адмін — Пайплайн', robots: 'noindex, nofollow' }

export default async function PipelinePage() {
  let stats
  try {
    stats = await getPipelineStats()
  } catch {
    stats = {
      supplierCategories: 0,
      supplierProductsNew: 0,
      catalogCategories: 0,
      catalogCategoriesPublished: 0,
      catalogProducts: 0,
      catalogProductsDraft: 0,
      catalogProductsPublished: 0,
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-bark font-serif">Пайплайн публікації</h1>
        <p className="text-xs text-gray-500 mt-1">
          Кроки 1–2: синхронізація з API. Кроки 3–6: збірка каталогу. Кроки 7–8: публікація.
          Кожен крок ідемпотентний — безпечно повторювати.
        </p>
      </div>
      <PipelineClient initialStats={stats} />
    </div>
  )
}
