import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/supabase/queries'
import { saveSiteSettings } from './actions'

export const metadata: Metadata = {
  title: 'Адмін — Налаштування',
  robots: 'noindex, nofollow',
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-bark mb-6">Налаштування сайту</h1>

      <form action={saveSiteSettings} className="space-y-5 bg-white rounded-2xl p-6 border border-honey-100">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-bark mb-1">Телефон</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={settings?.phone ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="+380XXXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="address_full" className="block text-sm font-semibold text-bark mb-1">Повна адреса</label>
            <input
              id="address_full"
              name="address_full"
              type="text"
              defaultValue={settings?.address_full ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            />
          </div>

          <div>
            <label htmlFor="address_display" className="block text-sm font-semibold text-bark mb-1">Коротка адреса (для відображення)</label>
            <input
              id="address_display"
              name="address_display"
              type="text"
              defaultValue={settings?.address_display ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            />
          </div>

          <div>
            <label htmlFor="telegram_url" className="block text-sm font-semibold text-bark mb-1">Telegram URL</label>
            <input
              id="telegram_url"
              name="telegram_url"
              type="url"
              defaultValue={settings?.telegram_url ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="https://t.me/..."
            />
          </div>

          <div>
            <label htmlFor="youtube_url" className="block text-sm font-semibold text-bark mb-1">YouTube URL</label>
            <input
              id="youtube_url"
              name="youtube_url"
              type="url"
              defaultValue={settings?.youtube_url ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="https://youtube.com/@..."
            />
          </div>

          <div>
            <label htmlFor="instagram_url" className="block text-sm font-semibold text-bark mb-1">Instagram URL</label>
            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={settings?.instagram_url ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label htmlFor="facebook_url" className="block text-sm font-semibold text-bark mb-1">Facebook URL</label>
            <input
              id="facebook_url"
              name="facebook_url"
              type="url"
              defaultValue={settings?.facebook_url ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label htmlFor="tiktok_url" className="block text-sm font-semibold text-bark mb-1">TikTok URL</label>
            <input
              id="tiktok_url"
              name="tiktok_url"
              type="url"
              defaultValue={settings?.tiktok_url ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="https://tiktok.com/@..."
            />
          </div>

          <div>
            <label htmlFor="hero_tagline" className="block text-sm font-semibold text-bark mb-1">Головний слоган (Hero)</label>
            <input
              id="hero_tagline"
              name="hero_tagline"
              type="text"
              defaultValue={settings?.hero_tagline ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            />
          </div>

          <div>
            <label htmlFor="hero_subtext" className="block text-sm font-semibold text-bark mb-1">Підзаголовок Hero</label>
            <textarea
              id="hero_subtext"
              name="hero_subtext"
              rows={3}
              defaultValue={settings?.hero_subtext ?? ''}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-bark text-white font-semibold py-3 px-6 rounded-lg hover:bg-bark-light transition-colors min-h-[48px]"
        >
          Зберегти налаштування
        </button>
      </form>
    </div>
  )
}
