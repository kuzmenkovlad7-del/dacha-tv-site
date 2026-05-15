import type { Metadata } from 'next'
import { BeekeeperSection } from '@/components/beekeeper/BeekeeperSection'
import { BeekeeperInquiryForm } from '@/components/forms/BeekeeperInquiryForm'
import { getAllBeekeeperProducts } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Для пасічників',
  description:
    "Бджолопакети (Buckfast, Українська степова, Карніка), бджолосім'ї та вулики від пасіки на Харківщині. Пряма комунікація з пасічником — без посередників.",
  openGraph: {
    title: 'Для пасічників | Дача TV',
    description: "Бджолопакети, бджолосім'ї та вулики від пасіки Дача TV",
  },
}

export default async function BeekeeperPage() {
  const products = await getAllBeekeeperProducts().catch(() => [])

  const packageProducts = products.filter((p) => p.product_type === 'bee_packages')
  const colonyProducts = products.filter((p) => p.product_type === 'bee_colonies')
  const hiveProducts = products.filter(
    (p) => p.product_type === 'empty_hives' || p.product_type === 'hives_with_bees'
  )

  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold text-honey-700 uppercase tracking-widest mb-3 block">Для пасічників</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bark mb-4">
            Бджолопакети та вулики
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Ми пасічники, і розуміємо, що вам потрібно. Пропонуємо бджолопакети, бджолосім&apos;ї та вулики — з індивідуальним підходом.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Product sections — main column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Bee Packages */}
            <section aria-labelledby="packages-heading">
              <h2 id="packages-heading" className="font-serif text-2xl md:text-3xl font-bold text-bark mb-6">
                Бджолопакети
              </h2>
              {packageProducts.length > 0 ? (
                <BeekeeperSection products={packageProducts} />
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-forest-100">
                  <p className="text-bark font-semibold mb-2">4-рамкові бджолопакети</p>
                  <p className="text-bark/70 mb-4 leading-relaxed">
                    Продаємо 4-рамкові пакети з молодою плідною маткою. Доступні породи:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Buckfast', 'Українська степова', 'Карніка'].map((breed) => (
                      <span
                        key={breed}
                        className="bg-forest-50 text-forest-700 border border-forest-200 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {breed}
                      </span>
                    ))}
                  </div>
                  <p className="text-bark/60 text-sm">
                    Сезон: весна — осінь. Доступність і вартість уточнюйте при замовленні.
                  </p>
                </div>
              )}
            </section>

            {/* Bee Colonies */}
            <section aria-labelledby="colonies-heading">
              <h2 id="colonies-heading" className="font-serif text-2xl md:text-3xl font-bold text-bark mb-6">
                Бджолосім&apos;ї
              </h2>
              {colonyProducts.length > 0 ? (
                <BeekeeperSection products={colonyProducts} />
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-forest-100">
                  <p className="text-bark font-semibold mb-2">
                    Бджолосім&apos;ї на 10–12 рамках
                  </p>
                  <p className="text-bark/70 leading-relaxed">
                    Продаємо сформовані бджолосім&apos;ї на дерев&apos;яних рамках. Сезонна наявність. Оптимально для розширення пасіки або старту.
                  </p>
                </div>
              )}
            </section>

            {/* Hives */}
            <section aria-labelledby="hives-heading">
              <h2 id="hives-heading" className="font-serif text-2xl md:text-3xl font-bold text-bark mb-6">
                Вулики
              </h2>
              {hiveProducts.length > 0 ? (
                <BeekeeperSection products={hiveProducts} />
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-forest-100">
                    <p className="text-bark font-semibold mb-2">Порожні вулики</p>
                    <p className="text-bark/70 leading-relaxed">
                      Дерев&apos;яні та ППУ вулики — Дадан 10-рамковий та багатокорпусні варіанти. Уточнюйте наявність та вартість.
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-forest-100">
                    <p className="text-bark font-semibold mb-2">Вулики з бджолами</p>
                    <p className="text-bark/70 leading-relaxed">
                      Повністю обладнані вулики з бджолосім&apos;ями — ідеально для старту. Деталі тільки за особистою домовленістю.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Important note */}
            <div className="bg-honey-50 rounded-2xl p-6 border border-honey-200">
              <h3 className="font-semibold text-bark mb-2">Важливо знати</h3>
              <p className="text-bark/70 text-sm leading-relaxed">
                Всі бджолопродукти — живі тварини зі складною сезонною логістикою. Ціни залежать від сезону, породи та кількості. Ми завжди повідомляємо про реальну наявність. Залиште заявку — і ми зв&apos;яжемося для обговорення деталей.
              </p>
            </div>
          </div>

          {/* Sticky inquiry form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-forest-50 rounded-2xl p-6 border border-forest-200">
                <h2 className="font-serif text-2xl font-bold text-bark mb-2">
                  Залишити заявку
                </h2>
                <p className="text-bark/60 text-sm mb-6">
                  Щоб дізнатись наявність та вартість — залиште заявку або зателефонуйте
                </p>
                <BeekeeperInquiryForm source="/beekeeper" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
