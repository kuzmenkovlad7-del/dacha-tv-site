'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function uploadImage(file: File, slug: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const client = getAdminClient()
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `flowers/${slug}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await client.storage
    .from('site-media')
    .upload(path, buffer, { contentType: file.type, upsert: true })
  if (error) return null
  const { data } = client.storage.from('site-media').getPublicUrl(path)
  return data.publicUrl
}

export async function createFlowerProduct(formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const imageFile = formData.get('image') as File | null
  const imagePath = (formData.get('image_path') as string)?.trim() || null
  let image_url: string | null = imagePath
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadImage(imageFile, slug)
  }

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
  const imageFile = formData.get('image') as File | null
  const imagePath = (formData.get('image_path') as string)?.trim() || null
  let image_url: string | undefined = undefined
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadImage(imageFile, slug)
    if (uploaded) image_url = uploaded
  } else if (imagePath) {
    image_url = imagePath
  }

  const updates: Record<string, unknown> = {
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
    image_alt: formData.get('image_alt') as string || null,
    updated_at: new Date().toISOString(),
  }
  if (image_url !== undefined) updates.image_url = image_url

  await client.from('flower_products').update(updates).eq('id', id)

  revalidatePath('/flowers', 'layout')
  redirect('/admin/flowers')
}

export async function deleteFlowerProduct(id: string) {
  const client = getAdminClient()
  await client.from('flower_products').delete().eq('id', id)
  revalidatePath('/flowers', 'layout')
  redirect('/admin/flowers')
}
