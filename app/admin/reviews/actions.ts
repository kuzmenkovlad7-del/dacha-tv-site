'use server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createReview(formData: FormData) {
  const client = getAdminClient()
  await client.from('reviews').insert({
    reviewer_name: formData.get('reviewer_name') as string,
    city: formData.get('city') as string,
    quote: formData.get('quote') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    is_visible: formData.get('is_visible') === 'on',
  })
  revalidatePath('/admin/reviews')
}

export async function deleteReview(id: string) {
  const client = getAdminClient()
  await client.from('reviews').delete().eq('id', id)
  revalidatePath('/admin/reviews')
}

export async function toggleReviewVisibility(id: string, currentValue: boolean) {
  const client = getAdminClient()
  await client.from('reviews').update({ is_visible: !currentValue }).eq('id', id)
  revalidatePath('/admin/reviews')
  revalidatePath('/')
}
