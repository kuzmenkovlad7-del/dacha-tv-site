import Link from 'next/link'
import { CTAButton } from '@/components/shared/CTAButton'
import { PhoneLink } from '@/components/shared/PhoneLink'
import type { SiteConfig } from '@/types'

interface HeroProps {
  tagline?: string
  subtext?: string
  siteConfig: SiteConfig | null
}

export function Hero({ tagline, subtext, siteConfig }: HeroProps) {
  const displayTagline = tagline || 'Справжній мед. Від нашої пасіки — до вашого столу.'
  const displaySubtext =
    subtext || 'Сімейна пасіка на Харківщині. Мед, пилок, прополіс та бджолині пакети.'

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-bark">
      {/* Background gradient — placeholder until real photo */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-honey-900 via-bark to-forest-950"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 50%, #f59e0b 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, #166534 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-honey-500/20 border border-honey-400/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" aria-hidden="true" />
            <span className="text-honey-300 text-sm font-medium">
              Пряма поставка від пасічника
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            {displayTagline}
          </h1>

          <p className="text-xl text-cream/80 mb-8 leading-relaxed">
            {displaySubtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <CTAButton href="/honey" size="lg" variant="primary">
              Обрати мед
            </CTAButton>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg text-cream/80 hover:text-cream transition-colors min-h-[56px]"
            >
              Дізнатись про нас
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {siteConfig?.phone && (
            <div className="mt-8 pt-8 border-t border-cream/10">
              <p className="text-cream/60 text-sm mb-2">
                Або зателефонуйте нам напряму:
              </p>
              <PhoneLink
                phone={siteConfig.phone}
                showIcon
                className="text-xl font-bold text-honey-300 hover:text-honey-200"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
