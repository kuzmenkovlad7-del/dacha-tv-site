export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getSupabaseClient } from '@/lib/supabase/client'
import { InquiryCard } from '@/components/admin/InquiryCard'
import type { Inquiry, InquiryStatus } from '@/types'

export const metadata: Metadata = {
  title: 'Адмін — Заявки',
  robots: 'noindex, nofollow',
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Всі' },
  { value: 'new', label: 'Нові' },
  { value: 'contacted', label: 'Зателефонований' },
  { value: 'completed', label: 'Виконано' },
  { value: 'cancelled', label: 'Скасовано' },
]

interface AdminPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { status = 'all' } = await searchParams

  let inquiries: Inquiry[] = []
  let error: string | null = null

  try {
    const supabase = getSupabaseClient()
    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status as InquiryStatus)
    }

    const { data, error: dbError } = await query

    if (dbError) {
      error = 'Не вдалося завантажити заявки'
    } else {
      inquiries = data as Inquiry[]
    }
  } catch {
    error = 'Помилка з\'єднання з базою даних'
  }

  const newCount = inquiries.filter((i) => i.status === 'new').length

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-bark mb-1">
          Заявки
        </h1>
        {newCount > 0 && (
          <p className="text-honey-700 font-semibold">
            {newCount} нових заявок
          </p>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map(({ value, label }) => (
          <a
            key={value}
            href={`/admin${value !== 'all' ? `?status=${value}` : ''}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] flex items-center ${
              status === value || (value === 'all' && status === 'all')
                ? 'bg-honey-700 text-white'
                : 'bg-white text-bark border border-honey-200 hover:bg-honey-50'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
          <p className="text-red-600 text-sm mt-1">
            Перевірте налаштування Supabase у змінних оточення.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!error && inquiries.length === 0 && (
        <div className="text-center py-16">
          <p className="text-bark/50 text-lg">Заявок немає</p>
        </div>
      )}

      {/* Inquiries list */}
      {inquiries.length > 0 && (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  )
}
