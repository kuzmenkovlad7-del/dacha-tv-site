'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { uploadProductFile } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  const result: string[] = []
  for (let i = 0; i < 4; i++) {
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

export async function createApiaryProduct(formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const video_url = await resolveVideoUrl(formData)
  const gallery_images = await resolveGalleryImages(formData)
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('apiary_products').insert({
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string).trim(),
    description: (formData.get('description') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    full_description: (formData.get('full_description') as string) || null,
    composition: (formData.get('composition') as string) || null,
    usage_notes: (formData.get('usage_notes') as string) || null,
    storage_info: (formData.get('storage_info') as string) || null,
    packaging,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    weight_g: formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    in_stock: formData.get('in_stock') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    youtube_video_url: (formData.get('youtube_video_url') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images,
    video_url,
  })

  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}

export async function updateApiaryProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const video_url = await resolveVideoUrl(formData)
  const gallery_images = await resolveGalleryImages(formData)
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('apiary_products').update({
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string).trim(),
    description: (formData.get('description') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    full_description: (formData.get('full_description') as string) || null,
    composition: (formData.get('composition') as string) || null,
    usage_notes: (formData.get('usage_notes') as string) || null,
    storage_info: (formData.get('storage_info') as string) || null,
    packaging,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    weight_g: formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    in_stock: formData.get('in_stock') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    youtube_video_url: (formData.get('youtube_video_url') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images,
    video_url,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}

export async function deleteApiaryProduct(id: string) {
  const client = getAdminClient()
  await client.from('apiary_products').delete().eq('id', id)
  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}
