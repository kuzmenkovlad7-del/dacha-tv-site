'use client'

import { useState, useTransition } from 'react'
import {
  importCategoriesFromSheetAction,
  importProductsFromSheetAction,
  publishCategoriesAction,
  publishProductsAction,
  type SheetImportResult,
} from './actions'
import type { PipelineStats } from '@/lib/catalog/pipeline'

// ─── UI atoms ────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 inline mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function Banner({ ok, message }: { ok: boolean; message: string }) {
  return (
    <div className={`mt-3 text-sm px-3 py-2 rounded-lg flex items-start gap-2 ${ok ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
      <span className="flex-shrink-0 font-bold">{ok ? '✓' : '✗'}</span>
      <span>{message}</span>
    </div>
  )
}

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400'
const BTN = 'inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({
  number, title, description, children, result,
}: {
  number: number
  title: string
  description: string
  children: React.ReactNode
  result: { ok: boolean; message: string } | null
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-bark text-white text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-bark text-sm">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">{description}</p>
          {children}
          {result && <Banner ok={result.ok} message={result.message} />}
        </div>
      </div>
    </div>
  )
}

// ─── Batch size selector ──────────────────────────────────────────────────────

const BATCH_SIZES = [100, 300, 500] as const
type BatchSize = (typeof BATCH_SIZES)[number]

// ─── Main component ───────────────────────────────────────────────────────────

export function PipelineClient({ initialStats }: { initialStats: PipelineStats }) {
  const stats = initialStats

  const [catSheetUrl, setCatSheetUrl] = useState('')
  const [prodSheetUrl, setProdSheetUrl] = useState('')
  const [batchSize, setBatchSize] = useState<BatchSize>(300)

  const [catImportResult, setCatImportResult] = useState<SheetImportResult | null>(null)
  const [prodImportResult, setProdImportResult] = useState<SheetImportResult | null>(null)
  const [pubCatsResult, setPubCatsResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [pubProdsResult, setPubProdsResult] = useState<{ ok: boolean; message: string } | null>(null)

  const [catImportPending, startCatImport] = useTransition()
  const [prodImportPending, startProdImport] = useTransition()
  const [pubCatsPending, startPubCats] = useTransition()
  const [pubProdsPending, startPubProds] = useTransition()

  const anyPending = catImportPending || prodImportPending || pubCatsPending || pubProdsPending

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
        {[
          { label: 'Категорій (опубл.)', value: `${stats.catalogCategories} (${stats.catalogCategoriesPublished})` },
          { label: 'Товарів усього', value: stats.catalogProducts.toLocaleString('uk-UA') },
          { label: 'Draft / Опубліковано', value: `${stats.catalogProductsDraft} / ${stats.catalogProductsPublished}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-honey-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-bark">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Import categories from sheet */}
      <StepCard
        number={1}
        title="Категорії з таблиці"
        description="Вставте посилання на таблицю з двома колонками: Category | Description. Нові категорії додаються, існуючі — доповнюються описом."
        result={catImportResult ? { ok: catImportResult.ok, message: catImportResult.message } : null}
      >
        <div className="flex gap-2">
          <input
            value={catSheetUrl}
            onChange={(e) => setCatSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/…"
            className={INPUT}
            disabled={anyPending}
          />
          <button
            disabled={anyPending || !catSheetUrl.trim()}
            onClick={() => startCatImport(async () => setCatImportResult(await importCategoriesFromSheetAction(catSheetUrl)))}
            className={`${BTN} bg-bark text-white hover:bg-bark/90 whitespace-nowrap`}
          >
            {catImportPending && <Spinner />}
            {catImportPending ? 'Імпорт…' : 'Імпортувати'}
          </button>
        </div>
      </StepCard>

      {/* Step 2: Import products from sheet */}
      <StepCard
        number={2}
        title="Товари з таблиці"
        description="Вставте посилання на прайс (ID · Name · SKU · Price · Categories · Stock · Images · Description · Meta Title · Meta Description · Meta Keywords). Нові — status=draft. Існуючі (за SKU) не перезаписуються."
        result={prodImportResult ? { ok: prodImportResult.ok, message: prodImportResult.message } : null}
      >
        <div className="space-y-2">
          <input
            value={prodSheetUrl}
            onChange={(e) => setProdSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/…"
            className={INPUT}
            disabled={anyPending}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Пакет:</span>
            {BATCH_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setBatchSize(s)}
                disabled={anyPending}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  batchSize === s ? 'bg-bark text-white border-bark' : 'border-gray-300 text-gray-600 hover:border-bark'
                }`}
              >
                {s}
              </button>
            ))}
            <button
              disabled={anyPending || !prodSheetUrl.trim()}
              onClick={() => startProdImport(async () => setProdImportResult(await importProductsFromSheetAction(prodSheetUrl, batchSize)))}
              className={`${BTN} bg-bark text-white hover:bg-bark/90`}
            >
              {prodImportPending && <Spinner />}
              {prodImportPending ? 'Імпорт…' : `Імпортувати ${batchSize} товарів`}
            </button>
          </div>
          {stats.catalogProductsDraft > 0 && (
            <p className="text-xs text-amber-600">
              {stats.catalogProductsDraft} товарів у статусі draft (не видно публічно). Запустіть Крок 4 щоб опублікувати.
            </p>
          )}
        </div>
      </StepCard>

      {/* Step 3: Publish categories */}
      <StepCard
        number={3}
        title="Опублікувати категорії"
        description={`${stats.catalogCategories - stats.catalogCategoriesPublished} категорій ще не видно публічно. Натисніть щоб увімкнути всі.`}
        result={pubCatsResult}
      >
        <button
          disabled={anyPending || stats.catalogCategories === 0}
          onClick={() => startPubCats(async () => {
            const r = await publishCategoriesAction()
            setPubCatsResult({ ok: r.ok, message: r.message })
          })}
          className={`${BTN} bg-green-700 text-white hover:bg-green-800`}
        >
          {pubCatsPending && <Spinner />}
          {pubCatsPending ? 'Публікую…' : `Опублікувати всі категорії (${stats.catalogCategories})`}
        </button>
      </StepCard>

      {/* Step 4: Publish products */}
      <StepCard
        number={4}
        title="Опублікувати товари"
        description={`${stats.catalogProductsDraft} товарів у статусі draft — не видно на сайті. Натисніть щоб опублікувати всі.`}
        result={pubProdsResult}
      >
        <button
          disabled={anyPending || stats.catalogProductsDraft === 0}
          onClick={() => startPubProds(async () => {
            const r = await publishProductsAction()
            setPubProdsResult({ ok: r.ok, message: r.message })
          })}
          className={`${BTN} bg-green-700 text-white hover:bg-green-800`}
        >
          {pubProdsPending && <Spinner />}
          {pubProdsPending ? 'Публікую…' : `Опублікувати ${stats.catalogProductsDraft} товарів`}
        </button>
      </StepCard>

      <div className="text-xs text-gray-400 space-y-0.5 pt-2">
        <p>• Крок 2 можна запускати кілька разів — кожен запуск обробляє наступний пакет.</p>
        <p>• SEO-поля існуючих товарів не перезаписуються при повторному імпорті.</p>
        <p>• Таблиці мають бути публічними для читання (Поділитися → «Будь-хто з посиланням»).</p>
      </div>
    </div>
  )
}
