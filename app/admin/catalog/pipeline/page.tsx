export const dynamic = 'force-dynamic'

import { getPipelineStats } from '@/lib/catalog/pipeline'
import { PipelineClient } from './PipelineClient'

export default async function PipelinePage() {
  let stats
  try {
    stats = await getPipelineStats()
  } catch {
    stats = {
      catalogCategories: 0,
      catalogCategoriesPublished: 0,
      catalogProducts: 0,
      catalogProductsDraft: 0,
      catalogProductsPublished: 0,
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-bark font-serif">Пайплайн публікації</h1>
        <p className="text-sm text-gray-500 mt-1">
          Запускайте кроки по черзі зверху вниз. Кожен крок ідемпотентний — безпечно повторювати.
        </p>
      </div>

      <PipelineClient initialStats={stats} />

    </div>
  )
}
