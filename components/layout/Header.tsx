import Link from 'next/link'
import { Navigation } from './Navigation'
import { PhoneLink } from '@/components/shared/PhoneLink'
import type { SiteConfig } from '@/types'

interface HeaderProps {
  siteConfig: SiteConfig | null
}

const FALLBACK_PHONE = '+380XXXXXXXXX'

export function Header({ siteConfig }: HeaderProps) {
  const phone = siteConfig?.phone || FALLBACK_PHONE

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-honey-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Brand name */}
          <Link
            href="/"
            className="flex-shrink-0 font-serif font-bold text-xl text-bark hover:text-honey-700 transition-colors"
          >
            Дача TV
          </Link>

          {/* Navigation (desktop) + hamburger (mobile) */}
          <Navigation />

          {/* Phone — always visible */}
          <div className="hidden sm:flex items-center">
            <PhoneLink
              phone={phone}
              showIcon
              className="text-sm font-semibold"
            />
          </div>
        </div>

        {/* Mobile phone bar */}
        <div className="sm:hidden py-2 border-t border-honey-100 flex justify-center">
          <PhoneLink
            phone={phone}
            showIcon
            className="text-base font-semibold"
          />
        </div>
      </div>
    </header>
  )
}
