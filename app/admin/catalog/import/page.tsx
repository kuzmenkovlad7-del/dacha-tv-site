'use client'

import { useState, useTransition } from 'react'
import { previewSheetImport, applySheetImport } from './actions'
import type { ImportPreview, ImportRow, ApplyResult } from './actions'

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'

export default function ImportPage() {
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
    startPreview(async () => {
      const result = await previewSheetImport(fd)
      setPreview(result)
    })
  }

  function handleApply() {
    if (!preview?.rows) return
    startApply(async () => {
      const result = await applySheetImport(preview.rows, overwriteSeo)
      setApplyResult(result)
    })
  }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Імпорт з Google Sheets</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Попередній перегляд обов&apos;язковий перед застосуванням. Максимум 100 рядків за раз.
        </p>
      </div>

      {/* URL form */}
      <form onSubmit={handlePreview} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            URL Google Таблиці *
          </label>
          <input
            name="sheet_url"
            type="text"
            required
            className={INPUT}
            placeholder="https://docs.google.com/spreadsheets/d/... або CSV export URL"
          />
          <p className="text-xs text-gray-400 mt-1">
            Таблиця має бути публічною або опублікованою. Підтримуються стандартні URL і пряме посилання на CSV.
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Ліміт рядків (макс. 500)
          </label>
          <input name="limit" type="number" min="1" max="500" defaultValue="100" className={`${INPUT} w-32`} />
        </div>

        <div className="mb-5 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Очікувані колонки у таблиці:</p>
          <p className="text-xs text-gray-400 font-mono">
            SKU (або ID / Артикул) · Name (або Назва) · Price (або Ціна) · Stock (або Залишок) ·
            Images (або Фото) · Description (або Опис) · Meta Title · Meta Description · Category
          </p>
          <p className="text-xs text-gray-400">Порядок колонок довільний. Назви колонок нечутливі до регістру.</p>
        </div>

        <button
          type="submit"
          disabled={isPreviewing}
          className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreviewing ? 'Завантаження...' : 'Попередній перегляд'}
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
        </div>
      )}

      {/* Preview results */}
      {preview?.ok && preview.rows.length > 0 && !applyResult && (
        <>
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Результати аналізу ({preview.total} рядків)</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Нових: {preview.new_count} · Оновлень: {preview.update_count} · Пропущено: {preview.skip_count}
                </p>
              </div>
              <span className="text-xs text-gray-400 font-mono break-all max-w-xs truncate" title={preview.response_url}>
                {preview.response_url}
              </span>
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
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400 hidden md:table-cell">SEO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.rows.slice(0, 100).map((row: ImportRow) => (
                    <tr key={row.row_num} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-xs text-gray-400">{row.row_num}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{row.supplier_sku}</td>
                      <td className="px-4 py-2.5 text-gray-900 max-w-[180px] truncate" title={row.name}>{row.name}</td>
                      <td className="px-4 py-2.5 text-right text-gray-500">
                        {row.price_uah != null ? `${row.price_uah} грн` : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-500">{row.stock_quantity}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          row.action === 'new'    ? 'bg-green-100 text-green-700' :
                          row.action === 'update' ? 'bg-blue-100 text-blue-700'   :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {row.action === 'new' ? 'Новий' : row.action === 'update' ? 'Оновити' : 'Пропустити'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center hidden md:table-cell">
                        {row.seo_preserved && (
                          <span className="text-xs text-amber-600" title="Існуючий SEO-текст буде збережено">⚠ SEO</span>
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
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Застосувати імпорт</h2>

            {preview.update_count > 0 && (
              <div className="flex items-start gap-3 mb-5 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={overwriteSeo}
                      onChange={(e) => setOverwriteSeo(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300"
                    />
                    <div>
                      <span className="text-sm font-medium text-amber-900">Перезаписати SEO-поля (Meta Title, Meta Description)</span>
                      <p className="text-xs text-amber-700 mt-0.5">
                        За замовчуванням вимкнено — існуючий SEO-текст збережається. Увімкніть, тільки якщо хочете замінити всі SEO поля даними з таблиці.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplying ? 'Імпорт...' : `Застосувати (${preview.new_count} нових + ${preview.update_count} оновлень)`}
              </button>
              <button
                onClick={() => setPreview(null)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
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
