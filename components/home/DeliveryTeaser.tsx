import { CTAButton } from '@/components/shared/CTAButton'

export function DeliveryTeaser() {
  return (
    <section className="py-16 md:py-20 bg-cream border-t border-honey-100" aria-labelledby="delivery-teaser-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="delivery-teaser-heading" className="font-serif text-3xl md:text-4xl font-bold text-bark mb-4">
            Доставка по Україні
          </h2>
          <p className="text-bark/60 text-lg">
            Ми на Харківщині, поруч із Харковом
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-honey-50 rounded-2xl p-6 border border-honey-200">
            <div className="w-10 h-10 bg-honey-200 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-honey-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-bark text-lg mb-2">Мед та продукти пасіки</h3>
            <p className="text-bark/70">
              Відправляємо по всій Україні — Новою Поштою або Укрпоштою. Надійна упаковка для безпечного транспортування.
            </p>
          </div>

          <div className="bg-forest-50 rounded-2xl p-6 border border-forest-200">
            <div className="w-10 h-10 bg-forest-200 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-bark text-lg mb-2">Бджолопакети та вулики</h3>
            <p className="text-bark/70">
              Самовивіз або індивідуальна домовленість з доставкою. Уточніть деталі при замовленні.
            </p>
          </div>
        </div>

        <div className="text-center">
          <CTAButton href="/delivery" variant="outline">
            Детальніше про доставку
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
