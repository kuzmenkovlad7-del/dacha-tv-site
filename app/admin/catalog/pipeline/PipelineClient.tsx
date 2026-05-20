'use client'

import { useState, useTransition, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  syncApiCategoriesAction,
  syncApiProductsAction,
  syncCatalogCategoriesAction,
  applyCategorySeoAction,
  syncProductsToCatalogAction,
  applyProductSeoAction,
  publishCategoriesAction,
  publishProductsAction,
} from './actions'
import type { PipelineStats } from '@/lib/catalog/pipeline'

// ─── Persisted state helpers ─────────────────────────────────────────────────

function useLocalStorage(key: string, initial = '') {
  const [val, setVal] = useState(initial)
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    try {
      const stored = localStorage.getItem(key)
      if (stored) setVal(stored)
    } catch { /* SSR */ }
  }, [key])
  const set = useCallback((v: string) => {
    setVal(v)
    try { localStorage.setItem(key, v) } catch { /* SSR */ }
  }, [key])
  return [val, set] as const
}

function usePersistedResult(key: string) {
  const [result, setResultState] = useState<StepResult | null>(null)
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    try {
      const raw = localStorage.getItem(key)
      if (raw) setResultState(JSON.parse(raw) as StepResult)
    } catch { /* ignore */ }
  }, [key])
  const set = useCallback((r: StepResult) => {
    setResultState(r)
    try { localStorage.setItem(key, JSON.stringify(r)) } catch { /* ignore */ }
  }, [key])
  return [result, set] as const
}

// ─── UI atoms ────────────────────────────────────────────────────────────────

interface StepResult { ok: boolean; message: string }

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 inline mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function Banner({ result }: { result: StepResult }) {
  return (
    <div className={`mt-2 text-xs px-3 py-2 rounded-lg border ${
      result.ok ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-700'
    }`}>
      {result.ok ? '✓ ' : '✗ '}{result.message}
    </div>
  )
}

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-400'
const BTN_API = 'inline-flex items-center px-4 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const BTN_SEO = 'inline-flex items-center px-4 py-1.5 text-xs font-semibold bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
const BTN_PUB = 'inline-flex items-center px-4 py-1.5 text-xs font-semibold bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

const BATCH_SIZES = [100, 300, 500, 1000] as const
type BatchSize = (typeof BATCH_SIZES)[number]

interface StepCardProps {
  number: number
  title: string
  badge?: string
  description: string
  running: boolean
  result: StepResult | null
  children: React.ReactNode
}

