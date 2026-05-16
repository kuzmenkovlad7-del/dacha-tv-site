'use server'

import { revalidatePath } from 'next/cache'
import { getAdminClient } from '@/lib/supabase/admin'
import { STATIC_HONEY } from '@/lib/static-catalog'
import { STATIC_FLOWERS } from '@/lib/flowers-static'

// Canonical apiary products — slugs match production DB after migration 017
const CANONICAL_APIARY = [
  {
    name: 'Приманка для роїв',
    slug: 'swarm-lure',
    short_description: 'Готова приманка для приваблення бджолиних роїв у компактній зручній банці.',
    description: 'Приманка для роїв використовується в сезон роїння для підвищення шансів заселення пастки або підготовленого вулика.',
    full_description: 'Приманка для роїв використовується в сезон роїння для підвищення шансів заселення пастки або підготовленого вулика. Зручний формат банки дозволяє легко використовувати продукт у практичній роботі на пасіці.',
    usage_notes: 'Нанесіть невелику кількість на внутрішні стінки вулика-пастки за 1–2 дні до очікуваного роїння. Також обробіть льоток. Повторіть через тиждень за потреби.',
    storage_info: 'Зберігати в прохолодному темному місці при температурі до +20°C. Термін придатності — 2 роки.',
    packaging_note: 'Банка 35 г.',
    packaging: ['35 г'],
    weight_g: 35,
    price_uah: 180,
    image_url: '/images/dacha-tv/products/swarm-lure-01.jpg',
    image_alt: 'Приманка для роїв Dacha TV',
    is_featured: true,
    status: 'available',
    display_order: 1,
    youtube_video_url: null,
  },
  {
    name: 'Квітковий пилок',
    slug: 'flower-pollen',
    description: 'Натуральний квітковий пилок зібраний на нашій пасіці.',
    short_description: 'Свіжий квітковий пилок — джерело вітамінів, амінокислот та мікроелементів.',
    full_description: 'Квітковий пилок містить понад 250 біологічно активних речовин. Рекомендується для підтримки імунітету та загального оздоровлення організму.',
    composition: 'Натуральний квітковий пилок',
    usage_notes: 'Вживати по 1–2 чайні ложки на день, запиваючи водою або розчиняючи в меду.',
    storage_info: 'Зберігати в холодильнику або морозильній камері.',
    packaging_note: '50 г, 100 г',
    packaging: ['50 г', '100 г'],
    price_uah: 180,
    weight_g: 100,
    is_featured: false,
    status: 'available',
    display_order: 2,
    image_url: null,
    image_alt: 'Квітковий пилок Dacha TV',
    youtube_video_url: null,
  },
  {
    name: 'Прополіс',
    slug: 'propolis',
    description: 'Натуральний прополіс із нашої пасіки.',
    short_description: 'Натуральний прополіс — природний антисептик та імуностимулятор.',
    full_description: 'Прополіс має сильні антибактеріальні та антивірусні властивості. Використовується як природний антисептик і для підтримки імунної системи.',
    usage_notes: 'Вживати у вигляді настоянки або додавати до меду.',
    storage_info: 'Зберігати в прохолодному темному місці.',
    packaging_note: '20 г',
    packaging: ['20 г'],
    price_uah: 120,
    weight_g: 20,
    is_featured: false,
    status: 'available',
    display_order: 3,
    image_url: null,
    image_alt: 'Прополіс Dacha TV',
    youtube_video_url: null,
  },
  {
    name: 'Горіхи в меду',
    slug: 'nuts-in-honey',
    description: 'Суміш волоських горіхів і мигдалю в натуральному меду.',
    short_description: 'Волоські горіхи та мигдаль у натуральному меді — корисне та смачне ласощі.',
    full_description: 'Суміш відборних горіхів у натуральному меді. Енергетичний та поживний продукт, що поєднує корисні властивості меду та горіхів.',
    composition: 'Натуральний мед, волоські горіхи, мигдаль',
    usage_notes: 'Вживати по 1–2 столові ложки на день як самостійний десерт або з хлібом.',
    storage_info: 'Зберігати в прохолодному темному місці. Термін придатності — 12 місяців.',
    packaging_note: '200 г, 500 г',
    packaging: ['200 г', '500 г'],
    price_uah: 230,
    weight_g: 200,
    is_featured: false,
    status: 'available',
    display_order: 4,
    image_url: null,
    image_alt: 'Горіхи в меду Dacha TV',
    youtube_video_url: null,
  },
]

// Canonical beekeeper products — slugs match production DB after migration 018
const CANONICAL_BEEKEEPER = [
  {
    name: 'Бджолопакети',
    slug: 'bee-packages',
    product_type: 'bee_packages',
    description: 'Бджолопакети порід Buckfast та Карніка. Спокійні, продуктивні породи. Доступні з квітня по червень.',
    breeds: ['Buckfast', 'Карніка'],
    season_note: 'Доступні з квітня по червень',
    display_order: 1,
    status: 'available',
    image_url: null,
    image_alt: null,
    youtube_video_url: null,
  },
  {
    name: 'Бджолосімї',
    slug: 'bee-colonies',
    product_type: 'bee_colonies',
    description: 'Повноцінні бджолосімї у вуликах. Підходять для початківців і досвідчених пасічників.',
    breeds: ['Buckfast', 'Карніка'],
    season_note: 'Доступні з квітня по серпень',
    display_order: 2,
    status: 'available',
    image_url: null,
    image_alt: null,
    youtube_video_url: null,
  },
  {
    name: 'Порожні вулики',
    slug: 'empty-hives',
    product_type: 'empty_hives',
    description: 'Порожні вулики для самостійного заселення. Уточнюйте наявність та конструкцію.',
    breeds: null,
    season_note: null,
    display_order: 3,
    status: 'available',
    image_url: null,
    image_alt: null,
    youtube_video_url: null,
  },
]

