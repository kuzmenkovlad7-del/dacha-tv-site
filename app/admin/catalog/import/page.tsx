'use client'

import { useState, useTransition } from 'react'
import {
  previewSheetImport, applySheetImport,
  previewCategorySeoImport, applyCategorySeoImport,
} from './actions'
import type { ImportPreview, ImportRow, ApplyResult, CatSeoPreview, CatSeoRow, CatSeoResult } from './actions'

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
const BTN_PRIMARY = 'bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
const BTN_APPLY = 'bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const BATCH_SIZES = ['100', '300', '500'] as const

// ─── Product import tab ───────────────────────────────────────────────────────

function ProductImportTab() {
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [applyResult, setApplyResult] = useState<ApplyResult | null>(null)
  const [overwriteSeo, setOverwriteSeo] = useState(false)
  const [isPreviewing, startPreview] = useTransition()
  const [isApplying, startApply] = useTransition()

  function handlePreview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPreview(null)
    setApplyResult(null)
    startPreview(async () => setPreview(await previewSheetImport(fd)))
  }

  function handleApply() {
    if (!preview?.rows) return
    startApply(async () => setApplyResult(await applySheetImport(preview.rows, overwriteSeo)))
  }

  return (
    <div>
      {/* URL form */}
      <form onSubmit={handlePreview} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Посилання на Google Таблицю *
          </label>
          <input
            name="sheet_url"
            type="text"
            required
            className={INPUT}
            placeholder="https://docs.google.com/spreadsheets/d/…"
          />
          <p className="text-xs text-gray-400 mt-1">
            Вставте звичайне посилання «Поділитися». Таблиця має бути публічною для читання.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Кількість рядків
          </label>
          <div className="flex gap-2">
            {BATCH_SIZES.map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="limit" value={s} defaultChecked={s === '100'} className="accent-gray-900" />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Очікувані колонки:</p>
          <p className="text-xs text-gray-500 font-mono leading-relaxed">
            ID · <strong>SKU</strong> · Name · Price · Categories · Stock · Images · Description · Meta Title · Meta Description · Meta Keywords
          </p>
          <p className="text-xs text-gray-400 mt-1">Порядок довільний. Регістр не важливий. Meta Keywords приймається, але не зберігається.</p>
        </div>

        <button type="submit" disabled={isPreviewing} className={BTN_PRIMARY}>
          {isPreviewing ? 'Завантаження…' : 'Попередній перегляд'}
        </button>
      </form>

      {/* Preview error */}
      {preview && !preview.ok && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 max-w-2xl">
          <p className="font-semibold text-red-700">Помилка завантаження</p>
          <p className="text-sm text-red-600 mt-1 font-mono">{preview.error}</p>
          {preview.response_url && (
            <p className="text-xs text-red-400 mt-2 break-all">URL: {preview.response_url}</p>
          )}
        </div>
      )}

      {/* Apply result */}
      {applyResult && (
        <div className={`border rounded-xl p-5 mb-6 max-w-2xl ${applyResult.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`font-semibold ${applyResult.ok ? 'text-green-800' : 'text-red-700'}`}>
            {applyResult.ok ? 'Імпорт виконано' : 'Імпорт з помилками'}
          </p>
          <p className={`text-sm mt-1 ${applyResult.ok ? 'text-green-700' : 'text-red-600'}`}>{applyResult.message}</p>
          <p className="text-xs text-gray-500 mt-2">Нові товари отримали статус «draft». Перейдіть у Пайплайн → Крок 4 щоб опублікувати.</p>
        </div>
      )}

      {/* Preview table */}
      {preview?.ok && preview.rows.length > 0 && !applyResult && (
        <>
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Аналіз таблиці ({preview.total} рядків)</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Нових: <span className="text-green-600 font-medium">{preview.new_count}</span>
                  {' · '}Оновлень: <span className="text-blue-600 font-medium">{preview.update_count}</span>
                  {' · '}Пропущено: {preview.skip_count}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">#</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">SKU</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Назва</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-400">Ціна</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 hidden md:table-cell">Категорія</th>
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Дія</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.rows.slice(0, 200).map((row: ImportRow) => (
                    <tr key={row.row_num} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 text-xs text-gray-400">{row.row_num}</td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-700">{row.supplier_sku}</td>
                      <td className="px-4 py-2 text-gray-900 max-w-[200px] truncate" title={row.name}>{row.name || '—'}</td>
                      <td className="px-4 py-2 text-right text-gray-500 whitespace-nowrap">
                        {row.price_uah != null ? `${row.price_uah} грн` : '—'}
                      </td>
                      <td className="px-4 py-2 text-xs hidden md:table-cell">
                        {row.category_slug
                          ? <span className="text-green-700 font-mono">{row.category_slug}</span>
                          : row.category_raw
                          ? <span className="text-amber-600" title="Категорія не знайдена в каталозі">{row.category_raw} ⚠</span>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          row.action === 'new'    ? 'bg-green-100 text-green-700' :
                          row.action === 'update' ? 'bg-blue-100 text-blue-700'   :
                                                    'bg-gray-100 text-gray-500'
                        }`}>
                          {row.action === 'new' ? 'Новий' : row.action === 'update' ? 'Оновити' : 'Пропустити'}
                        </span>
                        {row.seo_preserved && (
                          <span className="ml-1 text-xs text-amber-500" title="Існуючий SEO збережено">SEO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Apply controls */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Застосувати імпорт до каталогу</h2>

            {preview.update_count > 0 && (
              <div className="flex items-start gap-3 mb-5 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overwriteSeo}
                    onChange={(e) => setOverwriteSeo(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-amber-900">Перезаписати SEO-поля</span>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Якщо вимкнено — Meta Title / Meta Description вже існуючих товарів не змінюються.
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button onClick={handleApply} disabled={isApplying} className={BTN_APPLY}>
                {isApplying ? 'Імпортую…' : `Застосувати (${preview.new_count} нових + ${preview.update_count} оновлень)`}
              </button>
              <button onClick={() => setPreview(null)} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Скасувати
              </button>
            </div>
          </div>
        </>
      )}

      {preview?.ok && preview.rows.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 text-center max-w-2xl">
          <p className="text-gray-500">Рядків для імпорту не знайдено. Перевірте формат таблиці та наявність колонки SKU.</p>
        </div>
      )}
    </div>
  )
}

// ─── Category SEO import tab ──────────────────────────────────────────────────

function CategorySeoTab() {
  const [preview, setPreview] = useState<CatSeoPreview | null>(null)
  const [applyResult, setApplyResult] = useState<CatSeoResult | null>(null)
  const [isPreviewing, startPreview] = useTransition()
  const [isApplying, startApply] = useTransition()

  function handlePreview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPreview(null)
    setApplyResult(null)
    startPreview(async () => setPreview(await previewCategorySeoImport(fd)))
  }

  function handleApply() {
    if (!preview?.rows) return
    startApply(async () => setApplyResult(await applyCategorySeoImport(preview.rows)))
  }

  return (
    <div>
      <form onSubmit={handlePreview} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Посилання на Google Таблицю категорій *
          </label>
          <input
            name="cat_sheet_url"
            type="text"
            required
            className={INPUT}
            placeholder="https://docs.google.com/spreadsheets/d/…"
          />
        </div>

        <div className="mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Очікувана структура:</p>
          <p className="text-xs text-blue-600 font-mono">Category | Description</p>
          <p className="text-xs text-blue-500 mt-1">
            Category — назва має збігатися з name_ua у каталозі. Description — опис для SEO.
          </p>
        </div>

        <button type="submit" disabled={isPreviewing} className={BTN_PRIMARY}>
          {isPreviewing ? 'Завантаження…' : 'Попередній перегляд'}
        </button>
      </form>

      {preview && !preview.ok && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 max-w-2xl">
          <p className="font-semibold text-red-700">Помилка</p>
          <p className="text-sm text-red-600 mt-1">{preview.error}</p>
        </div>
      )}

      {applyResult && (
        <div className={`border rounded-xl p-5 mb-6 max-w-2xl ${applyResult.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`font-semibold ${applyResult.ok ? 'text-green-800' : 'text-red-700'}`}>
            {applyResult.ok ? 'Оновлення виконано' : 'Оновлення з помилками'}
          </p>
          <p className={`text-sm mt-1 ${applyResult.ok ? 'text-green-700' : 'text-red-600'}`}>{applyResult.message}</p>
        </div>
      )}

      {preview?.ok && preview.rows.length > 0 && !applyResult && (
        <>
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Категорії ({preview.total} рядків)</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Знайдено: <span className="text-green-600 font-medium">{preview.update_count}</span>
                {' · '}Не знайдено: {preview.skip_count}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">#</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Назва в таблиці</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Slug у каталозі</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 hidden md:table-cell">Опис</th>
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Дія</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.rows.map((row: CatSeoRow) => (
                    <tr key={row.row_num} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 text-xs text-gray-400">{row.row_num}</td>
                      <td className="px-4 py-2 text-gray-700">{row.name_raw}</td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {row.matched_slug
                          ? <span className="text-green-700">{row.matched_slug}</span>
                          : <span className="text-red-400">не знайдено</span>
                        }
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500 max-w-[200px] truncate hidden md:table-cell" title={row.description ?? ''}>
                        {row.description || '—'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          row.action === 'update' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {row.action === 'update' ? 'Оновити' : 'Пропустити'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <button onClick={handleApply} disabled={isApplying || preview.update_count === 0} className={BTN_APPLY}>
                {isApplying ? 'Оновлюю…' : `Оновити ${preview.update_count} категорій`}
              </button>
              <button onClick={() => setPreview(null)} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Скасувати
              </button>
            </div>
          </div>
        </>
      )}

      {preview?.ok && preview.rows.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 text-center max-w-2xl">
          <p className="text-gray-500">Рядків не знайдено.</p>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImportPage() {
  const [tab, setTab] = useState<'products' | 'categories'>('products')

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Імпорт з Google Sheets</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Вставте посилання на таблицю — структура визначається автоматично.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {([
          { key: 'products', label: 'Товари → каталог' },
          { key: 'categories', label: 'SEO категорій' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'products' ? <ProductImportTab /> : <CategorySeoTab />}
    </div>
  )
}
