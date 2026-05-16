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
  return slug || `flower-${Date.now()}`
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

export async function createFlowerProduct(formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const video_url = await resolveVideoUrl(formData)
  const gallery_images = await resolveGalleryImages(formData)
  const name = formData.get('name') as string
  const slugRaw = (formData.get('slug') as string)?.trim()

  await client.from('flower_products').insert({
    name,
    slug: slugRaw || autoSlug(name),
    category: (formData.get('category') as string) || 'chrysanthemum',
    variety: (formData.get('variety') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    full_description: (formData.get('full_description') as string) || null,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    color: (formData.get('color') as string) || null,
    bloom_season: (formData.get('bloom_season') as string) || null,
    height_cm: formData.get('height_cm') ? parseInt(formData.get('height_cm') as string) : null,
    lighting: (formData.get('lighting') as string) || null,
    packaging_note: (formData.get('packaging_note') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    is_featured: formData.get('is_featured') === 'on',
    status: (formData.get('status') as string) || 'available',
    youtube_video_url: (formData.get('youtube_video_url') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images,
    video_url,
  })

  revalidatePath('/flowers', 'layout')
  redirect('/admin/flowers')
}

export async function updateFlowerProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const video_url = await resolveVideoUrl(formData)
  const gallery_images = await resolveGalleryImages(formData)
  const name = formData.get('name') as string
  const slugRaw = (formData.get('slug') as string)?.trim()

  await client.from('flower_products').update({
    name,
    slug: slugRaw || autoSlug(name),
    category: (formData.get('category') as string) || 'chrysanthemum',
    variety: (formData.get('variety') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    full_description: (formData.get('full_description') as string) || null,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    color: (formData.get('color') as string) || null,
    bloom_season: (formData.get('bloom_season') as string) || null,
    height_cm: formData.get('height_cm') ? parseInt(formData.get('height_cm') as string) : null,
    lighting: (formData.get('lighting') as string) || null,
    packaging_note: (formData.get('packaging_note') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    is_featured: formData.get('is_featured') === 'on',
    status: (formData.get('status') as string) || 'available',
    youtube_video_url: (formData.get('youtube_video_url') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images,
    video_url,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  revalidatePath('/flowers', 'layout')
  redirect('/admin/flowers')
}

export async function deleteFlowerProduct(id: string) {
  const client = getAdminClient()
  await client.from('flower_products').delete().eq('id', id)
  revalidatePath('/flowers', 'layout')
  redirect('/admin/flowers')
}
