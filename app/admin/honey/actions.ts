'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { uploadProductFile } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function autoSlug(name: string): string {
  const map: Record<string, string> = {
    а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
    и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
    р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'yu',я:'ya',
  }
  const slug = name.toLowerCase().split('').map((c) => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return slug || `honey-${Date.now()}`
}

async function resolveImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get('image_file') as File | null
  if (file && file.size > 0) {
    const result = await uploadProductFile(file)
    if ('url' in result) return result.url
  }
  return (formData.get('image_url') as string)?.trim() || null
}

async function resolveVideoUrl(formData: FormData): Promise<string | null> {
  const file = formData.get('video_file') as File | null
  if (file && file.size > 0) {
    const result = await uploadProductFile(file)
    if ('url' in result) return result.url
  }
  return (formData.get('video_url') as string)?.trim() || null
}

async function resolveGalleryImages(formData: FormData): Promise<string[]> {
  const count = Math.min(parseInt((formData.get('gallery_slot_count') as string) || '0', 10), 20)
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const file = formData.get(`gallery_file_${i}`) as File | null
    if (file && file.size > 0) {
      const res = await uploadProductFile(file)
      if ('url' in res) { result.push(res.url); continue }
    }
    const url = (formData.get(`gallery_url_${i}`) as string)?.trim()
    if (url) result.push(url)
  }
  return result
}

function parseTextArray(formData: FormData, key: string): string[] {
  return (formData.getAll(key) as string[]).map((s) => s.trim()).filter(Boolean)
}

export async function createHoneyProduct(formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const video_url = await resolveVideoUrl(formData)
  const gallery_images = await resolveGalleryImages(formData)
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null
  const slugRaw = (formData.get('slug') as string)?.trim()
  const name = formData.get('name') as string

  await client.from('honey_products').insert({
    name,
    slug: slugRaw || autoSlug(name),
    variety: (formData.get('variety') as string) || "Різнотрав'я",
    short_description: (formData.get('short_description') as string) || null,
    description: (formData.get('description') as string) || null,
    full_description: (formData.get('full_description') as string) || null,
    aroma_notes: (formData.get('aroma_notes') as string) || null,
    taste_notes: (formData.get('taste_notes') as string) || null,
    color_note: (formData.get('color_note') as string) || null,
    crystallization_note: (formData.get('crystallization_note') as string) || null,
    recommended_use: (formData.get('recommended_use') as string) || null,
    price_plastic_uah: formData.get('price_plastic_uah') ? parseInt(formData.get('price_plastic_uah') as string) : null,
    price_glass_uah: formData.get('price_glass_uah') ? parseInt(formData.get('price_glass_uah') as string) : null,
    packaging,
    is_featured: formData.get('is_featured') === 'on',
    status: (formData.get('status') as string) || 'available',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    youtube_video_link: (formData.get('youtube_video_link') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images,
    video_url,
  })

  revalidatePath('/honey', 'layout')
  revalidatePath('/')
  redirect('/admin/honey')
}

export async function updateHoneyProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const video_url = await resolveVideoUrl(formData)
  const gallery_images = await resolveGalleryImages(formData)
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null
  const name = formData.get('name') as string
  const slugRaw = (formData.get('slug') as string)?.trim()

  await client.from('honey_products').update({
    name,
    slug: slugRaw || autoSlug(name),
    variety: (formData.get('variety') as string) || "Різнотрав'я",
    short_description: (formData.get('short_description') as string) || null,
    description: (formData.get('description') as string) || null,
    full_description: (formData.get('full_description') as string) || null,
    aroma_notes: (formData.get('aroma_notes') as string) || null,
    taste_notes: (formData.get('taste_notes') as string) || null,
    color_note: (formData.get('color_note') as string) || null,
    crystallization_note: (formData.get('crystallization_note') as string) || null,
    recommended_use: (formData.get('recommended_use') as string) || null,
    price_plastic_uah: formData.get('price_plastic_uah') ? parseInt(formData.get('price_plastic_uah') as string) : null,
    price_glass_uah: formData.get('price_glass_uah') ? parseInt(formData.get('price_glass_uah') as string) : null,
    packaging,
    is_featured: formData.get('is_featured') === 'on',
    status: (formData.get('status') as string) || 'available',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    youtube_video_link: (formData.get('youtube_video_link') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images,
    video_url,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  revalidatePath('/honey', 'layout')
  revalidatePath('/')
  redirect('/admin/honey')
}

export async function deleteHoneyProduct(id: string) {
  const client = getAdminClient()
  await client.from('honey_products').delete().eq('id', id)
  revalidatePath('/honey', 'layout')
  revalidatePath('/')
  redirect('/admin/honey')
}