const LAUNCH_SITE_SETTINGS = {
  id: 1,
  phone: '+380967657772',
  phone_secondary: '+380934665801',
  address_full: 'Коротич, Пісочинська ОТГ, Харківська область, Україна',
  address_display: 'Коротич, Харківська обл.',
  telegram_url: null,
  youtube_url: 'https://www.youtube.com/@dacha_tv',
  featured_youtube_video_url: 'https://www.youtube.com/watch?v=Qwmi6Igjp4I',
  instagram_url: 'https://instagram.com/dachatv.store',
  facebook_url: 'https://facebook.com/kyzmenko.sergej',
  tiktok_url: 'https://tiktok.com/@vladkuzmenkosxy',
  hero_tagline: 'Мед прямо з вулика',
  hero_subtext: 'Натуральний мед із сімейної пасіки на Харківщині. Збираємо, фасуємо та відправляємо особисто.',
}

export interface SyncResult {
  ok: boolean
  message: string
  details: Record<string, string>
  missingTables: string[]
}

// Full idempotent upsert of all catalog data — safe to run multiple times
export async function syncCatalogAction(): Promise<void> {
  await syncCatalog()
  revalidatePath('/admin/honey')
  revalidatePath('/admin/apiary')
  revalidatePath('/admin/flowers')
  revalidatePath('/admin/beekeeper')
}

export async function syncCatalog(): Promise<SyncResult> {
  const details: Record<string, string> = {}
  const missingTables: string[] = []

  try {
    const client = getAdminClient()

    // Honey — upsert by slug (6 products)
    const honeyRows = STATIC_HONEY.map(({ id: _id, created_at: _ca, updated_at: _ua, ...rest }) => rest)
    const { error: he } = await client
      .from('honey_products')
      .upsert(honeyRows, { onConflict: 'slug', ignoreDuplicates: true })
    details.honey = he ? `Помилка: ${he.message}` : `Синхронізовано ${honeyRows.length} продуктів`

    // Apiary — delete stale non-canonical rows, then upsert canonical set
    const canonicalApiarySlugs = CANONICAL_APIARY.map((p) => p.slug)
    const { data: existingApiary } = await client.from('apiary_products').select('slug')
    const staleApiary = (existingApiary ?? []).map((r: { slug: string }) => r.slug).filter((s) => !canonicalApiarySlugs.includes(s))
    if (staleApiary.length > 0) await client.from('apiary_products').delete().in('slug', staleApiary)
    const { error: ae } = await client
      .from('apiary_products')
      .upsert(CANONICAL_APIARY, { onConflict: 'slug', ignoreDuplicates: true })
    details.apiary = ae ? `Помилка: ${ae.message}` : `Синхронізовано ${CANONICAL_APIARY.length} продуктів`

    // Beekeeper — delete stale non-canonical rows, then upsert canonical set
    const canonicalBeekeeperSlugs = CANONICAL_BEEKEEPER.map((p) => p.slug)
    const { data: existingBeekeeper } = await client.from('beekeeper_products').select('slug')
    const staleBeekeeper = (existingBeekeeper ?? []).map((r: { slug: string }) => r.slug).filter((s) => !canonicalBeekeeperSlugs.includes(s))
    if (staleBeekeeper.length > 0) await client.from('beekeeper_products').delete().in('slug', staleBeekeeper)
    const { error: bke } = await client
      .from('beekeeper_products')
      .upsert(CANONICAL_BEEKEEPER, { onConflict: 'slug', ignoreDuplicates: true })
    details.beekeeper = bke ? `Помилка: ${bke.message}` : `Синхронізовано ${CANONICAL_BEEKEEPER.length} продуктів`

    // Flowers — upsert by slug (50 entries from STATIC_FLOWERS)
    const flowerRows = STATIC_FLOWERS.map(({ id: _id, created_at: _ca, updated_at: _ua, ...rest }) => rest)
    const { error: fe } = await client
      .from('flower_products')
      .upsert(flowerRows, { onConflict: 'slug', ignoreDuplicates: true })
    if (fe) {
      const isMissing = fe.message.includes('does not exist') || fe.message.includes('schema cache')
      if (isMissing) {
        missingTables.push('flower_products')
        details.flowers = 'ТАБЛИЦЯ ВІДСУТНЯ — потрібна міграція 016'
      } else {
        details.flowers = `Помилка: ${fe.message}`
      }
    } else {
      details.flowers = `Синхронізовано ${flowerRows.length} позицій`
    }

    // Site settings — upsert
    const { error: se } = await client
      .from('site_settings')
      .upsert(LAUNCH_SITE_SETTINGS, { onConflict: 'id', ignoreDuplicates: true })
    details.settings = se ? `Помилка: ${se.message}` : 'Синхронізовано'

    const allOk = Object.values(details).every((v) => !v.startsWith('Помилка'))
    return {
      ok: allOk,
      message: Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(' | '),
      details,
      missingTables,
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: msg, details: { error: msg }, missingTables: [] }
  }
}

// Legacy alias
export async function seedLaunchDataAction(): Promise<void> {
  await syncCatalogAction()
}

export async function seedLaunchData(): Promise<{ ok: boolean; message: string }> {
  const r = await syncCatalog()
  return { ok: r.ok, message: r.message }
}
