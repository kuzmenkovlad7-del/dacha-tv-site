'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createApiaryProduct(formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const image_url = (formData.get('image_url') as string)?.trim() || null
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('apiary_products').insert({
    name: formData.get('name') as string,
    slug,
    description: formData.get('description') as string || null,
    short_description: formData.get('short_description') as string || null,
    full_description: formData.get('full_description') as string || null,
    composition: formData.get('composition') as string || null,
    usage_notes: formData.get('usage_notes') as string || null,
    storage_info: formData.get('storage_info') as string || null,
    packaging,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    weight_g: formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    in_stock: formData.get('in_stock') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    youtube_video_url: formData.get('youtube_video_url') as string || null,
    image_url,
    image_alt: formData.get('image_alt') as string || null,
  })

  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}

export async function updateApiaryProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const imageUrlRaw = formData.get('image_url') as string | null
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('apiary_products').update({
    name: formData.get('name') as string,
    slug,
    description: formData.get('description') as string || null,
    short_description: formData.get('short_description') as string || null,
    full_description: formData.get('full_description') as string || null,
    composition: formData.get('composition') as string || null,
    usage_notes: formData.get('usage_notes') as string || null,
    storage_info: formData.get('storage_info') as string || null,
    packaging,
    price_uah: formData.get('price_uah') ? parseFloat(formData.get('price_uah') as string) : null,
    weight_g: formData.get('weight_g') ? parseInt(formData.get('weight_g') as string) : null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    in_stock: formData.get('in_stock') === 'on',
    is_featured: formData.get('is_featured') === 'on',
    youtube_video_url: formData.get('youtube_video_url') as string || null,
    image_url: imageUrlRaw !== null ? (imageUrlRaw.trim() || null) : undefined,
    image_alt: formData.get('image_alt') as string || null,
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
