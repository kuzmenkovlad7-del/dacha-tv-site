'use server'

import { revalidatePath } from 'next/cache'
import { getAdminClient } from '@/lib/supabase/admin'
import { STATIC_HONEY } from '@/lib/static-catalog'
import { STATIC_FLOWERS } from '@/lib/flowers-static'
import { STATIC_APIARY, STATIC_APIARY_SLUGS, STATIC_BEEKEEPER, STATIC_BEEKEEPER_SLUGS } from '@/lib/static-apiary'

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

// Backfill image_url/alt for rows currently NULL — preserves admin-uploaded media on repeat syncs
async function backfillNullMedia(
  client: ReturnType<typeof getAdminClient>,
  table: string,
  items: Array<{ slug: string; image_url?: string | null; image_alt?: string | null }>,
): Promise<void> {
  for (const item of items) {
    if (!item.image_url) continue
    await client
      .from(table)
      .update({ image_url: item.image_url, image_alt: item.image_alt ?? null })
      .eq('slug', item.slug)
      .is('image_url', null)
  }
}

export async function syncCatalog(): Promise<SyncResult> {
  const details: Record<string, string> = {}
  const missingTables: string[] = []

  try {
    const client = getAdminClient()

    // Honey — upsert catalog fields only (strip media so admin uploads are never overwritten)
    const honeyRows = STATIC_HONEY.map(({
      id: _id, created_at: _ca, updated_at: _ua,
      image_url: _img, image_alt: _alt, youtube_video_link: _yt,
      ...rest
    }) => rest)
    const { error: he } = await client
      .from('honey_products')
      .upsert(honeyRows, { onConflict: 'slug', ignoreDuplicates: false })
    if (!he) await backfillNullMedia(client, 'honey_products', STATIC_HONEY)
    details.honey = he ? `Помилка: ${he.message}` : `Синхронізовано ${honeyRows.length} продуктів`

    // Apiary — delete stale non-canonical rows, then upsert canonical set (catalog fields only)
    const { data: existingApiary } = await client.from('apiary_products').select('slug')
    const staleApiary = (existingApiary ?? []).map((r: { slug: string }) => r.slug).filter((s) => !STATIC_APIARY_SLUGS.includes(s))
    if (staleApiary.length > 0) await client.from('apiary_products').delete().in('slug', staleApiary)
    const apiaryRows = STATIC_APIARY.map(({
      id: _id,
      image_url: _img, image_alt: _alt, gallery_images: _gal, youtube_video_url: _yt,
      ...rest
    }) => rest)
    const { error: ae } = await client
      .from('apiary_products')
      .upsert(apiaryRows, { onConflict: 'slug', ignoreDuplicates: false })
    if (!ae) await backfillNullMedia(client, 'apiary_products', STATIC_APIARY)
    details.apiary = ae ? `Помилка: ${ae.message}` : `Синхронізовано ${apiaryRows.length} продуктів`

    // Beekeeper — delete stale non-canonical rows, then upsert canonical set (catalog fields only)
    const { data: existingBeekeeper } = await client.from('beekeeper_products').select('slug')
    const staleBeekeeper = (existingBeekeeper ?? []).map((r: { slug: string }) => r.slug).filter((s) => !STATIC_BEEKEEPER_SLUGS.includes(s))
    if (staleBeekeeper.length > 0) await client.from('beekeeper_products').delete().in('slug', staleBeekeeper)
    const beekeeperRows = STATIC_BEEKEEPER.map(({
      id: _id,
      image_url: _img, image_alt: _alt, gallery_images: _gal, youtube_video_url: _yt,
      ...rest
    }) => rest)
    const { error: bke } = await client
      .from('beekeeper_products')
      .upsert(beekeeperRows, { onConflict: 'slug', ignoreDuplicates: false })
    details.beekeeper = bke ? `Помилка: ${bke.message}` : `Синхронізовано ${beekeeperRows.length} продуктів`

    // Flowers — upsert catalog fields only (50 entries; all have null image_url in static data)
    const flowerRows = STATIC_FLOWERS.map(({
      id: _id, created_at: _ca, updated_at: _ua,
      image_url: _img, image_alt: _alt, youtube_video_url: _yt,
      ...rest
    }) => rest)
    const { error: fe } = await client
      .from('flower_products')
      .upsert(flowerRows, { onConflict: 'slug', ignoreDuplicates: false })
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
