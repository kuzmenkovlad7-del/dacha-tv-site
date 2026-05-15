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
  let errorDetail: string | null = null
  let missingEnv = false

  try {
    const supabase = getSupabaseClient()
    // Select explicit safe columns — notes column may not exist if migration 015 not yet applied
    let query = supabase
      .from('inquiries')
      .select('id,name,phone,product,message,source,status,created_at,notes')
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status as InquiryStatus)
    }

    const { data, error: dbError } = await query

    if (dbError) {
      // notes column missing — retry without it
      if (dbError.message?.includes('notes')) {
        const { data: data2, error: dbError2 } = await supabase
          .from('inquiries')
          .select('id,name,phone,product,message,source,status,created_at')
          .order('created_at', { ascending: false })
        if (dbError2) {
          error = 'Помилка бази даних'
          errorDetail = dbError2.message
        } else {
          inquiries = (data2 ?? []).map((r) => ({ ...r, notes: null })) as Inquiry[]
        }
      } else {
        error = 'Не вдалося завантажити заявки'
        errorDetail = dbError.message
      }
    } else {
      inquiries = (data ?? []) as Inquiry[]
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('Missing Supabase')) {
      missingEnv = true
      error = 'Supabase не налаштовано'
      errorDetail = 'Встановіть NEXT_PUBLIC_SUPABASE_URL та SUPABASE_SERVICE_ROLE_KEY у змінних середовища Vercel.'
    } else {
      error = 'Помилка з\'єднання з базою даних'
      errorDetail = msg
    }
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 space-y-2">
          <p className="text-red-700 font-semibold">{error}</p>
          {errorDetail && (
            <p className="text-red-600 text-sm font-mono break-all">{errorDetail}</p>
          )}
          {missingEnv && (
            <p className="text-red-600 text-sm">
              Потрібні змінні:{' '}
              <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
              <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>
            </p>
          )}
          {errorDetail?.includes('does not exist') && (
            <p className="text-red-600 text-sm">
              Таблиця відсутня. Виконайте початкову міграцію у Supabase SQL editor.
            </p>
          )}
          {errorDetail?.includes('notes') && (
            <p className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded p-2">
              Потрібна міграція: <code className="font-mono">supabase/migrations/015_inquiry_notes.sql</code>
              {' '}— виконайте в Supabase SQL editor.
            </p>
          )}
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
