'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { STATIC_HONEY } from '@/lib/static-catalog'
import { STATIC_FLOWERS } from '@/lib/flowers-static'

const STATIC_FAQ = [
  { question: 'Як замовити мед?', answer: 'Ви можете залишити заявку на сайті або зателефонувати нам напряму. Ми уточнимо сорт, упаковку та спосіб доставки.', category: 'ordering', display_order: 1 },
  { question: 'Які сорти меду у вас є?', answer: "Наявність залежить від сезону. Основні сорти: акація, липа, сонях, різнотрав'я, садовий та лісовий мед.", category: 'products', display_order: 1 },
  { question: 'У якій упаковці доступний мед?', answer: '1 л пластик та 1 л скло.', category: 'products', display_order: 2 },
  { question: 'Чи є доставка по Україні?', answer: 'Так, ми відправляємо замовлення по Україні службами доставки.', category: 'delivery', display_order: 1 },
  { question: 'Чи можна замовити самовивіз?', answer: 'Так, деталі самовивозу узгоджуються під час оформлення.', category: 'delivery', display_order: 2 },
  { question: 'Як швидко ви відповідаєте?', answer: 'Зазвичай відповідаємо протягом кількох годин.', category: 'ordering', display_order: 2 },
  { question: 'Чи є у вас продукція для пасічників?', answer: 'Так, окрім меду, ми маємо продукцію для пасічників, зокрема приманку для роїв.', category: 'beekeeping', display_order: 1 },
  { question: 'Чи весь мед натуральний?', answer: 'Так, ми продаємо натуральний мед із власної сімейної пасіки.', category: 'products', display_order: 3 },
  { question: 'Чому деяких сортів може тимчасово не бути?', answer: 'Мед є сезонним продуктом, тому окремі сорти можуть бути недоступні в окремі періоди.', category: 'products', display_order: 4 },
  { question: 'Чи можна уточнити деталі перед замовленням?', answer: 'Так, ми завжди можемо проконсультувати перед оформленням заявки.', category: 'ordering', display_order: 3 },
]

