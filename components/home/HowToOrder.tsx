import { CTAButton } from '@/components/shared/CTAButton'
import { PhoneLink } from '@/components/shared/PhoneLink'
import type { SiteConfig } from '@/types'

interface HowToOrderProps {
  siteConfig: SiteConfig | null
}

const STEPS = [
  {
    number: '01',
    title: 'Оберіть мед або продукт',
    description: 'Перегляньте наш каталог і оберіть сорт меду або продукт пасіки, який вас цікавить.',
  },
  {
    number: '02',
    title: 'Залиште заявку або зателефонуйте',
    description: 'Заповніть коротку форму на сайті або зателефонуйте нам напряму — ми відповімо швидко.',
  },
  {
    number: '03',
    title: 'Отримайте замовлення',
    description: 'Відправимо Новою Поштою або Укрпоштою по всій Україні. Можливий самовивіз.',
  },
]

export function HowToOrder({ siteConfig }: HowToOrderProps) {
  return (
    <section className="py-16 md:py-24 bg-cream" aria-labelledby="how-to-order-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="how-to-order-heading" className="font-serif text-3xl md:text-4xl font-bold text-bark mb-4">
            Як замовити
          </h2>
          <p className="text-bark/60 text-lg">
            Усього три кроки — і мед у вас вдома
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-honey-100 border-2 border-honey-300 mb-4">
                <span className="font-serif font-bold text-honey-700 text-lg">
                  {step.number}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-bark mb-3">
                {step.title}
              </h3>
              <p className="text-bark/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <CTAButton href="/honey" size="lg">
            Перейти до каталогу
          </CTAButton>

          {siteConfig?.phone && (
            <div className="pt-4">
              <p className="text-bark/60 text-sm mb-2">Або зателефонуйте нам:</p>
              <PhoneLink
                phone={siteConfig.phone}
                showIcon
                className="text-2xl font-bold"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
