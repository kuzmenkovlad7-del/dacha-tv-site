'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatPhoneDisplay, formatPhoneTel } from '@/lib/utils'
import {
  LAUNCH_PHONE,
  LAUNCH_PHONE_SECONDARY,
  LAUNCH_YOUTUBE_URL,
  LAUNCH_INSTAGRAM_URL,
  LAUNCH_FACEBOOK_URL,
  LAUNCH_TIKTOK_URL,
} from '@/lib/launch-defaults'
import type { SiteSettings } from '@/types'

const NAV_ITEMS = [
  { href: '/honey', label: 'Мед' },
  { href: '/products', label: 'Продукти' },
  { href: '/flowers', label: 'Квіти' },
  { href: '/beekeeper', label: 'Пасічникам' },
  { href: '/about', label: 'Про нас' },
  { href: '/contact', label: 'Контакти' },
]

interface NavigationProps {
  phone?: string | null
  phoneSecondary?: string | null
  siteSettings?: SiteSettings | null
  logoPath?: string | null
}

function DrawerSocialIcons({ siteSettings }: { siteSettings: SiteSettings | null | undefined }) {
  const socials = [
    {
      url: siteSettings?.instagram_url || LAUNCH_INSTAGRAM_URL,
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      url: siteSettings?.youtube_url || LAUNCH_YOUTUBE_URL,
      label: 'YouTube',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      url: siteSettings?.facebook_url || LAUNCH_FACEBOOK_URL,
      label: 'Facebook',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      url: siteSettings?.tiktok_url || LAUNCH_TIKTOK_URL,
      label: 'TikTok',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      url: siteSettings?.telegram_url || null,
      label: 'Telegram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ].filter((s) => Boolean(s.url))

  if (socials.length === 0) return null

  return (
    <div className="flex items-center gap-2 pt-1 flex-wrap">
      {socials.map(({ url, label, icon }) => (
        <a
          key={label}
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-bark/50 hover:text-bark hover:border-bark/30 transition-all"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

function MobilePhoneLink({ phone }: { phone: string }) {
  return (
    <a
      href={`tel:${formatPhoneTel(phone)}`}
      className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-honey-200 text-bark font-semibold rounded-full transition-colors hover:border-honey-400 min-h-[52px]"
    >
      <svg className="w-4 h-4 text-honey-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      {formatPhoneDisplay(phone)}
    </a>
  )
}

export function Navigation({ phone, phoneSecondary, siteSettings, logoPath }: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const resolvedPhone = phone || LAUNCH_PHONE
  const resolvedPhoneSecondary = phoneSecondary || LAUNCH_PHONE_SECONDARY

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    const html = document.documentElement
    if (drawerOpen) {
      // Store scroll position on the element so the cleanup can restore it
      html.dataset.drawerScrollY = String(window.scrollY)
      html.style.overflow = 'hidden'
    } else {
      const y = Number(html.dataset.drawerScrollY ?? 0)
      html.style.overflow = ''
      delete html.dataset.drawerScrollY
      // Only scroll if we had a stored position (i.e. we locked it)
      if (y) window.scrollTo(0, y)
    }
    return () => {
      html.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Навігація">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'text-honey-800 bg-honey-100'
                : 'text-bark/70 hover:text-bark hover:bg-honey-50'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="md:hidden p-2 text-bark/70 hover:text-bark transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        onClick={() => setDrawerOpen(true)}
        aria-label="Відкрити меню"
        aria-expanded={drawerOpen}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Full-screen dark translucent backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-200',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in drawer — fixed, right-anchored, never wider than viewport */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-[60] w-[min(88vw,360px)] max-w-full bg-[#FAFAF8] shadow-2xl will-change-transform transition-transform duration-300 ease-in-out md:hidden flex flex-col',
          drawerOpen ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none'
        )}
        aria-label="Мобільна навігація"
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-label="Дача TV — на головну"
          >
            {logoPath && (
              <Image
                src={logoPath}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="font-serif font-bold text-xl text-bark">Дача TV</span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-bark/50 hover:text-bark transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Закрити меню"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                'py-4 px-5 text-base font-medium transition-colors min-h-[52px] flex items-center w-full border-b border-gray-50',
                pathname.startsWith(href)
                  ? 'text-honey-800 bg-honey-50'
                  : 'text-bark hover:text-honey-800 hover:bg-honey-50'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer — phone(s) + social + CTA */}
        <div className="px-5 py-5 border-t border-gray-100 space-y-3 flex-shrink-0 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <MobilePhoneLink phone={resolvedPhone} />
          {resolvedPhoneSecondary && resolvedPhoneSecondary !== resolvedPhone && (
            <MobilePhoneLink phone={resolvedPhoneSecondary} />
          )}
          <DrawerSocialIcons siteSettings={siteSettings} />
          <Link
            href="/honey"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center w-full py-3.5 bg-honey-700 hover:bg-honey-800 text-white font-semibold rounded-full transition-colors min-h-[52px]"
          >
            Замовити мед
          </Link>
        </div>
      </div>
    </>
  )
}
