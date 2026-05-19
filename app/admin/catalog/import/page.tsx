'use client'

import { useState, useTransition } from 'react'
import { previewSheetImport, applySheetImport, previewSeoImport, applySeoImport } from './actions'
import type { ImportPreview, ImportRow, ApplyResult, SeoImportPreview, SeoImportRow, SeoApplyResult } from './actions'

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'

type Tab = 'supplier' | 'seo'

export default function ImportPage() {
  const [tab, setTab] = useState<Tab>('supplier')

  // Supplier import state
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [applyResult, setApplyResult] = useState<ApplyResult | null>(null)
  const [overwriteSeo, setOverwriteSeo] = useState(false)
  const [isPreviewing, startPreview] = useTransition()
  const [isApplying, startApply] = useTransition()

  // SEO import state
  const [seoPreview, setSeoPreview] = useState<SeoImportPreview | null>(null)
  const [seoResult, setSeoResult] = useState<SeoApplyResult | null>(null)
  const [overwriteContent, setOverwriteContent] = useState(false)
  const [isSeoPreview, startSeoPreview] = useTransition()
  const [isSeoApplying, startSeoApply] = useTransition()

  function handlePreview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPreview(null); setApplyResult(null)
    startPreview(async () => setPreview(await previewSheetImport(fd)))
  }

  function handleApply() {
    if (!preview?.rows) return
    startApply(async () => setApplyResult(await applySheetImport(preview.rows, overwriteSeo)))
  }

  function handleSeoPreview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSeoPreview(null); setSeoResult(null)
    startSeoPreview(async () => setSeoPreview(await previewSeoImport(fd)))
  }

  function handleSeoApply() {
    if (!seoPreview?.rows) return
    startSeoApply(async () => setSeoResult(await applySeoImport(seoPreview.rows, overwriteContent)))
  }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Імпорт з Google Sheets</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Два режими: дані постачальника або SEO-поля для опублікованого каталогу.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {([['supplier', 'Дані постачальника'], ['seo', 'SEO каталогу']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Supplier data ─────────────────────────────────────────── */}
      {tab === 'supplier' && (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-2xl">
            <p className="text-sm font-semibold text-amber-800 mb-1">Записує до: supplier_products (сирі дані)</p>
            <p className="text-xs text-amber-700">
              Використовуйте для первинного завантаження прайсу постачальника.
              Для оновлення SEO опублікованих товарів — перейдіть у вкладку «SEO каталогу».
            </p>
          </div>

          <form onSubmit={handlePreview} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">URL Google Таблиці *</label>
              <input name="sheet_url" type="text" required className={INPUT} placeholder="https://docs.google.com/spreadsheets/d/..." />
              <p className="text-xs text-gray-400 mt-1">Таблиця має бути публічною або опублікованою як CSV.</p>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Ліміт рядків (макс. 500)</label>
              <input name="limit" type="number" min="1" max="500" defaultValue="100" className={`${INPUT} w-32`} />
            </div>
            <div className="mb-5 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Колонки таблиці:</p>
              <p className="text-xs text-gray-400 font-mono">SKU · Name · Price · Stock · Images · Description · Meta Title · Meta Description · Category</p>
            </div>
            <button type="submit" disabled={isPreviewing} className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
              {isPreviewing ? 'Завантаження...' : 'Попередній перегляд'}
            </button>
          </form>

          {preview && !preview.ok && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 max-w-2xl">
              <p className="font-semibold text-red-700">Помилка</p>
              <p className="text-sm text-red-600 mt-1 font-mono">{preview.error}</p>
            </div>
          )}

          {applyResult && (
            <div className={`border rounded-xl p-5 mb-6 max-w-2xl ${applyResult.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-semibold ${applyResult.ok ? 'text-green-800' : 'text-red-700'}`}>
                {applyResult.ok ? 'Імпорт виконано' : 'Імпорт з помилками'}
              </p>
              <p className={`text-sm mt-1 ${applyResult.ok ? 'text-green-700' : 'text-red-600'}`}>{applyResult.message}</p>
            </div>
          )}

          {preview?.ok && preview.rows.length > 0 && !applyResult && (
            <>
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-700">Аналіз ({preview.total} рядків)</h2>
                    <p className="text-xs text-gray-400">Нових: {preview.new_count} · Оновлень: {preview.update_count} · Пропущено: {preview.skip_count}</p>
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
                        <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-400">Залишок</th>
                        <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Дія</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {preview.rows.slice(0, 100).map((row: ImportRow) => (
                        <tr key={row.row_num} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 text-xs text-gray-400">{row.row_num}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{row.supplier_sku}</td>
                          <td className="px-4 py-2.5 text-gray-900 max-w-[180px] truncate">{row.name}</td>
                          <td className="px-4 py-2.5 text-right text-gray-500">{row.price_uah != null ? `${row.price_uah} грн` : '—'}</td>
                          <td className="px-4 py-2.5 text-right text-gray-500">{row.stock_quantity}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              row.action === 'new' ? 'bg-green-100 text-green-700' : row.action === 'update' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {row.action === 'new' ? 'Новий' : row.action === 'update' ? 'Оновити' : 'Пропустити'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
                {preview.update_count > 0 && (
                  <label className="flex items-start gap-2 mb-5 cursor-pointer p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <input type="checkbox" checked={overwriteSeo} onChange={(e) => setOverwriteSeo(e.target.checked)} className="mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-amber-900">Перезаписати SEO-поля</span>
                      <p className="text-xs text-amber-700 mt-0.5">За замовчуванням існуючий SEO-текст зберігається.</p>
                    </div>
                  </label>
                )}
                <div className="flex items-center gap-3">
                  <button onClick={handleApply} disabled={isApplying} className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50">
                    {isApplying ? 'Імпорт...' : `Застосувати (${preview.new_count + preview.update_count})`}
                  </button>
                  <button onClick={() => setPreview(null)} className="text-sm text-gray-500 hover:text-gray-700">Скасувати</button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Tab: SEO import for catalog_products ──────────────────────── */}
      {tab === 'seo' && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-2xl">
            <p className="text-sm font-semibold text-blue-800 mb-1">Записує до: catalog_products (тільки SEO-поля)</p>
            <p className="text-xs text-blue-700">
              Оновлює лише name_ua, опис, meta_title, meta_description, category_slug.
              Ціна, залишок і дані постачальника — незмінні.
              Обов&apos;язково: товар вже має бути в каталозі (затверджений).
            </p>
          </div>

          <form onSubmit={handleSeoPreview} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">URL Google Таблиці *</label>
              <input name="sheet_url" type="text" required className={INPUT} placeholder="https://docs.google.com/spreadsheets/d/..." />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Ліміт рядків (макс. 1000)</label>
              <input name="limit" type="number" min="1" max="1000" defaultValue="200" className={`${INPUT} w-32`} />
            </div>
            <div className="mb-5 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Колонки таблиці:</p>
              <p className="text-xs text-gray-400 font-mono">SKU (обов&apos;язково) · name_ua · short_description · description · meta_title · meta_description · category_slug · image_url</p>
            </div>
            <button type="submit" disabled={isSeoPreview} className="bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50">
              {isSeoPreview ? 'Завантаження...' : 'Попередній перегляд'}
            </button>
          </form>

          {seoPreview && !seoPreview.ok && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 max-w-2xl">
              <p className="font-semibold text-red-700">Помилка</p>
              <p className="text-sm text-red-600 mt-1 font-mono">{seoPreview.error}</p>
            </div>
          )}

          {seoResult && (
            <div className={`border rounded-xl p-5 mb-6 max-w-2xl ${seoResult.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-semibold ${seoResult.ok ? 'text-green-800' : 'text-red-700'}`}>
                {seoResult.ok ? 'SEO оновлено' : 'Помилки при оновленні'}
              </p>
              <p className={`text-sm mt-1 ${seoResult.ok ? 'text-green-700' : 'text-red-600'}`}>{seoResult.message}</p>
            </div>
          )}

          {seoPreview?.ok && seoPreview.rows.length > 0 && !seoResult && (
            <>
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700">Аналіз SEO ({seoPreview.total} товарів)</h2>
                  <p className="text-xs text-gray-400">До оновлення: {seoPreview.update_count} · Пропущено (не в каталозі): {seoPreview.skip_count}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">SKU</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Назва (UA)</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Meta Title</th>
                        <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Категорія slug</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {seoPreview.rows.slice(0, 100).map((row: SeoImportRow) => (
                        <tr key={row.row_num} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{row.supplier_sku}</td>
                          <td className="px-4 py-2.5 text-gray-900 max-w-[160px] truncate">{row.name_ua ?? '—'}</td>
                          <td className="px-4 py-2.5 text-gray-500 max-w-[160px] truncate text-xs">{row.meta_title ?? '—'}</td>
                          <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">{row.category_slug ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
                <label className="flex items-start gap-2 mb-5 cursor-pointer p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <input type="checkbox" checked={overwriteContent} onChange={(e) => setOverwriteContent(e.target.checked)} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-amber-900">Перезаписати поле «Опис»</span>
                    <p className="text-xs text-amber-700 mt-0.5">Meta Title і Meta Description завжди оновлюються. Опис — лише якщо увімкнено.</p>
                  </div>
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={handleSeoApply} disabled={isSeoApplying} className="bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-50">
                    {isSeoApplying ? 'Оновлення...' : `Оновити SEO (${seoPreview.update_count})`}
                  </button>
                  <button onClick={() => setSeoPreview(null)} className="text-sm text-gray-500 hover:text-gray-700">Скасувати</button>
                </div>
              </div>
            </>
          )}

          {seoPreview?.ok && seoPreview.rows.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center max-w-2xl">
              <p className="text-gray-500">Товарів для оновлення не знайдено. Перевірте, чи вони затверджені в каталозі.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
