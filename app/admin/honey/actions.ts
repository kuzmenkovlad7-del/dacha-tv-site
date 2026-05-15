'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createHoneyProduct(formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const image_url = (formData.get('image_url') as string || null) || null
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('honey_products').insert({
    name: formData.get('name') as string,
    slug,
    variety: formData.get('variety') as string,
    short_description: formData.get('short_description') as string || null,
    description: formData.get('description') as string || null,
    full_description: formData.get('full_description') as string || null,
    aroma_notes: formData.get('aroma_notes') as string || null,
    taste_notes: formData.get('taste_notes') as string || null,
    color_note: formData.get('color_note') as string || null,
    crystallization_note: formData.get('crystallization_note') as string || null,
    recommended_use: formData.get('recommended_use') as string || null,
    price_plastic_uah: formData.get('price_plastic_uah') ? parseInt(formData.get('price_plastic_uah') as string) : null,
    price_glass_uah: formData.get('price_glass_uah') ? parseInt(formData.get('price_glass_uah') as string) : null,
    packaging,
    is_featured: formData.get('is_featured') === 'on',
    in_stock: formData.get('in_stock') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    youtube_video_link: formData.get('youtube_video_link') as string || null,
    image_url,
    image_alt: formData.get('image_alt') as string || null,
  })

  revalidatePath('/honey', 'layout')
  revalidatePath('/')
  redirect('/admin/honey')
}

export async function updateHoneyProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const imageUrlRaw = formData.get('image_url') as string | null
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  const updates: Record<string, unknown> = {
    name: formData.get('name') as string,
    slug,
    variety: formData.get('variety') as string,
    short_description: formData.get('short_description') as string || null,
    description: formData.get('description') as string || null,
    full_description: formData.get('full_description') as string || null,
    aroma_notes: formData.get('aroma_notes') as string || null,
    taste_notes: formData.get('taste_notes') as string || null,
    color_note: formData.get('color_note') as string || null,
    crystallization_note: formData.get('crystallization_note') as string || null,
    recommended_use: formData.get('recommended_use') as string || null,
    price_plastic_uah: formData.get('price_plastic_uah') ? parseInt(formData.get('price_plastic_uah') as string) : null,
    price_glass_uah: formData.get('price_glass_uah') ? parseInt(formData.get('price_glass_uah') as string) : null,
    packaging,
    is_featured: formData.get('is_featured') === 'on',
    in_stock: formData.get('in_stock') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    youtube_video_link: formData.get('youtube_video_link') as string || null,
    image_url: imageUrlRaw !== null ? (imageUrlRaw.trim() || null) : undefined,
    image_alt: formData.get('image_alt') as string || null,
    updated_at: new Date().toISOString(),
  }

  await client.from('honey_products').update(updates).eq('id', id)

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
