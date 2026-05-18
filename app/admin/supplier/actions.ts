'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { syncSupplierCategories, syncSupplierProducts, syncPricesAndStock } from '@/lib/supplier/sync'

export async function syncCategoriesAction(): Promise<void> {
  await syncSupplierCategories()
  revalidatePath('/admin/supplier')
  redirect('/admin/supplier')
}

export async function syncProductsAction(): Promise<void> {
  await syncSupplierProducts({ pageSize: 1000 })
  revalidatePath('/admin/supplier')
  redirect('/admin/supplier')
}

export async function syncPricesAction(): Promise<void> {
  await syncPricesAndStock()
  revalidatePath('/admin/supplier')
  redirect('/admin/supplier')
}
