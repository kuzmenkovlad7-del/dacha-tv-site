export const dynamic = 'force-dynamic'

import { getPipelineStats } from '@/lib/catalog/pipeline'
import { PipelineClient } from './PipelineClient'

export default async function PipelinePage() {
  let stats
  try {
    stats = await getPipelineStats()
  } catch {
    stats = {
      supplierCategories: 0,
      catalogCategories: 0,
      catalogCategoriesPublished: 0,
      supplierProductsEligible: 0,
      catalogProducts: 0,
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

      <div className="mt-8 text-xs text-gray-400 space-y-1">
        <p>• Крок 2 можна запускати кілька разів — кожен пакет обробляє нові товари.</p>
        <p>• Імпортовані товари залишаються у статусі &quot;draft&quot; до кроку 4.</p>
        <p>• SEO-поля існуючих товарів не перезаписуються при повторному імпорті.</p>
      </div>
    </div>
  )
}
