import Link from 'next/link'
import { PhoneLink } from '@/components/shared/PhoneLink'
import { SocialIcons } from '@/components/shared/SocialIcons'
import type { SiteConfig } from '@/types'

interface FooterProps {
  siteConfig: SiteConfig | null
}

const FALLBACK_PHONE = '+380XXXXXXXXX'
const FALLBACK_ADDRESS = 'Коротич, Пісочинська ОТГ, Харківська область, Україна'

const NAV_LINKS = [
  { href: '/honey', label: 'Мед' },
  { href: '/products', label: 'Продукти' },
  { href: '/beekeeper', label: 'Пасічникам' },
  { href: '/about', label: 'Про нас' },
  { href: '/contact', label: 'Контакти' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/faq', label: 'FAQ' },
]

export function Footer({ siteConfig }: FooterProps) {
  const phone = siteConfig?.phone || FALLBACK_PHONE
  const address = siteConfig?.addressFull || FALLBACK_ADDRESS
  const currentYear = 2024

  return (
    <footer className="bg-bark text-cream/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif font-bold text-2xl text-cream hover:text-honey-300 transition-colors block mb-3"
            >
              Дача TV
            </Link>
            <p className="text-sm text-cream/60 leading-relaxed">
              Натуральний мед від сімейної пасіки на Харківщині. Мед, пилок, прополіс та бджолині пакети напряму від виробника.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">
              Навігація
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Нижнє меню">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-cream/70 hover:text-honey-300 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">
              Контакти
            </h3>
            <div className="space-y-3">
              <div>
                <PhoneLink
                  phone={phone}
                  showIcon
                  className="text-cream/80 hover:text-honey-300 text-base font-semibold"
                />
              </div>
              {siteConfig?.telegramUrl && (
                <div>
                  <a
                    href={siteConfig.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream/70 hover:text-honey-300 transition-colors"
                  >
                    Telegram
                  </a>
                </div>
              )}
              <address className="text-sm text-cream/60 not-italic leading-relaxed">
                {address}
              </address>
            </div>

            {/* Social icons */}
            <SocialIcons
              siteConfig={siteConfig}
              className="flex items-center gap-1 mt-4"
              iconClassName="text-cream/60 hover:text-honey-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-cream/50">
            © {currentYear} Дача TV. Всі права захищено.
          </p>
          <Link
            href="/privacy"
            className="text-xs text-cream/50 hover:text-honey-300 transition-colors"
          >
            Політика конфіденційності
          </Link>
        </div>
      </div>
    </footer>
  )
}
