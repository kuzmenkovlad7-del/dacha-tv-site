import { CTAButton } from '@/components/shared/CTAButton'

export function BrandStory() {
  return (
    <section className="py-16 md:py-24 bg-honey-50" aria-labelledby="brand-story-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder */}
          <div className="relative">
            <div
              className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-honey-200 to-honey-400 flex items-center justify-center"
              aria-label="Фото пасіки Дача TV — буде замінено на реальне фото"
            >
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-honey-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-honey-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <p className="text-honey-800 text-sm font-medium">
                  Тут буде реальне фото пасіки
                </p>
                <p className="text-honey-700 text-xs mt-1">
                  Коротич, Харківська область
                </p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 id="brand-story-heading" className="font-serif text-3xl md:text-4xl font-bold text-bark mb-6">
              Хто ми
            </h2>
            <div className="space-y-4 text-bark/80 leading-relaxed text-lg">
              <p>
                Ми — сімейна пасіка на Харківщині. Тримаємо бджіл вже багато років, і кожна баночка нашого меду — це результат власної праці від першого до останнього кроку.
              </p>
              <p>
                У нас немає посередників. Ми самі доглядаємо за вуликами, самі качаємо, самі пакуємо. Без додавання цукру, без підігріву, без змішування сортів. Тільки натуральний мед у той момент, коли він готовий.
              </p>
              <p>
                На YouTube-каналі ми відкрито показуємо всю нашу роботу — від підготовки вуликів навесні до фасування осіннього меду. Бо чесність у нашому виробництві — це не маркетинг, це спосіб роботи.
              </p>
            </div>
            <div className="mt-8">
              <CTAButton href="/about" variant="outline">
                Читати нашу історію
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
