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
    <header className="sticky top-0 z-40 w-full border-b border-black/8 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand name */}
          <Link
            href="/"
            className="flex-shrink-0 font-serif font-bold text-xl text-bark hover:text-honey-700 transition-colors"
          >
            Дача TV
          </Link>

          {/* Desktop navigation (center) */}
          <Navigation />

          {/* Phone — desktop only */}
          <div className="hidden md:flex items-center">
            <PhoneLink
              phone={phone}
              showIcon
              className="text-sm font-semibold text-bark/80 hover:text-honey-700 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
