'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBeekeeperProduct(formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const breedsRaw = formData.get('breeds') as string
  const breeds = breedsRaw ? breedsRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('beekeeper_products').insert({
    name: formData.get('name') as string,
    slug,
    product_type: formData.get('product_type') as string,
    description: formData.get('description') as string || null,
    breeds,
    season_note: formData.get('season_note') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    image_url: formData.get('image_url') as string || null,
    youtube_video_url: formData.get('youtube_url') as string || null,
    image_alt: formData.get('image_alt') as string || null,
  })

  revalidatePath('/beekeeper', 'layout')
  redirect('/admin/beekeeper')
}

export async function updateBeekeeperProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const breedsRaw = formData.get('breeds') as string
  const breeds = breedsRaw ? breedsRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  const updates: Record<string, unknown> = {
    name: formData.get('name') as string,
    slug,
    product_type: formData.get('product_type') as string,
    description: formData.get('description') as string || null,
    breeds,
    season_note: formData.get('season_note') as string || null,
    display_order: parseInt(formData.get('display_order') as string) || 10,
    image_url: formData.get('image_url') as string || null,
    youtube_video_url: formData.get('youtube_url') as string || null,
    image_alt: formData.get('image_alt') as string || null,
    updated_at: new Date().toISOString(),
  }

  await client.from('beekeeper_products').update(updates).eq('id', id)

  revalidatePath('/beekeeper', 'layout')
  redirect('/admin/beekeeper')
}

export async function deleteBeekeeperProduct(id: string) {
  const client = getAdminClient()
  await client.from('beekeeper_products').delete().eq('id', id)
  revalidatePath('/beekeeper', 'layout')
  redirect('/admin/beekeeper')
}
