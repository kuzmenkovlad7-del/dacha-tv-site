import Link from 'next/link'
import { ProductCard } from './ProductCard'
import type { ApiaryProduct } from '@/types'

interface ProductGridProps {
  products: ApiaryProduct[]
}

const STATIC_PRODUCTS: ApiaryProduct[] = [
  {
    id: 'static-pollen',
    name: 'Квітковий пилок',
    slug: 'kvitkovyi-pylok',
    description: 'Зібраний бджолами з квіток і накопичений у вуликах. Містить білки, вітаміни та мінерали. Рекомендують як природну добавку до харчування.',
    short_description: 'Свіжий квітковий пилок від нашої пасіки. Природний джерело білків і вітамінів.',
    composition: 'Натуральний квітковий пилок.',
    usage_notes: 'Вживати по 1–2 чайні ложки на день, запиваючи водою або медом. Зберігати в холодильнику.',
    storage_info: 'Зберігати при температурі 0–4°C. Термін придатності — 12 місяців.',
    weight_g: null,
    is_featured: false,
    gallery_images: null,
    packaging: ['100 г', '250 г'],
    in_stock: true,
    display_order: 1,
    image_url: null,
    image_alt: null,
  },
  {
    id: 'static-propolis',
    name: 'Прополіс',
    slug: 'propolis',
    description: 'Смолиста речовина, яку бджоли виробляють для захисту вулика. Відомий антибактеріальними властивостями. Натуральний або у вигляді настоянки.',
    short_description: 'Натуральний прополіс від пасіки — у шматках або у вигляді спиртової настоянки.',
    composition: 'Натуральний прополіс.',
    usage_notes: 'Настоянку застосовують при застуді, ангіні, для підвищення імунітету. Природній прополіс жують або додають до страв.',
    storage_info: 'Зберігати в прохолодному темному місці. Настоянка — при кімнатній температурі.',
    weight_g: null,
    is_featured: false,
    gallery_images: null,
    packaging: ['10 г', '20 г'],
    in_stock: true,
    display_order: 2,
    image_url: null,
    image_alt: null,
  },
  {
    id: 'static-nuts',
    name: 'Горіхи в меду',
    slug: 'horixy-v-medu',
    description: 'Скляна банка горіхів, залитих свіжим медом нашої пасіки. Чудовий подарунок або корисний перекус.',
    short_description: 'Суміш горіхів у натуральному меді нашої пасіки. Ідеально як подарунок або перекус.',
    composition: 'Суміш горіхів (волоський горіх, мигдаль, кешью), мед натуральний.',
    usage_notes: 'Вживати як самостійний десерт або додавати до каші, йогурту, сиру.',
    storage_info: 'Зберігати при кімнатній температурі в закритому вигляді. Термін придатності — 12 місяців.',
    weight_g: null,
    is_featured: false,
    gallery_images: null,
    packaging: ['200 мл скло'],
    in_stock: true,
    display_order: 3,
    image_url: null,
    image_alt: null,
  },
]

export function ProductGrid({ products }: ProductGridProps) {
  const displayProducts = products.length > 0 ? products : STATIC_PRODUCTS

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-bark/50 text-sm">
            Наявність та ціни уточнюйте за телефоном або через{' '}
            <Link href="/contact" className="text-honey-700 underline hover:no-underline">
              форму замовлення
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}