function StepCard({ number, title, badge, description, running, result, children }: StepCardProps) {
  return (
    <div className={`bg-white rounded-xl border p-4 transition-colors ${running ? 'border-amber-300 shadow-sm' : 'border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <span className={`flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${running ? 'bg-amber-500' : 'bg-bark'}`}>
          {running ? '…' : number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-semibold text-bark text-sm">{title}</h3>
            {badge && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{badge}</span>}
          </div>
          <p className="text-xs text-gray-500 mb-2">{description}</p>
          {children}
          {result && <Banner result={result} />}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PipelineClient({ initialStats }: { initialStats: PipelineStats }) {
  const stats = initialStats
  const router = useRouter()

  // Stored sheet URLs
  const [prodSeoUrl, setProdSeoUrl] = useLocalStorage('pipeline_prod_seo_url')
  const [catSeoUrl, setCatSeoUrl] = useLocalStorage('pipeline_cat_seo_url')
  const [batchSize, setBatchSize] = useState<BatchSize>(300)

  // Per-step persisted results
  const [r1, setR1] = usePersistedResult('pipeline_r1')
  const [r2, setR2] = usePersistedResult('pipeline_r2')
  const [r3, setR3] = usePersistedResult('pipeline_r3')
  const [r4, setR4] = usePersistedResult('pipeline_r4')
  const [r5, setR5] = usePersistedResult('pipeline_r5')
  const [r6, setR6] = usePersistedResult('pipeline_r6')
  const [r7, setR7] = usePersistedResult('pipeline_r7')
  const [r8, setR8] = usePersistedResult('pipeline_r8')

  // Per-step loading
  const [p1, s1] = useTransition()
  const [p2, s2] = useTransition()
  const [p3, s3] = useTransition()
  const [p4, s4] = useTransition()
  const [p5, s5] = useTransition()
  const [p6, s6] = useTransition()
  const [p7, s7] = useTransition()
  const [p8, s8] = useTransition()

  const anyPending = p1 || p2 || p3 || p4 || p5 || p6 || p7 || p8

  function run<T extends StepResult>(
    start: (fn: () => Promise<void>) => void,
    action: () => Promise<T>,
    setResult: (r: StepResult) => void,
  ) {
    start(async () => {
      try {
        const r = await action()
        setResult({ ok: r.ok, message: r.message })
      } catch (e) {
        setResult({ ok: false, message: e instanceof Error ? e.message : 'Помилка' })
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      {/* Sheet URL config — shown at top, always visible */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
        <h2 className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-3">Налаштування — Google Sheets</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              Прайс товарів (Кроки 5 + 6)
              <span className="ml-1 text-blue-400 font-normal">SEO-поля: опис, мета</span>
            </label>
            <input
              value={prodSeoUrl}
              onChange={(e) => setProdSeoUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/…"
              className={`${INPUT} border-blue-200`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              Таблиця категорій (Крок 4)
              <span className="ml-1 text-blue-400 font-normal">Category | Description</span>
            </label>
            <input
              value={catSeoUrl}
              onChange={(e) => setCatSeoUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/…"
              className={`${INPUT} border-blue-200`}
            />
          </div>
        </div>
        <p className="text-xs text-blue-500 mt-2">URL зберігається автоматично у браузері — не потрібно вводити щоразу.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-1">
        {[
          { label: 'Категорій API', value: stats.supplierCategories },
          { label: 'Нових товарів API', value: stats.supplierProductsNew },
          { label: 'Каталог категорій', value: `${stats.catalogCategories} (${stats.catalogCategoriesPublished} публ.)` },
          { label: 'Каталог товарів', value: `${stats.catalogProducts} (${stats.catalogProductsPublished} публ.)` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-honey-50 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-bark leading-tight">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      <StepCard number={1} title="Синхронізація категорій API" badge="API → supplier_categories" running={p1}
        description="Завантажує список категорій з personal.cab у supplier_categories."
        result={r1}>
        <button disabled={anyPending} onClick={() => run(s1, syncApiCategoriesAction, setR1)} className={BTN_API}>
          {p1 && <Spinner />}{p1 ? 'Синхронізую…' : 'Запустити синхронізацію категорій'}
        </button>
      </StepCard>

      {/* Step 2 */}
      <StepCard number={2} title="Синхронізація товарів API" badge="API → supplier_products" running={p2}
        description="Завантажує всі товари з personal.cab. Ціна, залишок, фото — завжди з API."
        result={r2}>
        <button disabled={anyPending} onClick={() => run(s2, syncApiProductsAction, setR2)} className={BTN_API}>
          {p2 && <Spinner />}{p2 ? 'Синхронізую…' : 'Запустити синхронізацію товарів'}
        </button>
      </StepCard>

      {/* Step 3 */}
      <StepCard number={3} title="Створити категорії каталогу" badge="supplier_categories → catalog_categories" running={p3}
        description="Переносить нові категорії з supplier_categories у catalog_categories. Існуючі slug і SEO не змінюються."
        result={r3}>
        <span className="text-xs text-gray-400 mr-2">{stats.supplierCategories} у постачальника → {stats.catalogCategories} у каталозі</span>
        <button disabled={anyPending} onClick={() => run(s3, syncCatalogCategoriesAction, setR3)} className={BTN_API}>
          {p3 && <Spinner />}{p3 ? 'Синхронізую…' : 'Створити категорії каталогу'}
        </button>
      </StepCard>

      {/* Step 4 */}
      <StepCard number={4} title="SEO категорій з таблиці" badge="Google Sheet → catalog_categories" running={p4}
        description="Оновлює опис і мета-теги категорій із таблиці. Ціна і slug залишаються незмінними."
        result={r4}>
        <button
          disabled={anyPending || !catSeoUrl.trim()}
          onClick={() => run(s4, () => applyCategorySeoAction(catSeoUrl), setR4)}
          className={BTN_SEO}
          title={!catSeoUrl.trim() ? 'Вкажіть URL таблиці категорій вгорі' : ''}
        >
          {p4 && <Spinner />}{p4 ? 'Застосовую…' : 'Застосувати SEO категорій'}
        </button>
        {!catSeoUrl.trim() && <p className="text-xs text-amber-600 mt-1">⚠ Спочатку вкажіть URL таблиці категорій вище.</p>}
      </StepCard>

      {/* Step 5 */}
      <StepCard number={5} title="Імпорт товарів у каталог" badge="supplier_products → catalog_products" running={p5}
        description="Переносить товари з API в catalog_products. Ціна, фото — з API. SEO буде заповнено на Кроці 6. Запускайте кілька разів."
        result={r5}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">{stats.supplierProductsNew.toLocaleString('uk-UA')} нових товарів очікують</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">Пакет:</span>
          {BATCH_SIZES.map((s) => (
            <button key={s} onClick={() => setBatchSize(s)} disabled={anyPending}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                batchSize === s ? 'bg-bark text-white border-bark' : 'border-gray-300 text-gray-500 hover:border-bark'}`}>
              {s}
            </button>
          ))}
          <button
            disabled={anyPending || stats.supplierProductsNew === 0}
            onClick={() => run(s5, () => syncProductsToCatalogAction(batchSize), setR5)}
            className={BTN_API}
            title={stats.supplierProductsNew === 0 ? 'Нових товарів немає. Спочатку запустіть синхронізацію API (Крок 2).' : ''}
          >
            {p5 && <Spinner />}{p5 ? 'Імпортую…' : `Імпортувати ${batchSize} товарів`}
          </button>
        </div>
        {stats.supplierProductsNew === 0 && stats.catalogProducts === 0 && (
          <p className="text-xs text-amber-600 mt-1">⚠ Немає нових товарів. Спочатку запустіть Крок 2.</p>
        )}
        {stats.supplierProductsNew === 0 && stats.catalogProducts > 0 && (
          <p className="text-xs text-gray-400 mt-1">Всі товари вже в каталозі. Ціни оновлюються автоматично при повторному запуску.</p>
        )}
      </StepCard>

      {/* Step 6 */}
      <StepCard number={6} title="SEO товарів з таблиці" badge="Google Sheet → catalog_products" running={p6}
        description="Заповнює опис і мета-теги товарів із прайс-таблиці за SKU. Ціна і залишок — НЕ змінюються (завжди з API)."
        result={r6}>
        <button
          disabled={anyPending || !prodSeoUrl.trim()}
          onClick={() => run(s6, () => applyProductSeoAction(prodSeoUrl), setR6)}
          className={BTN_SEO}
          title={!prodSeoUrl.trim() ? 'Вкажіть URL прайс-таблиці вгорі' : ''}
        >
          {p6 && <Spinner />}{p6 ? 'Застосовую…' : 'Застосувати SEO товарів'}
        </button>
        {!prodSeoUrl.trim() && <p className="text-xs text-amber-600 mt-1">⚠ Спочатку вкажіть URL прайс-таблиці вище.</p>}
      </StepCard>

      {/* Step 7 */}
      <StepCard number={7} title="Опублікувати категорії" badge="is_published = true" running={p7}
        description={`${stats.catalogCategories - stats.catalogCategoriesPublished} категорій ще не видно публічно.`}
        result={r7}>
        <button
          disabled={anyPending || stats.catalogCategories === 0}
          onClick={() => run(s7, publishCategoriesAction, setR7)}
          className={BTN_PUB}
        >
          {p7 && <Spinner />}{p7 ? 'Публікую…' : `Опублікувати всі категорії (${stats.catalogCategories})`}
        </button>
      </StepCard>

      {/* Step 8 */}
      <StepCard number={8} title="Опублікувати товари" badge="status = published" running={p8}
        description={`${stats.catalogProductsDraft} товарів у статусі draft — не видно на /catalog.`}
        result={r8}>
        <button
          disabled={anyPending || stats.catalogProductsDraft === 0}
          onClick={() => run(s8, publishProductsAction, setR8)}
          className={BTN_PUB}
        >
          {p8 && <Spinner />}{p8 ? 'Публікую…' : `Опублікувати ${stats.catalogProductsDraft} товарів`}
        </button>
      </StepCard>
    </div>
  )
}
