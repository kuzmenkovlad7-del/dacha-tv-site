'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatPhoneDisplay, formatPhoneTel } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/honey', label: 'Мед' },
  { href: '/products', label: 'Продукти' },
  { href: '/beekeeper', label: 'Пасічникам' },
  { href: '/about', label: 'Про нас' },
  { href: '/contact', label: 'Контакти' },
]

interface NavigationProps {
  phone?: string | null
  phoneSecondary?: string | null
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

export function Navigation({ phone, phoneSecondary }: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
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

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col',
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Мобільна навігація"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link
            href="/"
            className="font-serif font-bold text-xl text-bark"
            onClick={() => setDrawerOpen(false)}
          >
            Дача TV
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
        <nav className="flex flex-col flex-1 px-4 py-6 gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                'px-4 py-4 rounded-xl text-base font-medium transition-colors min-h-[52px] flex items-center',
                pathname.startsWith(href)
                  ? 'text-honey-800 bg-honey-50'
                  : 'text-bark hover:text-honey-800 hover:bg-honey-50'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer — phone(s) + CTA */}
        <div className="px-6 py-6 border-t border-gray-100 space-y-3">
          {phone && <MobilePhoneLink phone={phone} />}
          {phoneSecondary && <MobilePhoneLink phone={phoneSecondary} />}
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
