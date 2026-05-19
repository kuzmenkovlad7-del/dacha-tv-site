'use server'

import { revalidatePath } from 'next/cache'
import {
  syncCatalogCategories,
  importProductsToCatalog,
  publishAllCatalogCategories,
  publishAllCatalogProducts,
  type SyncCategoriesResult,
  type ImportProductsResult,
  type PublishResult,
} from '@/lib/catalog/pipeline'

export async function syncCategoriesAction(): Promise<SyncCategoriesResult> {
  const result = await syncCatalogCategories()
  revalidatePath('/admin/catalog/pipeline')
  return result
}

export async function importProductsAction(limit: number): Promise<ImportProductsResult> {
  const result = await importProductsToCatalog(limit)
  revalidatePath('/admin/catalog/pipeline')
  return result
}

export async function publishCategoriesAction(): Promise<PublishResult> {
  const result = await publishAllCatalogCategories()
  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')
  return result
}

export async function publishProductsAction(): Promise<PublishResult> {
  const result = await publishAllCatalogProducts()
  revalidatePath('/admin/catalog/pipeline')
  revalidatePath('/catalog')
  return result
}
