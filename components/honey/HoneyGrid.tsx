import Link from 'next/link'
import { HoneyCard } from './HoneyCard'
import type { HoneyProduct } from '@/types'

interface HoneyGridProps {
  products: HoneyProduct[]
}

const STATIC_HONEY: HoneyProduct[] = [
  {
    id: 'static-1', slug: 'akatsiya', name: 'Акацієвий мед', variety: 'Акація',
    description: null,
    short_description: 'Ніжний, прозорий мед з білої акації. Один з найм\'якших сортів — не перебиває смаки.',
    full_description: null, aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 320, price_glass_uah: 360,
    is_featured: true, in_stock: true, display_order: 1,
    image_url: '/images/dacha-tv/honey/acacia-honey-01.jpg',
    image_alt: 'Акацієвий мед від пасіки Дача TV', youtube_video_link: null,
  },
  {
    id: 'static-2', slug: 'lypa', name: 'Липовий мед', variety: 'Липа',
    description: null,
    short_description: 'Класичний ароматний мед із липи. Насичений і теплий — саме такий, яким уявляють домашній мед.',
    full_description: null, aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 290, price_glass_uah: 330,
    is_featured: true, in_stock: true, display_order: 2,
    image_url: '/images/dacha-tv/honey/linden-honey-01.jpg',
    image_alt: 'Липовий мед від пасіки Дача TV', youtube_video_link: null,
  },
  {
    id: 'static-3', slug: 'sonyakh', name: 'Соняшниковий мед', variety: 'Сонях',
    description: null,
    short_description: 'Яскравий золотистий мед із соняшника. Насичений і ситний — класика для щоденного вживання.',
    full_description: null, aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 240, price_glass_uah: 280,
    is_featured: true, in_stock: true, display_order: 3,
    image_url: '/images/dacha-tv/honey/sunflower-honey-01.jpg',
    image_alt: 'Соняшниковий мед від пасіки Дача TV', youtube_video_link: null,
  },
  {
    id: 'static-4', slug: 'riznotravya', name: "Мед різнотрав'я", variety: "Різнотрав'я",
    description: null,
    short_description: "Збірний мед із польового різнотрав'я Харківщини. Кожна партія — трохи своя.",
    full_description: null, aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 270, price_glass_uah: 310,
    is_featured: false, in_stock: true, display_order: 4,
    image_url: '/images/dacha-tv/honey/wildflower-honey-01.jpg',
    image_alt: "Різнотравний мед від пасіки Дача TV", youtube_video_link: null,
  },
  {
    id: 'static-5', slug: 'sadovyi', name: 'Садовий мед', variety: 'Сади',
    description: null,
    short_description: 'Весняний мед із садових культур — яблунь, груш, черешні. М\'який, ніжний, рання партія.',
    full_description: null, aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 280, price_glass_uah: 320,
    is_featured: false, in_stock: true, display_order: 5,
    image_url: '/images/dacha-tv/honey/orchard-honey-01.jpg',
    image_alt: 'Садовий мед від пасіки Дача TV', youtube_video_link: null,
  },
  {
    id: 'static-6', slug: 'lisovyi', name: 'Лісовий мед', variety: 'Ліс',
    description: null,
    short_description: 'Темний насичений мед із лісових джерел. Складний характер — для тих, хто знає, чого хоче.',
    full_description: null, aroma_notes: null, taste_notes: null, color_note: null,
    crystallization_note: null, recommended_use: null, packaging_note: null,
    packaging: ['1 л пластик', '1 л скло'],
    price_plastic_uah: 330, price_glass_uah: 370,
    is_featured: false, in_stock: true, display_order: 6,
    image_url: '/images/dacha-tv/honey/forest-honey-01.jpg',
    image_alt: 'Лісовий мед від пасіки Дача TV', youtube_video_link: null,
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
