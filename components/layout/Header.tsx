import Link from 'next/link'
import Image from 'next/image'
import { existsSync } from 'fs'
import { join } from 'path'
import { Navigation } from './Navigation'
import { PhoneLink } from '@/components/shared/PhoneLink'
import type { SiteSettings } from '@/types'

interface HeaderProps {
  siteSettings: SiteSettings | null
}

const LOGO_PATH = '/images/dacha-tv/logo.png'

export function Header({ siteSettings }: HeaderProps) {
  const phone = siteSettings?.phone || null
  const phoneSecondary = siteSettings?.phone_secondary || null
  const hasLogo = existsSync(join(process.cwd(), 'public', LOGO_PATH))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/8 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/72">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            aria-label="Дача TV — на головну"
          >
            {hasLogo ? (
              <Image
                src={LOGO_PATH}
                alt="Дача TV"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                priority
              />
            ) : null}
            <span className="font-serif font-bold text-xl text-bark">
              Дача TV
            </span>
          </Link>

          {/* Desktop navigation (center) */}
          <Navigation
            phone={phone}
            phoneSecondary={phoneSecondary}
            siteSettings={siteSettings}
            logoPath={hasLogo ? LOGO_PATH : null}
          />

          {/* Phone — desktop only */}
          {phone && (
            <div className="hidden md:flex items-center">
              <PhoneLink
                phone={phone}
                showIcon
                className="text-sm font-semibold text-bark/80 hover:text-honey-700 transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
