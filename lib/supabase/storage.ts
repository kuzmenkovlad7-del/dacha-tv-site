import { getAdminClient } from './admin'

const BUCKET = 'product-media'

const ALLOWED_IMAGE = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif'])

export async function uploadProductFile(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_IMAGE.has(ext)) return { error: `Формат .${ext} не підтримується` }

  try {
    const client = getAdminClient()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await client.storage
      .from(BUCKET)
      .upload(name, file, { contentType: file.type, upsert: false })
    if (error) return { error: error.message }
    const {
      data: { publicUrl },
    } = client.storage.from(BUCKET).getPublicUrl(name)
    return { url: publicUrl }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}
