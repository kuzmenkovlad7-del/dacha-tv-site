import { CTAButton } from '@/components/shared/CTAButton'

export function BeekeeperTeaser() {
  return (
    <section className="py-16 md:py-20 bg-forest-900" aria-labelledby="beekeeper-teaser-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="beekeeper-teaser-heading" className="font-serif text-3xl md:text-4xl font-bold text-cream mb-4">
          Для пасічників
        </h2>
        <p className="text-cream/80 text-lg mb-4 max-w-2xl mx-auto">
          Ми пасічники, і розуміємо, що вам потрібно.
        </p>
        <p className="text-cream/70 mb-8 max-w-2xl mx-auto">
          Пропонуємо бджолопакети (Buckfast, Українська степова, Карніка), бджолосім&apos;ї та вулики — з індивідуальним підходом і без зайвих слів.
        </p>
        <CTAButton href="/beekeeper" variant="outline" className="border-cream/40 text-cream hover:bg-cream/10 hover:border-cream/60">
          Дізнатись більше
        </CTAButton>
      </div>
    </section>
  )
}
