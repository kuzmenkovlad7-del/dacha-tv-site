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

function parseTextArray(formData: FormData, key: string): string[] {
  return (formData.getAll(key) as string[]).map((s) => s.trim()).filter(Boolean)
}

export async function createHoneyProduct(formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('honey_products').insert({
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string).trim(),
    variety: formData.get('variety') as string,
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
    in_stock: formData.get('in_stock') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    youtube_video_link: (formData.get('youtube_video_link') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images: parseTextArray(formData, 'gallery_images'),
  })

  revalidatePath('/honey', 'layout')
  revalidatePath('/')
  redirect('/admin/honey')
}

export async function updateHoneyProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const image_url = await resolveImageUrl(formData)
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('honey_products').update({
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string).trim(),
    variety: formData.get('variety') as string,
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
    in_stock: formData.get('in_stock') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    youtube_video_link: (formData.get('youtube_video_link') as string) || null,
    youtube_video_urls: parseTextArray(formData, 'youtube_video_urls'),
    image_url,
    image_alt: (formData.get('image_alt') as string) || null,
    gallery_images: parseTextArray(formData, 'gallery_images'),
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
