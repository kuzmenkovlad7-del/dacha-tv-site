'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createFlowerProduct(formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const image_url = (formData.get('image_url') as string)?.trim() || null

  await client.from('flower_products').insert({
    name: formData.get('name') as string,
    slug,
    category: formData.get('category') as string || 'chrysanthemum',
    variety: formData.get('variety') as string || null,
    short_description: formData.get('short_description') as string || null,
    full_description: formData.get('full_description') as string || null,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    color: formData.get('color') as string || null,
    bloom_season: formData.get('bloom_season') as string || null,
    height_cm: formData.get('height_cm') ? parseInt(formData.get('height_cm') as string) : null,
    lighting: formData.get('lighting') as string || null,
    packaging_note: formData.get('packaging_note') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    is_featured: formData.get('is_featured') === 'on',
    in_stock: formData.get('in_stock') === 'on',
    youtube_video_url: formData.get('youtube_video_url') as string || null,
    image_url,
    image_alt: formData.get('image_alt') as string || null,
  })

  revalidatePath('/flowers', 'layout')
  redirect('/admin/flowers')
}

export async function updateFlowerProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const imageUrlRaw = formData.get('image_url') as string | null

  await client.from('flower_products').update({
    name: formData.get('name') as string,
    slug,
    category: formData.get('category') as string || 'chrysanthemum',
    variety: formData.get('variety') as string || null,
    short_description: formData.get('short_description') as string || null,
    full_description: formData.get('full_description') as string || null,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    color: formData.get('color') as string || null,
    bloom_season: formData.get('bloom_season') as string || null,
    height_cm: formData.get('height_cm') ? parseInt(formData.get('height_cm') as string) : null,
    lighting: formData.get('lighting') as string || null,
    packaging_note: formData.get('packaging_note') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    is_featured: formData.get('is_featured') === 'on',
    in_stock: formData.get('in_stock') === 'on',
    youtube_video_url: formData.get('youtube_video_url') as string || null,
    image_url: imageUrlRaw !== null ? (imageUrlRaw.trim() || null) : undefined,
    image_alt: formData.get('image_alt') as string || null,
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
