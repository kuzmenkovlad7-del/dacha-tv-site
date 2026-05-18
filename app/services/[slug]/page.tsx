export const dynamic = 'force-dynamic'
export const revalidate = 0

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServiceBySlug } from '@/lib/supabase/queries'
import { GeneralContactForm } from '@/components/forms/GeneralContactForm'
import { StructuredData } from '@/components/shared/StructuredData'

interface Props {
  params: Promise<{ slug: string }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.dachatv.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug).catch(() => null)
  if (!service) return { title: 'Послугу не знайдено' }
  const description = service.short_description || `${service.name} — Дача TV`
  return {
    title: `${service.name} | Дача TV`,
    description,
    alternates: { canonical: `${siteUrl}/services/${slug}` },
    openGraph: {
      title: `${service.name} | Дача TV`,
      description,
      images: service.image_url
        ? [{ url: service.image_url, width: 1200, height: 630, alt: service.name }]
        : [{ url: `${siteUrl}/images/dacha-tv/logo-square.png`, width: 1200, height: 630, alt: 'Дача TV' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.name} | Дача TV`,
      description,
      images: service.image_url ? [service.image_url] : [`${siteUrl}/images/dacha-tv/logo-square.png`],
    },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug).catch(() => null)
  if (!service || service.status !== 'active') notFound()

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.short_description || service.name,
    provider: { '@type': 'Organization', name: 'Дача TV', url: siteUrl },
    ...(service.price_uah != null ? {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'UAH',
        price: service.price_uah,
        availability: 'https://schema.org/InStock',
      },
    } : {}),
  }

  return (
    <div className="bg-white min-h-screen">
      <StructuredData data={serviceSchema} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Навігація" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700 transition-colors">Головна</Link>
          <span className="mx-2">›</span>
          <Link href="/services" className="hover:text-gray-700 transition-colors">Послуги</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{service.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Visual */}
          <div className="rounded-2xl overflow-hidden aspect-video bg-honey-50 flex items-center justify-center">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl select-none">🌿</span>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-bark mb-4">
              {service.name}
            </h1>

            {service.short_description && (
              <p className="text-bark/70 text-lg leading-relaxed mb-5">
                {service.short_description}
              </p>
            )}

            {service.description && service.description !== service.short_description && (
              <p className="text-bark/70 leading-relaxed mb-6">
                {service.description}
              </p>
            )}

            <dl className="space-y-3 mb-6 border-t border-gray-100 pt-5">
              {service.price_note && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Вартість</dt>
                  <dd className="col-span-2 text-sm text-gray-800 font-semibold">{service.price_note}</dd>
                </div>
              )}
              {service.duration_note && (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-sm font-medium text-gray-400">Тривалість</dt>
                  <dd className="col-span-2 text-sm text-gray-800">{service.duration_note}</dd>
                </div>
              )}
            </dl>

            {/* Inquiry form */}
            <div id="order-form" className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-1">Замовити послугу</h2>
              <p className="text-gray-500 text-sm mb-5">
                Залиште контакти — уточнимо деталі та домовимося про час.
              </p>
              <GeneralContactForm source={`/services/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
