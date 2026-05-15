import Link from 'next/link'

const NAV_LINKS = [
  { href: '/admin', label: 'Заявки' },
  { href: '/admin/settings', label: 'Налаштування' },
  { href: '/admin/honey', label: 'Мед' },
  { href: '/admin/apiary', label: 'Продукти пасіки' },
  { href: '/admin/flowers', label: 'Квіти' },
  { href: '/admin/beekeeper', label: 'Пасічники' },
  { href: '/admin/reviews', label: 'Відгуки' },
  { href: '/admin/faq', label: 'FAQ' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-cream min-h-screen overflow-x-hidden">
      {/* Admin top bar */}
      <div className="bg-bark text-cream px-4 py-3 flex items-center justify-between">
        <span className="font-serif font-bold text-base">Дача TV — Адмін</span>
        <a
          href="/api/admin/logout"
          className="text-sm text-cream/60 hover:text-cream transition-colors min-h-[44px] flex items-center"
        >
          Вийти
        </a>
      </div>

      {/* Admin nav — horizontally scrollable on mobile */}
      <nav
        className="bg-white border-b border-gray-200 overflow-x-auto"
        aria-label="Адмін навігація"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        <div className="flex gap-0.5 px-2 min-w-max">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-3.5 text-sm font-medium text-bark/70 hover:text-bark hover:bg-honey-50 whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-honey-600 min-h-[48px] flex items-center"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto w-full">
        {children}
      </div>
    </div>
  )
}
