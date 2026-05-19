'use client'

import { useState, useTransition } from 'react'
import {
  syncCategoriesAction,
  importProductsAction,
  publishCategoriesAction,
  publishProductsAction,
} from './actions'
import type { PipelineStats } from '@/lib/catalog/pipeline'

interface ResultBanner {
  ok: boolean
  message: string
}

function Banner({ result }: { result: ResultBanner }) {
  return (
    <div className={`mt-2 text-sm px-3 py-2 rounded-lg ${result.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
      {result.ok ? '✓' : '✗'} {result.message}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 inline mr-1.5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

interface StepCardProps {
  number: number
  title: string
  description: string
  stat?: React.ReactNode
  action: React.ReactNode
  result: ResultBanner | null
}

function StepCard({ number, title, description, stat, action, result }: StepCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-bark text-white text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-bark text-sm">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          {stat && <div className="mt-1">{stat}</div>}
          <div className="mt-3">{action}</div>
          {result && <Banner result={result} />}
        </div>
      </div>
    </div>
  )
}

const BATCH_SIZES = [100, 300, 500, 1000] as const
type BatchSize = (typeof BATCH_SIZES)[number]

interface Props {
  initialStats: PipelineStats
}

export function PipelineClient({ initialStats }: Props) {
  const stats = initialStats

  const [syncCatsResult, setSyncCatsResult] = useState<ResultBanner | null>(null)
  const [importResult, setImportResult] = useState<ResultBanner | null>(null)
  const [pubCatsResult, setPubCatsResult] = useState<ResultBanner | null>(null)
  const [pubProdsResult, setPubProdsResult] = useState<ResultBanner | null>(null)
  const [batchSize, setBatchSize] = useState<BatchSize>(300)

  const [syncCatsPending, startSyncCats] = useTransition()
  const [importPending, startImport] = useTransition()
  const [pubCatsPending, startPubCats] = useTransition()
  const [pubProdsPending, startPubProds] = useTransition()

  const anyPending = syncCatsPending || importPending || pubCatsPending || pubProdsPending

  return (
    <div className="space-y-4">
      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Категорії постачальника', value: stats.supplierCategories },
          { label: 'Категорії каталогу', value: stats.catalogCategories },
          { label: 'Опубліковано категорій', value: stats.catalogCategoriesPublished },
          { label: 'Товари до імпорту', value: stats.supplierProductsEligible },
          { label: 'Товари каталогу', value: stats.catalogProducts },
          { label: 'Опубліковано товарів', value: stats.catalogProductsPublished },
        ].map(({ label, value }) => (
          <div key={label} className="bg-honey-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-bark">{value.toLocaleString('uk-UA')}</div>
            <div className="text-xs text-gray-600 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Sync categories */}
      <StepCard
        number={1}
        title="Синхронізація категорій"
        description="Створює нові catalog_categories з supplier_categories. Наявні не змінюються (SEO-поля збережені)."
        stat={
          <span className="text-xs text-gray-500">
            {stats.supplierCategories} постачальник → {stats.catalogCategories} каталог
          </span>
        }
        result={syncCatsResult}
        action={
          <button
            disabled={anyPending}
            onClick={() => startSyncCats(async () => {
              const r = await syncCategoriesAction()
              setSyncCatsResult({ ok: r.ok, message: r.message })
            })}
            className="px-4 py-2 text-sm font-semibold bg-bark text-white rounded-full disabled:opacity-50 hover:bg-bark/90 transition-colors"
          >
            {syncCatsPending && <Spinner />}
            {syncCatsPending ? 'Синхронізую…' : 'Синхронізувати категорії'}
          </button>
        }
      />

      {/* Step 2: Import products */}
      <StepCard
        number={2}
        title="Імпорт товарів у каталог"
        description="Переміщує товари постачальника в catalog_products. Існуючі (за SKU) не перезаписуються. Запускайте кілька разів для великих обсягів."
        stat={
          <span className="text-xs text-gray-500">
            Залишилось до імпорту: {stats.supplierProductsEligible.toLocaleString('uk-UA')}
          </span>
        }
        result={importResult}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Пакет:</span>
              {BATCH_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setBatchSize(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    batchSize === s
                      ? 'bg-bark text-white border-bark'
                      : 'border-gray-300 text-gray-600 hover:border-bark'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              disabled={anyPending || stats.supplierProductsEligible === 0}
              onClick={() => startImport(async () => {
                const r = await importProductsAction(batchSize)
                setImportResult({ ok: r.ok, message: r.message })
              })}
              className="px-4 py-2 text-sm font-semibold bg-bark text-white rounded-full disabled:opacity-50 hover:bg-bark/90 transition-colors"
            >
              {importPending && <Spinner />}
              {importPending ? 'Імпортую…' : `Імпортувати ${batchSize}`}
            </button>
          </div>
        }
      />

      {/* Step 3: Publish categories */}
      <StepCard
        number={3}
        title="Опублікувати категорії"
        description="Встановлює is_published=true для всіх категорій каталогу. Категорії стають видимими на сайті."
        stat={
          <span className="text-xs text-gray-500">
            {stats.catalogCategories - stats.catalogCategoriesPublished} неопублікованих
          </span>
        }
        result={pubCatsResult}
        action={
          <button
            disabled={anyPending || stats.catalogCategories === 0}
            onClick={() => startPubCats(async () => {
              const r = await publishCategoriesAction()
              setPubCatsResult({ ok: r.ok, message: r.message })
            })}
            className="px-4 py-2 text-sm font-semibold bg-green-700 text-white rounded-full disabled:opacity-50 hover:bg-green-800 transition-colors"
          >
            {pubCatsPending && <Spinner />}
            {pubCatsPending ? 'Публікую…' : 'Опублікувати всі категорії'}
          </button>
        }
      />

      {/* Step 4: Publish products */}
      <StepCard
        number={4}
        title="Опублікувати товари"
        description="Встановлює status=published для всіх draft-товарів каталогу. Товари стають видимими на сайті."
        stat={
          <span className="text-xs text-gray-500">
            {stats.catalogProducts - stats.catalogProductsPublished} неопублікованих
          </span>
        }
        result={pubProdsResult}
        action={
          <button
            disabled={anyPending || stats.catalogProducts === 0}
            onClick={() => startPubProds(async () => {
              const r = await publishProductsAction()
              setPubProdsResult({ ok: r.ok, message: r.message })
            })}
            className="px-4 py-2 text-sm font-semibold bg-green-700 text-white rounded-full disabled:opacity-50 hover:bg-green-800 transition-colors"
          >
            {pubProdsPending && <Spinner />}
            {pubProdsPending ? 'Публікую…' : 'Опублікувати всі товари'}
          </button>
        }
      />
    </div>
  )
}
