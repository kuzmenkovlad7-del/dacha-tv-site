import Link from 'next/link'
import { ProductCard } from './ProductCard'
import type { ApiaryProduct } from '@/types'

interface ProductGridProps {
  products: ApiaryProduct[]
}

const STATIC_PRODUCTS: ApiaryProduct[] = [
  {
    id: 'static-frey',
    name: 'Приманка для роїв Фрей',
    slug: 'frey-swarm-lure',
    description: 'Натуральна ефірна приманка для залучення та посадки бджолиних роїв.',
    short_description: 'Натуральна ефірна приманка для залучення бджолиних роїв. 35 г. Застосовується при ловлі та переселенні роїв.',
    full_description: 'Приманка для роїв Фрей — практичний інструмент для пасічника в роєвий сезон. Наноситься на стінки вулика-пастки або роїловні. Завдяки природним компонентам приваблює бджолині рої в радіусі до 500 метрів.',
    composition: null,
    usage_notes: 'Нанесіть невелику кількість на внутрішні стінки вулика-пастки за 1–2 дні до очікуваного роїння.',
    storage_info: 'Зберігати в прохолодному темному місці при температурі до +20°C. Термін придатності — 2 роки.',
    packaging_note: 'Флакон 35 г. Зручне дозування — крапельний розпилювач.',
    weight_g: 35,
    price_uah: 120,
    is_featured: true,
    gallery_images: null,
    packaging: ['35 г'],
    in_stock: true,
    display_order: 1,
    image_url: '/images/dacha-tv/products/frey-swarm-lure-01.jpg',
    image_alt: 'Приманка для роїв Фрей — натуральна ефірна, 35 г',
  },
  {
    id: 'static-pollen',
    name: 'Квітковий пилок',
    slug: 'kvitkovyi-pylok',
    description: 'Зібраний бджолами з квіток і накопичений у вуликах. Містить білки, вітаміни та мінерали.',
    short_description: 'Свіжий квітковий пилок від нашої пасіки.',
    full_description: null,
    composition: 'Натуральний квітковий пилок.',
    usage_notes: 'Вживати по 1–2 чайні ложки на день, запиваючи водою або медом.',
    storage_info: 'Зберігати при температурі 0–4°C. Термін придатності — 12 місяців.',
    packaging_note: null,
    weight_g: null,
    price_uah: null,
    is_featured: false,
    gallery_images: null,
    packaging: ['100 г', '250 г'],
    in_stock: true,
    display_order: 2,
    image_url: null,
    image_alt: null,
  },
  {
    id: 'static-propolis',
    name: 'Прополіс',
    slug: 'propolis',
    description: 'Смолиста речовина, яку бджоли виробляють для захисту вулика.',
    short_description: 'Натуральний прополіс від пасіки — у шматках або у вигляді спиртової настоянки.',
    full_description: null,
    composition: 'Натуральний прополіс.',
    usage_notes: 'Настоянку застосовують при застуді, ангіні. Природній прополіс жують або додають до страв.',
    storage_info: 'Зберігати в прохолодному темному місці.',
    packaging_note: null,
    weight_g: null,
    price_uah: null,
    is_featured: false,
    gallery_images: null,
    packaging: ['10 г', '20 г'],
    in_stock: true,
    display_order: 3,
    image_url: null,
    image_alt: null,
  },
  {
    id: 'static-nuts',
    name: 'Горіхи в меду',
    slug: 'horixy-v-medu',
    description: 'Скляна банка горіхів, залитих свіжим медом нашої пасіки.',
    short_description: 'Суміш горіхів у натуральному меді нашої пасіки. Ідеально як подарунок або перекус.',
    full_description: null,
    composition: 'Суміш горіхів (волоський горіх, мигдаль, кешью), мед натуральний.',
    usage_notes: 'Вживати як самостійний десерт або додавати до каші, йогурту, сиру.',
    storage_info: 'Зберігати при кімнатній температурі в закритому вигляді. Термін придатності — 12 місяців.',
    packaging_note: null,
    weight_g: null,
    price_uah: null,
    is_featured: false,
    gallery_images: null,
    packaging: ['200 мл скло'],
    in_stock: true,
    display_order: 4,
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
