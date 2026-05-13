import type { Metadata } from 'next'
import { getAllFaqItems } from '@/lib/sanity/queries'
import { StructuredData } from '@/components/shared/StructuredData'
import type { FaqCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Часті запитання',
  description:
    'Відповіді на часті запитання про мед, замовлення, доставку та бджільництво від пасіки Дача TV на Харківщині.',
  openGraph: {
    title: 'FAQ | Дача TV',
    description: 'Часті запитання про мед, доставку та бджільництво',
  },
}

const STATIC_FAQ: Array<{ question: string; answer: string; category: FaqCategory; order: number; _id: string; _type: 'faqItem' }> = [
  // Products
  { _id: 's1', _type: 'faqItem', category: 'products', order: 1, question: 'Чи є у вашому меді цукор або домішки?', answer: 'Ні. Ми не додаємо нічого зайвого — жодного цукру, підсолоджувачів або ароматизаторів. Тільки натуральний мед, зібраний бджолами з квіток.' },
  { _id: 's2', _type: 'faqItem', category: 'products', order: 2, question: 'Як правильно зберігати мед?', answer: 'Зберігайте в прохолодному темному місці при температурі 10–20°C. Не тримайте в холодильнику — зайва вологість не корисна для меду. Скляна банка краще за пластик для довготривалого зберігання.' },
  { _id: 's3', _type: 'faqItem', category: 'products', order: 3, question: 'Чому мед закристалізувався? Це нормально?', answer: 'Так, це абсолютно нормально і є ознакою натурального меду. Кристалізація не погіршує якість. Якщо хочете рідкий мед — злегка підігрійте на водяній бані при температурі не вище 40°C.' },
  { _id: 's4', _type: 'faqItem', category: 'products', order: 4, question: 'Який мед найкраще підходить для подарунка?', answer: 'Акація — найпопулярніший подарунковий вибір через ніжний смак і повільну кристалізацію. Скляна банка виглядає особливо гарно. Горіхи в меду — ще один чудовий варіант для подарунка.' },
  { _id: 's5', _type: 'faqItem', category: 'products', order: 5, question: 'Яка різниця між скляною та пластиковою тарою?', answer: 'Скло — кращий вибір для тривалого зберігання і подарунків. Пластик — легший, дешевший у доставці, зручніший для щоденного використання. Мед в обох варіантах ідентичний за якістю.' },
  // Ordering
  { _id: 's6', _type: 'faqItem', category: 'ordering', order: 1, question: 'Як зробити замовлення?', answer: 'Оберіть продукт на сайті, заповніть форму або зателефонуйте нам напряму. Ми зв\'яжемося з вами протягом кількох годин для підтвердження та узгодження деталей.' },
  { _id: 's7', _type: 'faqItem', category: 'ordering', order: 2, question: 'Яка мінімальна кількість для замовлення?', answer: 'Мінімальна кількість не встановлена. Можна замовити навіть одну банку. При замовленні від кількох одиниць обговоримо умови індивідуально.' },
  { _id: 's8', _type: 'faqItem', category: 'ordering', order: 3, question: 'Чи можна замовити оптом?', answer: 'Так, оптові замовлення розглядаємо. Зв\'яжіться з нами для обговорення умов і наявності.' },
  { _id: 's9', _type: 'faqItem', category: 'ordering', order: 4, question: 'Чи можливий самовивіз?', answer: 'Так, самовивіз можливий у Коротичі, Харківська область. Уточніть зручний час при замовленні.' },
  // Delivery
  { _id: 's10', _type: 'faqItem', category: 'delivery', order: 1, question: 'В які регіони ви відправляєте?', answer: 'По всій Україні — Новою Поштою або Укрпоштою. Відправляємо в усі регіони, де доступна служба доставки.' },
  { _id: 's11', _type: 'faqItem', category: 'delivery', order: 2, question: 'Скільки коштує доставка?', answer: 'Вартість доставки розраховується за тарифами Нової Пошти або Укрпошти і залежить від ваги та адреси. Уточнюємо при оформленні замовлення.' },
  { _id: 's12', _type: 'faqItem', category: 'delivery', order: 3, question: 'Чи можете ви відправити за кордон?', answer: 'Відправлення за кордон можливе — уточнюйте при замовленні. Умови залежать від країни та поточних регуляцій.' },
  { _id: 's13', _type: 'faqItem', category: 'delivery', order: 4, question: 'Як упакований мед для відправлення?', answer: 'Банки упаковуємо в захисну упаковку, яка запобігає пошкодженням. Скляні банки додатково фіксуємо. Ви отримаєте товар у цілості.' },
  // Beekeeping
  { _id: 's14', _type: 'faqItem', category: 'beekeeping', order: 1, question: 'Коли доступні бджолопакети?', answer: 'Бджолопакети доступні навесні та влітку — зазвичай з квітня по серпень. Точні терміни залежать від сезону. Радимо залишати заявку завчасно.' },
  { _id: 's15', _type: 'faqItem', category: 'beekeeping', order: 2, question: 'Які породи бджіл ви продаєте?', answer: 'Продаємо бджолопакети порід Buckfast, Українська степова та Карніка. Кожна порода має свої особливості — підберемо під ваші умови.' },
  { _id: 's16', _type: 'faqItem', category: 'beekeeping', order: 3, question: 'Як відбувається передача бджолопакетів?', answer: 'Виключно самовивозом або за індивідуальною домовленістю — живих тварин не відправляємо поштою. Передача відбувається особисто, з поясненням особливостей конкретної сім\'ї.' },
  { _id: 's17', _type: 'faqItem', category: 'beekeeping', order: 4, question: 'Чи можна купити вулик з бджолами?', answer: 'Так, вулики з бджолами продаємо — за індивідуальною домовленістю. Залиште заявку для обговорення деталей.' },
]

const CATEGORY_LABELS: Record<FaqCategory, string> = {
  products: 'Про продукти',
  ordering: 'Замовлення',
  delivery: 'Доставка',
  beekeeping: 'Бджільництво',
}

const CATEGORIES: FaqCategory[] = ['products', 'ordering', 'delivery', 'beekeeping']

export default async function FaqPage() {
  const sanityItems = await getAllFaqItems().catch(() => [])
  const items = sanityItems.length > 0 ? sanityItems : STATIC_FAQ

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

      <div className="bg-honey-50 border-b border-honey-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Часті запитання
          </h1>
          <p className="text-bark/70 text-lg max-w-xl">
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
                    key={item._id}
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
