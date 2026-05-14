import Link from 'next/link'

const NAV_LINKS = [
  { href: '/admin', label: 'Заявки' },
  { href: '/admin/settings', label: 'Налаштування' },
  { href: '/admin/honey', label: 'Мед' },
  { href: '/admin/apiary', label: 'Продукти пасіки' },
  { href: '/admin/beekeeper', label: 'Для пасічників' },
  { href: '/admin/reviews', label: 'Відгуки' },
  { href: '/admin/faq', label: 'FAQ' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication is handled by proxy.ts — this layout is only reached
  // for authenticated sessions or the /admin/login page itself.
  return (
    <div className="bg-cream min-h-screen">
      {/* Admin top bar */}
      <div className="bg-bark text-cream px-4 py-3 flex items-center justify-between">
        <span className="font-serif font-bold">Дача TV — Адмін</span>
        <a
          href="/api/admin/logout"
          className="text-sm text-cream/60 hover:text-cream transition-colors"
        >
          Вийти
        </a>
      </div>

      {/* Admin nav */}
      <nav className="bg-white border-b border-gray-200 px-4 overflow-x-auto" aria-label="Адмін навігація">
        <div className="flex gap-1 max-w-7xl mx-auto">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-3 text-sm font-medium text-bark/70 hover:text-bark hover:bg-honey-50 rounded-t whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-honey-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}
