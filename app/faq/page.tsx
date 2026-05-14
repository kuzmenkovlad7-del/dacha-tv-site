import type { Metadata } from 'next'
import { getAllFaqItems } from '@/lib/supabase/queries'
import { StructuredData } from '@/components/shared/StructuredData'
export const metadata: Metadata = {
  title: 'Часті запитання',
  description:
    'Відповіді на часті запитання про мед, замовлення, доставку та бджільництво від пасіки Дача TV на Харківщині.',
  openGraph: {
    title: 'FAQ | Дача TV',
    description: 'Часті запитання про мед, доставку та бджільництво',
  },
}

type FaqCategory = 'products' | 'ordering' | 'delivery' | 'beekeeping'

const CATEGORY_LABELS: Record<FaqCategory, string> = {
  products: 'Про продукти',
  ordering: 'Замовлення',
  delivery: 'Доставка',
  beekeeping: 'Бджільництво',
}

const CATEGORIES: FaqCategory[] = ['products', 'ordering', 'delivery', 'beekeeping']

import type { FaqItem } from '@/types'

const STATIC_FAQ: FaqItem[] = [
  { id: 's1', question: 'Мед натуральний чи є домішки?', answer: 'Так, мед натуральний — без підігрівання вище 40°C, без домішок і підсолоджувачів. Збираємо власноруч на нашій пасіці в Харківській області.', category: 'products', display_order: 1 },
  { id: 's2', question: 'Чому мед засахарився — це нормально?', answer: 'Так. Кристалізація — природний процес для справжнього незасміченого меду. Швидкість залежить від сорту: соняшниковий твердне за 2–4 тижні, акацієвий може залишатися рідким рік і більше. Закристалізований мед можна нагріти на водяній бані при температурі до 40°C — і він знову стане рідким.', category: 'products', display_order: 2 },
  { id: 's3', question: 'Яка різниця між пластиком і склом?', answer: 'Вміст однаковий. Пластикова банка легша і зручніша для відправки Новою Поштою — менше ризик пошкодження. Скляна банка краще виглядає як подарунок і не вбирає запахи. Ціна скляної трохи вища через вагу і вартість упаковки.', category: 'products', display_order: 3 },
  { id: 's4', question: 'Як зробити замовлення?', answer: 'Заповніть форму на сайті або зателефонуйте напряму. Ми відповідаємо протягом кількох годин. Після підтвердження домовляємося про оплату і відправку.', category: 'ordering', display_order: 1 },
  { id: 's5', question: 'Чи є мінімальна кількість для замовлення?', answer: 'Ні, мінімального обсягу немає. Можна замовити одну банку. Але чим більше — тим менше пропорційна вартість доставки.', category: 'ordering', display_order: 2 },
  { id: 's6', question: 'Чи є варіант подарункового пакування?', answer: 'Мед у скляній банці вже виглядає як подарунок. Якщо потрібне щось особливе — напишіть нам, щось придумаємо. Зазвичай ми можемо написати коротку записку або підготувати кілька сортів разом.', category: 'ordering', display_order: 3 },
  { id: 's7', question: 'Як ви доставляєте?', answer: 'Відправляємо Новою Поштою по всій Україні. Можливий також самовивіз із Коротича — погодьте час заздалегідь за телефоном.', category: 'delivery', display_order: 1 },
  { id: 's8', question: 'Скільки коштує доставка?', answer: 'Вартість залежить від обсягу і тарифів перевізника. Зазвичай це стандартний тариф НП за вагою відправлення. Ми завжди уточнюємо суму перед відправкою.', category: 'delivery', display_order: 2 },
  { id: 's9', question: 'Чи є у вас бджолопакети або бджолосім\'ї?', answer: 'Так. Вирощуємо та продаємо бджолопакети і бджолосім\'ї — Buckfast, Українська степова, Карніка. Також є вулики. Детальніше — на сторінці «Пасічникам» або за телефоном. Сезонна наявність, уточнюйте заздалегідь.', category: 'beekeeping', display_order: 1 },
  { id: 's10', question: 'Що таке приманка для роїв і коли вона потрібна?', answer: 'Приманка для роїв — ефірна речовина, яку наносять на вулик-пастку або роїловню, щоб привабити бджолиний рій. Актуальна у роєвий сезон навесні та влітку. Ми продаємо приманку Фрей — натуральну, без синтетики. Детальніше — на сторінці «Продукти пасіки».', category: 'beekeeping', display_order: 2 },
]

export default async function FaqPage() {
  const dbItems = await getAllFaqItems().catch(() => [])
  const items = dbItems.length > 0 ? dbItems : STATIC_FAQ

  // Build structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  // Group by category
  const grouped = CATEGORIES.reduce<Record<FaqCategory, typeof items>>(
    (acc, cat) => {
      acc[cat] = items.filter((item) => item.category === cat)
      return acc
    },
    { products: [], ordering: [], delivery: [], beekeeping: [] }
  )

  return (
    <div className="bg-cream min-h-screen">
      <StructuredData data={faqSchema} />

      <div className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-3 block">FAQ</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Часті запитання
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Відповіді на найпоширеніші запитання про наш мед, замовлення та доставку.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {CATEGORIES.map((cat) => {
          const catItems = grouped[cat]
          if (catItems.length === 0) return null

          return (
            <section key={cat} aria-labelledby={`faq-${cat}`}>
              <h2 id={`faq-${cat}`} className="font-serif text-2xl font-bold text-bark mb-6">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="space-y-3">
                {catItems.map((item) => (
                  <details
                    key={item.id}
                    className="bg-white rounded-xl border border-honey-100 shadow-sm overflow-hidden group"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-semibold text-bark hover:text-honey-700 transition-colors min-h-[56px]">
                      <span>{item.question}</span>
                      <svg
                        className="w-5 h-5 flex-shrink-0 text-bark/40 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 text-bark/80 leading-relaxed border-t border-honey-50 pt-4">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )
        })}

        {/* Still have questions? */}
        <div className="bg-honey-50 rounded-2xl p-6 border border-honey-200 text-center">
          <h2 className="font-serif text-xl font-bold text-bark mb-3">
            Не знайшли відповіді?
          </h2>
          <p className="text-bark/70 mb-4">
            Зателефонуйте або напишіть — відповімо на будь-яке питання
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
