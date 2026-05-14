import type { Metadata } from 'next'
import { SocialIcons } from '@/components/shared/SocialIcons'
import { CTAButton } from '@/components/shared/CTAButton'
import { getSiteSettings } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Про нас',
  description:
    'Сімейна пасіка Дача TV — Коротич, Харківська область. Дізнайтесь нашу історію: як ми починали, що нас відрізняє, і чому ми відкрито показуємо всю нашу роботу на YouTube.',
  openGraph: {
    title: 'Про нас | Дача TV',
    description: 'Сімейна пасіка на Харківщині — наша історія, наш підхід, наші бджоли.',
  },
}

export default async function AboutPage() {
  const siteSettings = await getSiteSettings().catch(() => null)

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-3 block">Про нас</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Наша пасіка, наша робота
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Сімейна пасіка на Харківщині — наша історія, наш підхід, наші бджоли.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">

        {/* Story */}
        <section aria-labelledby="story-heading">
          <h2 id="story-heading" className="font-serif text-3xl font-bold text-bark mb-6">
            Наша історія
          </h2>

          {/* Photo placeholder */}
          <div
            className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-honey-200 to-honey-400 flex items-center justify-center mb-8"
            aria-label="Фото пасіки — буде замінено на реальне"
          >
            <div className="text-center p-8">
              <svg className="w-12 h-12 text-honey-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.719 17.719l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.719 6.281l1.061-1.061M12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z" />
              </svg>
              <p className="text-honey-700 font-medium">Пасіка Дача TV · Коротич, Харківська область</p>
            </div>
          </div>

          <div className="space-y-5 text-bark/80 leading-relaxed text-lg">
            <p>
              Дача TV — це сімейна пасіка на Харківщині. Ми тримаємо бджіл вже багато років, і кожен крок нашого виробництва — від підготовки вуликів навесні до фасування осіннього меду — це наша власна праця.
            </p>
            <p>
              Все починалося як особисте захоплення. Поступово кількість вуликів росла, якість меду покращувалася, і ми зрозуміли, що хочемо ділитися не лише продуктом, але й знаннями. Так з&apos;явився YouTube-канал.
            </p>
            <p>
              Сьогодні ми виробляємо мед кількох сортів, продаємо бджолопакети та вулики, і продовжуємо відкрито розповідати про свою роботу. Бо чесність — це не маркетинг. Це наш спосіб.
            </p>
          </div>
        </section>

        {/* Apiary */}
        <section aria-labelledby="apiary-heading">
          <h2 id="apiary-heading" className="font-serif text-3xl font-bold text-bark mb-6">
            Наша пасіка
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Місцезнаходження', value: 'Коротич, Харківська область' },
              { label: 'Формат', value: 'Сімейна пасіка, пряма поставка' },
              { label: 'Продукти', value: 'Мед 6 сортів, пилок, прополіс, горіхи в меду' },
              { label: 'Бджолопакети', value: 'Buckfast, Українська степова, Карніка' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-honey-100">
                <dt className="text-sm font-semibold text-honey-700 uppercase tracking-wider mb-1">{label}</dt>
                <dd className="font-serif text-lg text-bark">{value}</dd>
              </div>
            ))}
          </div>
        </section>

        {/* Approach */}
        <section aria-labelledby="approach-heading">
          <h2 id="approach-heading" className="font-serif text-3xl font-bold text-bark mb-6">
            Наш підхід
          </h2>
          <div className="space-y-4 text-bark/80 leading-relaxed text-lg">
            <p>
              Ми самі доглядаємо за вуликами, самі качаємо, самі пакуємо. Жодних посередників. Ніякого змішування сортів. Жодного підігріву меду вище природних температур.
            </p>
            <p>
              Кожен сорт збирається у свій природний час — коли конкретна культура цвіте і нектар дозріває. Акація в травні, липа в липні, соняшник наприкінці серпня. Це й робить смак кожного сорту особливим.
            </p>
            <p>
              Якщо меду немає — ми говоримо про це прямо. Сезонний продукт не може бути доступним цілий рік в необмеженій кількості. Ми не торгуємо тим, чого немає.
            </p>
          </div>
        </section>

        {/* YouTube */}
        <section aria-labelledby="youtube-about-heading">
          <h2 id="youtube-about-heading" className="font-serif text-3xl font-bold text-bark mb-4">
            YouTube та контент
          </h2>
          <p className="text-bark/70 text-lg mb-8 leading-relaxed">
            На нашому YouTube-каналі ми показуємо пасіку зсередини: підготовку до сезону, роботу з вуликами, збір та фасування меду. Підписуйтесь — ми нічого не приховуємо.
          </p>

          {/* YouTube channel promo */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-bark via-honey-950 to-forest-950 flex flex-col items-center justify-center mb-6 border border-honey-900/30">
            <svg className="w-14 h-14 text-red-500 mb-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <p className="text-cream font-serif text-xl font-semibold mb-2">Дача TV на YouTube</p>
            <p className="text-cream/60 text-sm text-center max-w-xs px-4">
              Відео про пасіку, сезонну роботу і бджільництво — відкрито, без прикрас
            </p>
            {siteSettings?.youtube_url && (
              <a
                href={siteSettings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[48px]"
              >
                Відкрити канал
              </a>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
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
              iconClassName="text-bark/50 hover:text-honey-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-honey-50 rounded-2xl p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-bark mb-3">
            Готові замовити натуральний мед?
          </h2>
          <p className="text-bark/70 mb-6">Перегляньте наш каталог і оберіть улюблений сорт.</p>
          <CTAButton href="/honey" size="lg">Перейти до каталогу</CTAButton>
        </section>
      </div>
    </div>
  )
}
