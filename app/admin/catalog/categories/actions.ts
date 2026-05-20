'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function publishCategoryAction(id: string): Promise<void> {
  const client = getAdminClient()
  await client.from('catalog_categories').update({ is_published: true }).eq('id', id)
  revalidatePath('/admin/catalog/categories')
  revalidatePath('/catalog')
}

export async function unpublishCategoryAction(id: string): Promise<void> {
  const client = getAdminClient()
  await client.from('catalog_categories').update({ is_published: false }).eq('id', id)
  revalidatePath('/admin/catalog/categories')
  revalidatePath('/catalog')
}
