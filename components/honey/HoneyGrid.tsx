import Link from 'next/link'
import { HoneyCard } from './HoneyCard'
import type { HoneyProduct } from '@/types'

interface HoneyGridProps {
  products: HoneyProduct[]
}

const STATIC_HONEY: HoneyProduct[] = [
  {
    id: 'static-1', slug: 'acacia-honey', name: 'Акацієвий мед', variety: 'Акація',
    description: null,
    short_description: 'Ніжний, світлий мед із делікатним ароматом та повільною кристалізацією.',
    full_description: 'Акацієвий мед цінується за м\'який смак, світлий відтінок і легкий квітковий аромат. Це один із найбільш делікатних сортів, який довше залишається рідким і добре підходить для щоденного вживання.',
    aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 320, price_glass_uah: 360,
    is_featured: true, in_stock: true, display_order: 1,
    image_url: '/images/dacha-tv/honey/acacia-honey-01.jpg',
    image_alt: 'Акацієвий мед Dacha TV', youtube_video_link: null,
  },
  {
    id: 'static-2', slug: 'linden-honey', name: 'Липовий мед', variety: 'Липа',
    description: null,
    short_description: 'Класичний запашний мед із виразним ароматом липового цвіту.',
    full_description: 'Липовий мед має насичений аромат, характерний трав\'янисто-квітковий профіль і традиційно вважається одним із найулюбленіших сортів. Добре підходить до чаю та для домашнього запасу.',
    aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 300, price_glass_uah: 340,
    is_featured: true, in_stock: true, display_order: 2,
    image_url: '/images/dacha-tv/honey/linden-honey-01.jpg',
    image_alt: 'Липовий мед Dacha TV', youtube_video_link: null,
  },
  {
    id: 'static-3', slug: 'sunflower-honey', name: 'Соняшниковий мед', variety: 'Сонях',
    description: null,
    short_description: 'Насичений золотистий мед із виразним смаком і швидшою кристалізацією.',
    full_description: 'Соняшниковий мед має яскравий колір, щільнішу текстуру та характерний солодкий смак. Це популярний повсякденний сорт, добре знайомий багатьом покупцям.',
    aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 270, price_glass_uah: 310,
    is_featured: true, in_stock: true, display_order: 3,
    image_url: '/images/dacha-tv/honey/sunflower-honey-01.jpg',
    image_alt: 'Соняшниковий мед Dacha TV', youtube_video_link: null,
  },
  {
    id: 'static-4', slug: 'wildflower-honey', name: "Мед різнотрав'я", variety: "Різнотрав'я",
    description: null,
    short_description: "Багатий природний смак із поєднанням нектару різних польових рослин.",
    full_description: "Мед різнотрав'я збирається з багатьох літніх квітів, тому має багатший і глибший смаковий профіль. Кожна партія може мати свій характер залежно від сезону та медоносів.",
    aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 290, price_glass_uah: 330,
    is_featured: false, in_stock: true, display_order: 4,
    image_url: '/images/dacha-tv/honey/wildflower-honey-01.jpg',
    image_alt: "Мед різнотрав'я Dacha TV", youtube_video_link: null,
  },
  {
    id: 'static-5', slug: 'orchard-honey', name: 'Садовий мед', variety: 'Сади',
    description: null,
    short_description: "Ароматний мед із м'яким фруктово-квітковим характером.",
    full_description: "Садовий мед формується з весняного цвіту плодових дерев та інших садових медоносів. Він має приємний квітковий аромат і м'який смак, який добре підходить для сімейного столу.",
    aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 310, price_glass_uah: 350,
    is_featured: false, in_stock: true, display_order: 5,
    image_url: '/images/dacha-tv/honey/orchard-honey-01.jpg',
    image_alt: 'Садовий мед Dacha TV', youtube_video_link: null,
  },
  {
    id: 'static-6', slug: 'forest-honey', name: 'Лісовий мед', variety: 'Ліс',
    description: null,
    short_description: 'Глибший, більш насичений смак із виразним природним характером.',
    full_description: 'Лісовий мед зазвичай має темніший відтінок, більш глибокий аромат і насичений смак. Це добрий вибір для тих, хто любить більш яскравий медовий профіль.',
    aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 330, price_glass_uah: 370,
    is_featured: false, in_stock: true, display_order: 6,
    image_url: '/images/dacha-tv/honey/forest-honey-01.jpg',
    image_alt: 'Лісовий мед Dacha TV', youtube_video_link: null,
  },
]

export function HoneyGrid({ products }: HoneyGridProps) {
  const displayProducts = products.length > 0 ? products : STATIC_HONEY

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <HoneyCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-10 text-center text-bark/50 text-sm">
          Актуальна наявність і ціни — за телефоном або через{' '}
          <Link href="/contact" className="text-honey-700 underline hover:no-underline">
            форму замовлення
          </Link>
          .
        </p>
      )}
    </div>
  )
}