const STATIC_APIARY = [
  {
    name: 'Бджолиний пилок',
    slug: 'bee-pollen',
    description: 'Натуральний бджолиний пилок зібраний на нашій пасіці.',
    short_description: 'Свіжий бджолиний пилок — джерело вітамінів, амінокислот та мікроелементів.',
    full_description: 'Бджолиний пилок містить понад 250 біологічно активних речовин. Рекомендується для підтримки імунітету та загального оздоровлення організму.',
    composition: 'Натуральний бджолиний пилок',
    usage_notes: 'Вживати по 1–2 чайні ложки на день, запиваючи водою або розчиняючи в меду.',
    storage_info: 'Зберігати в холодильнику або морозильній камері.',
    packaging_note: '50 г, 100 г',
    packaging: ['50 г', '100 г'],
    price_uah: 180,
    weight_g: 100,
    is_featured: true,
    in_stock: true,
    display_order: 1,
    image_url: null,
    image_alt: 'Бджолиний пилок Dacha TV',
    youtube_video_url: null,
  },
  {
    name: 'Прополіс',
    slug: 'propolis',
    description: 'Натуральний прополіс із нашої пасіки.',
    short_description: 'Натуральний прополіс — природний антисептик та імуностимулятор.',
    full_description: 'Прополіс має сильні антибактеріальні та антивірусні властивості. Використовується як природний антисептик і для підтримки імунної системи.',
    composition: 'Натуральний прополіс',
    usage_notes: 'Вживати у вигляді настоянки або додавати до меду.',
    storage_info: 'Зберігати в прохолодному темному місці.',
    packaging_note: '20 г',
    packaging: ['20 г'],
    price_uah: 120,
    weight_g: 20,
    is_featured: true,
    in_stock: true,
    display_order: 2,
    image_url: null,
    image_alt: 'Прополіс Dacha TV',
    youtube_video_url: null,
  },
  {
    name: 'Горіхи в меду',
    slug: 'nuts-in-honey',
    description: 'Натуральні горіхи заправлені медом із нашої пасіки.',
    short_description: 'Суміш горіхів у натуральному меду.',
    full_description: 'Горіхи в меду — смачний і корисний продукт. Ідеальний для сніданку або як поживний перекус.',
    composition: 'Волоський горіх, мигдаль, натуральний мед',
    usage_notes: 'Їсти по 1–2 столові ложки на день.',
    storage_info: 'Зберігати при кімнатній температурі в темному місці.',
    packaging_note: '200 г, 500 г',
    packaging: ['200 г', '500 г'],
    price_uah: 250,
    weight_g: 200,
    is_featured: false,
    in_stock: true,
    display_order: 3,
    image_url: null,
    image_alt: 'Горіхи в меду Dacha TV',
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

export async function seedLaunchDataAction(): Promise<void> {
  await seedLaunchData()
}

export async function seedLaunchData(): Promise<{ ok: boolean; message: string }> {
  try {
    const client = getAdminClient()
    const results: string[] = []

    // Seed honey products
    const { count: honeyCount } = await client
      .from('honey_products')
      .select('id', { count: 'exact', head: true })
    if ((honeyCount ?? 0) === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const honeyRows = STATIC_HONEY.map(({ id: _id, created_at: _ca, updated_at: _ua, ...rest }) => rest)
      const { error } = await client.from('honey_products').insert(honeyRows)
      if (error) results.push(`Мед: помилка — ${error.message}`)
      else results.push(`Мед: додано ${honeyRows.length} записів`)
    } else {
      results.push(`Мед: вже є ${honeyCount} записів`)
    }

    // Seed apiary products
    const { count: apiaryCount } = await client
      .from('apiary_products')
      .select('id', { count: 'exact', head: true })
    if ((apiaryCount ?? 0) === 0) {
      const { error } = await client.from('apiary_products').insert(STATIC_APIARY)
      if (error) results.push(`Продукти пасіки: помилка — ${error.message}`)
      else results.push(`Продукти пасіки: додано ${STATIC_APIARY.length} записів`)
    } else {
      results.push(`Продукти пасіки: вже є ${apiaryCount} записів`)
    }

    // Seed flower products
    const { count: flowerCount } = await client
      .from('flower_products')
      .select('id', { count: 'exact', head: true })
    if ((flowerCount ?? 0) === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const flowerRows = STATIC_FLOWERS.map(({ id: _id, created_at: _ca, updated_at: _ua, ...rest }) => rest)
      const { error } = await client.from('flower_products').insert(flowerRows)
      if (error) results.push(`Квіти: помилка — ${error.message}`)
      else results.push(`Квіти: додано ${flowerRows.length} записів`)
    } else {
      results.push(`Квіти: вже є ${flowerCount} записів`)
    }

    // Seed FAQ
    const { count: faqCount } = await client
      .from('faq_items')
      .select('id', { count: 'exact', head: true })
    if ((faqCount ?? 0) === 0) {
      const { error } = await client.from('faq_items').insert(STATIC_FAQ)
      if (error) results.push(`FAQ: помилка — ${error.message}`)
      else results.push(`FAQ: додано ${STATIC_FAQ.length} записів`)
    } else {
      results.push(`FAQ: вже є ${faqCount} записів`)
    }

    // Seed site settings
    const { count: settingsCount } = await client
      .from('site_settings')
      .select('id', { count: 'exact', head: true })
    if ((settingsCount ?? 0) === 0) {
      const { error } = await client.from('site_settings').insert(LAUNCH_SITE_SETTINGS)
      if (error) results.push(`Налаштування: помилка — ${error.message}`)
      else results.push('Налаштування: встановлено стартові значення')
    } else {
      results.push('Налаштування: вже налаштовано')
    }

    return { ok: true, message: results.join('; ') }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: msg }
  }
}
