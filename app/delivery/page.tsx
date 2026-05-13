import type { Metadata } from 'next'
import { getDeliveryPage } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Доставка',
  description:
    "Доставка меду та продуктів пасіки по всій Україні — Нова Пошта, Укрпошта. Бджолопакети та вулики — самовивіз або індивідуальна домовленість.",
  openGraph: {
    title: 'Доставка | Дача TV',
    description: 'Умови доставки меду та продуктів пасіки',
  },
}

const STATIC_SECTIONS = [
  {
    heading: 'Мед та продукти пасіки',
    body: 'Відправляємо по всій Україні — Новою Поштою або Укрпоштою. Орієнтовний термін доставки: 1–3 робочих дні залежно від регіону. Мінімальне замовлення не встановлено.',
  },
  {
    heading: 'Упаковка для відправки',
    body: 'Банки упаковуються в захисну пінопластову або картонну упаковку, яка запобігає пошкодженням при транспортуванні. Скляні банки упаковуємо окремо з додатковим захистом.',
  },
  {
    heading: 'Міжнародна доставка',
    body: 'Можливе відправлення за кордон — уточнюйте при замовленні. Конкретні умови залежать від країни призначення та поточних регуляцій.',
  },
  {
    heading: 'Бджолопакети та вулики',
    body: 'Живі тварини та вулики відправляємо виключно самовивозом або індивідуальною домовленістю. Передача відбувається особисто в Коротичі, Харківська область, або за домовленістю.',
  },
  {
    heading: 'Оплата',
    body: 'Приймаємо оплату банківським переказом (Monobank) або готівкою при самовивозі. Оплата накладеним платежем також можлива при відправці Новою Поштою. Деталі уточнюйте при оформленні замовлення.',
  },
]

export default async function DeliveryPage() {
  const deliveryData = await getDeliveryPage().catch(() => null)

  const sections =
    deliveryData?.sections && deliveryData.sections.length > 0
      ? deliveryData.sections
      : STATIC_SECTIONS

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-honey-50 border-b border-honey-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Доставка
          </h1>
          <p className="text-bark/70 text-lg max-w-xl">
            Інформація про відправку та способи отримання замовлення.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {sections.map((section, idx) => (
          <article key={idx} className="bg-white rounded-2xl p-6 border border-honey-100 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-bark mb-4">
              {section.heading}
            </h2>
            <div className="text-bark/80 leading-relaxed">
              {typeof section.body === 'string' ? (
                <p>{section.body}</p>
              ) : (
                Array.isArray(section.body) && section.body.length > 0 ? (
                  <p>{section.body.map((b) =>
                    typeof b === 'object' && b !== null && 'children' in b
                      ? (b.children as Array<{ text: string }>)?.map((c) => c.text).join('')
                      : ''
                  ).join('\n')}</p>
                ) : null
              )}
            </div>
          </article>
        ))}

        {/* Questions CTA */}
        <div className="bg-honey-50 rounded-2xl p-6 border border-honey-200 text-center">
          <h2 className="font-serif text-xl font-bold text-bark mb-3">
            Є питання щодо доставки?
          </h2>
          <p className="text-bark/70 mb-4">
            Зателефонуйте або напишіть — відповімо швидко
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-honey-700 hover:bg-honey-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[48px]"
          >
            Зв&apos;язатись з нами
          </a>
        </div>
      </div>
    </div>
  )
}
