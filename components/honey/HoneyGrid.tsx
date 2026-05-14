import Link from 'next/link'
import { HoneyCard } from './HoneyCard'
import type { HoneyProduct } from '@/types'

interface HoneyGridProps {
  products: HoneyProduct[]
}

const STATIC_VARIETIES = [
  {
    slug: 'akatsiya',
    name: 'Акацієвий мед',
    variety: 'Акація',
    description: 'Ніжний, прозорий, один із найсвітліших сортів. Кристалізується дуже повільно — іноді залишається рідким до року.',
    packaging: ['1L пластик', '1L скло'],
    is_featured: true,
    in_stock: true,
    display_order: 1,
    image_url: null,
    image_alt: null,
    youtube_video_link: null,
    id: 'static-1',
  },
  {
    slug: 'lypa',
    name: 'Липовий мед',
    variety: 'Липа',
    description: 'Насичений квітковий аромат з легкою гірчинкою. Традиційно вважається найкориснішим — ідеальний при застуді.',
    packaging: ['1L пластик', '1L скло'],
    is_featured: true,
    in_stock: true,
    display_order: 2,
    image_url: null,
    image_alt: null,
    youtube_video_link: null,
    id: 'static-2',
  },
  {
    slug: 'sonyakh',
    name: 'Соняшниковий мед',
    variety: 'Сонях',
    description: 'Насичений, ситний. Кристалізується швидко — вже через 2–4 тижні після відкачки. Ідеальний для тривалого зберігання.',
    packaging: ['1L пластик', '1L скло'],
    is_featured: false,
    in_stock: true,
    display_order: 3,
    image_url: null,
    image_alt: null,
    youtube_video_link: null,
    id: 'static-3',
  },
  {
    slug: 'riznotravya',
    name: "Різнотравний мед",
    variety: "Різнотрав'я",
    description: "Складний багатошаровий смак від різноманіття польових квітів Харківщини. Кожна партія — трохи інша.",
    packaging: ['1L пластик', '1L скло'],
    is_featured: false,
    in_stock: true,
    display_order: 4,
    image_url: null,
    image_alt: null,
    youtube_video_link: null,
    id: 'static-4',
  },
] as HoneyProduct[]

export function HoneyGrid({ products }: HoneyGridProps) {
  const displayProducts = products.length > 0 ? products : STATIC_VARIETIES

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <HoneyCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-bark/50 text-sm">
            Актуальна наявність та ціни — за телефоном або в{' '}
            <Link href="/contact" className="text-honey-700 underline hover:no-underline">
              формі замовлення
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}
