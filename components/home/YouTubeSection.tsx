import { YouTubeFacade } from '@/components/shared/YouTubeFacade'
import { SocialIcons } from '@/components/shared/SocialIcons'
import type { SiteSettings } from '@/types'

interface YouTubeSectionProps {
  siteSettings: SiteSettings | null
  videoId?: string
}

const CHANNEL_HIGHLIGHTS = [
  'Підготовка вуликів навесні',
  'Збір та качка меду',
  'Робота з бджолопакетами',
  'Сезонний щоденник пасічника',
]

export function YouTubeSection({ siteSettings, videoId }: YouTubeSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-bark" aria-labelledby="youtube-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {videoId ? (
          /* Embedded video layout */
          <>
            <div className="text-center mb-10">
              <h2 id="youtube-heading" className="font-serif text-3xl md:text-4xl font-bold text-cream mb-4">
                Дивіться нас на YouTube
              </h2>
              <p className="text-cream/70 text-lg max-w-xl mx-auto">
                Ми відкрито розповідаємо про пасіку, збір меду та бджільництво.
              </p>
            </div>
            <YouTubeFacade
              videoId={videoId}
              title="Дача TV — Пасіка на Харківщині"
              className="shadow-2xl mb-8"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {siteSettings?.youtube_url && (
                <a
                  href={siteSettings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[48px]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Відкрити канал
                </a>
              )}
              <SocialIcons
                siteSettings={siteSettings}
                className="flex items-center gap-2"
                iconClassName="text-cream/60 hover:text-honey-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              />
            </div>
          </>
        ) : (
          /* Channel CTA card — shown when no video is pinned */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text side */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <span className="text-cream/50 text-sm font-semibold uppercase tracking-widest">YouTube</span>
              </div>

              <h2 id="youtube-heading" className="font-serif text-3xl md:text-4xl font-bold text-cream mb-5 leading-tight">
                Ми показуємо пасіку зсередини
              </h2>
              <p className="text-cream/65 text-lg mb-8 leading-relaxed">
                На нашому каналі — реальна робота пасічника: підготовка до сезону, робота з вуликами, збір та фасування меду. Нічого не приховуємо.
              </p>

              <div className="flex flex-wrap gap-4">
                {siteSettings?.youtube_url ? (
                  <a
                    href={siteSettings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors min-h-[52px]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Відкрити канал
                  </a>
                ) : null}
                <SocialIcons
                  siteSettings={siteSettings}
                  className="flex items-center gap-2"
                  iconClassName="text-cream/50 hover:text-honey-300 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                />
              </div>
            </div>

            {/* Highlights card */}
            <div className="bg-white/6 border border-white/10 rounded-3xl p-8">
              <p className="text-cream/50 text-xs font-semibold uppercase tracking-widest mb-5">
                Що ви побачите на каналі
              </p>
              <ul className="space-y-4">
                {CHANNEL_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-honey-600/20 border border-honey-500/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-honey-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                      </svg>
                    </div>
                    <span className="text-cream/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-cream/40 text-sm">
                  Відкрито про бджільництво — від підготовки вуликів навесні до фасування меду восени.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
