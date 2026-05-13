'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function uploadImage(file: File, slug: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const client = getAdminClient()
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `apiary/${slug}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await client.storage
    .from('site-media')
    .upload(path, buffer, { contentType: file.type, upsert: true })
  if (error) return null
  const { data } = client.storage.from('site-media').getPublicUrl(path)
  return data.publicUrl
}

export async function createApiaryProduct(formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const imageFile = formData.get('image') as File | null
  let image_url: string | null = null
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadImage(imageFile, slug)
  }
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  await client.from('apiary_products').insert({
    name: formData.get('name') as string,
    slug,
    description: formData.get('description') as string || null,
    packaging,
    in_stock: formData.get('in_stock') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    image_url,
    image_alt: formData.get('image_alt') as string || null,
  })

  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}

export async function updateApiaryProduct(id: string, formData: FormData) {
  const client = getAdminClient()
  const slug = (formData.get('slug') as string).trim()
  const imageFile = formData.get('image') as File | null
  let image_url: string | undefined = undefined
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadImage(imageFile, slug)
    if (uploaded) image_url = uploaded
  }
  const packagingRaw = formData.get('packaging') as string
  const packaging = packagingRaw ? packagingRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

  const updates: Record<string, unknown> = {
    name: formData.get('name') as string,
    slug,
    description: formData.get('description') as string || null,
    packaging,
    in_stock: formData.get('in_stock') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 10,
    image_alt: formData.get('image_alt') as string || null,
    updated_at: new Date().toISOString(),
  }
  if (image_url !== undefined) updates.image_url = image_url

  await client.from('apiary_products').update(updates).eq('id', id)

  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}

export async function deleteApiaryProduct(id: string) {
  const client = getAdminClient()
  await client.from('apiary_products').delete().eq('id', id)
  revalidatePath('/products', 'layout')
  redirect('/admin/apiary')
}
