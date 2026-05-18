export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { createService } from './actions'
import type { Service } from '@/types'

export const metadata: Metadata = {
  title: 'Адмін — Послуги',
  robots: 'noindex, nofollow',
}

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent'
const LABEL = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

export default async function AdminServicesPage() {
  let services: Service[] = []
  try {
    const client = getAdminClient()
    const { data } = await client.from('services').select('*').order('display_order', { ascending: true })
    services = (data ?? []) as Service[]
  } catch { /* env not configured */ }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Послуги</h1>
        {services.length > 0 && (
          <p className="text-sm text-gray-500 mt-0.5">{services.length} позицій</p>
        )}
      </div>

      {services.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Назва</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Вартість</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Статус</th>
                <th className="px-5 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{service.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                    {service.price_note ?? (service.price_uah != null ? `${service.price_uah} грн` : '—')}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}
                      title={service.status}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/services/${service.id}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      Змін.
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div id="create" className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-2xl">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Додати послугу</h2>
        <form action={createService} className="space-y-4">
          <div>
            <label className={LABEL}>Назва *</label>
            <input name="name" type="text" required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Короткий опис</label>
            <textarea name="short_description" rows={2} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Повний опис</label>
            <textarea name="description" rows={4} className={INPUT} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Ціна (грн)</label>
              <input name="price_uah" type="number" step="0.01" className={INPUT} placeholder="1000" />
            </div>
            <div>
              <label className={LABEL}>Примітка до ціни</label>
              <input name="price_note" type="text" className={INPUT} placeholder="₴1000 / година" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Тривалість</label>
              <input name="duration_note" type="text" className={INPUT} placeholder="Від 1 години" />
            </div>
            <div>
              <label className={LABEL}>Порядок відображення</label>
              <input name="display_order" type="number" className={INPUT} defaultValue="0" />
            </div>
          </div>
          <div>
            <label className={LABEL}>URL зображення</label>
            <input name="image_url" type="url" className={INPUT} placeholder="https://..." />
          </div>
          <div>
            <label className={LABEL}>Статус</label>
            <select name="status" className={INPUT}>
              <option value="active">Активна</option>
              <option value="inactive">Прихована</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input id="is_featured" name="is_featured" type="checkbox" className="rounded border-gray-300" />
            <label htmlFor="is_featured" className="text-sm text-gray-700">Виділена послуга</label>
          </div>
          <button type="submit" className="mt-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
            Додати послугу
          </button>
        </form>
      </div>
    </div>
  )
}
