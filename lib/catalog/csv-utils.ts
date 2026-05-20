// Shared CSV + Google Sheets parsing utilities used by the pipeline and import pages.

export function autoSlug(text: string): string {
  const map: Record<string, string> = {
    а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
    и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
    р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'yu',я:'ya',
  }
  return text.toLowerCase().split('').map((c) => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`
}

export function normalizeSheetUrl(raw: string): string {
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return raw.trim()
  const sheetId = match[1]
  const gidMatch = raw.match(/[#&?]gid=(\d+)/)
  const gid = gidMatch ? gidMatch[1] : '0'
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
}

export function parseCsv(text: string): string[][] {
  const clean = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text
  const rows: string[][] = []
  const lines = clean.split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim()) continue
    const cols: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur.trim()); cur = ''
      } else {
        cur += ch
      }
    }
    cols.push(cur.trim())
    rows.push(cols)
  }
  return rows
}

// Maps normalized header string → internal field name.
// "id" is NOT mapped to "sku" when both ID and SKU columns are present.
export const HEADER_MAP: Record<string, string> = {
  sku: 'sku', article: 'sku', артикул: 'sku', supplier_sku: 'sku', код: 'sku',
  name: 'name', title: 'name', назва: 'name', наименование: 'name', name_ua: 'name', 'назва (укр)': 'name',
  price: 'price', ціна: 'price', цена: 'price', price_uah: 'price',
  stock: 'stock', quantity: 'stock', qty: 'stock', залишок: 'stock', кількість: 'stock', stock_quantity: 'stock', in_stock: 'stock',
  images: 'images', image: 'images', photo: 'images', фото: 'images', images_url: 'images', image_url: 'images',
  description: 'description', опис: 'description', description_ua: 'description',
  meta_title: 'meta_title', 'meta title': 'meta_title', 'seo title': 'meta_title',
  meta_description: 'meta_description', 'meta description': 'meta_description', 'seo description': 'meta_description',
  meta_keywords: 'meta_keywords', keywords: 'meta_keywords',
  category: 'category', categories: 'category', категорія: 'category', категории: 'category', категория: 'category',
}

// Normalize headers: if there is no SKU column but there is an ID column, treat ID as SKU.
export function normalizeHeaders(headers: string[]): string[] {
  const hasSku = headers.some((h) => HEADER_MAP[h.toLowerCase().trim()] === 'sku')
  const hasId = headers.some((h) => h.toLowerCase().trim() === 'id')
  if (!hasSku && hasId) {
    return headers.map((h) => (h.toLowerCase().trim() === 'id' ? 'SKU' : h))
  }
  return headers
}

export function getCol(row: string[], headers: string[], field: string): string {
  const idx = headers.findIndex((h) => HEADER_MAP[h.toLowerCase().trim()] === field)
  return idx >= 0 ? (row[idx] ?? '').trim() : ''
}

export async function fetchCsvText(rawUrl: string): Promise<{ ok: true; text: string; csvUrl: string } | { ok: false; error: string; csvUrl: string }> {
  const csvUrl = normalizeSheetUrl(rawUrl)
  try {
    const res = await fetch(csvUrl, { cache: 'no-store', headers: { Accept: 'text/csv,*/*' } })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, csvUrl }
    return { ok: true, text: await res.text(), csvUrl }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), csvUrl }
  }
}
