import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (!session || session.value !== '1') {
    redirect('/admin/login')
  }

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
