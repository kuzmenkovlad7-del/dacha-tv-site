'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/honey', label: 'Мед' },
  { href: '/products', label: 'Продукти' },
  { href: '/beekeeper', label: 'Пасічникам' },
  { href: '/about', label: 'Про нас' },
  { href: '/contact', label: 'Контакти' },
]

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Навігація">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'text-honey-700 bg-honey-50'
                : 'text-bark/80 hover:text-honey-700 hover:bg-honey-50'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger button */}
      <button
        type="button"
        className="md:hidden p-2 rounded-md text-bark/70 hover:text-bark hover:bg-honey-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-label="Відкрити меню"
      >
        {menuOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-cream border-t border-honey-200 shadow-lg md:hidden z-50">
          <nav className="flex flex-col py-2" aria-label="Мобільна навігація">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-6 py-4 text-base font-medium transition-colors min-h-[48px] flex items-center',
                  pathname.startsWith(href)
                    ? 'text-honey-700 bg-honey-50'
                    : 'text-bark hover:text-honey-700 hover:bg-honey-50'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
