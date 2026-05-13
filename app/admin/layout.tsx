export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication is handled by proxy.ts — this layout is only reached
  // for authenticated sessions or the /admin/login page itself.
  return (
    <div className="bg-cream min-h-screen">
      {/* Admin nav */}
      <div className="bg-bark text-cream px-4 py-3 flex items-center justify-between">
        <span className="font-serif font-bold">Дача TV — Адмін</span>
        <a
          href="/api/admin/logout"
          className="text-sm text-cream/60 hover:text-cream transition-colors"
        >
          Вийти
        </a>
      </div>
      {children}
    </div>
  )
}
