export type ProductStatus = 'available' | 'preorder' | 'out_of_stock' | 'archived'

export interface ProductMedia {
  id: string
  product_section: 'honey' | 'apiary' | 'beekeeper' | 'flowers'
  product_id: string
  media_type: 'image' | 'video' | 'youtube'
  url: string
  alt: string | null
  position: number
  is_primary: boolean
  created_at: string
}

export interface SiteSettings {
  id: number
  phone: string | null
  phone_secondary: string | null
  address_full: string | null
  address_display: string | null
  telegram_url: string | null
  youtube_url: string | null
  featured_youtube_video_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  hero_tagline: string | null
  hero_subtext: string | null
  updated_at: string
}

export interface HoneyProduct {
  id: string
  name: string
  slug: string
  variety: string
  description: string | null
  short_description: string | null
  full_description: string | null
  aroma_notes: string | null
  taste_notes: string | null
  color_note: string | null
  crystallization_note: string | null
  recommended_use: string | null
  packaging: string[] | null
  packaging_note: string | null
  price_plastic_uah: number | null
  price_glass_uah: number | null
  status: ProductStatus
  is_featured: boolean
  display_order: number
  image_url: string | null
  image_alt: string | null
  gallery_images?: string[] | null
  youtube_video_link: string | null
  youtube_video_urls?: string[] | null
  video_url?: string | null
  media?: ProductMedia[]
  created_at?: string
  updated_at?: string
}

export interface ApiaryProduct {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  full_description: string | null
  composition: string | null
  usage_notes: string | null
  storage_info: string | null
  packaging_note: string | null
  weight_g: number | null
  price_uah: number | null
  status: ProductStatus
  is_featured: boolean
  gallery_images: string[] | null
  packaging: string[] | null
  display_order: number
  image_url: string | null
  image_alt: string | null
  youtube_video_url: string | null
  youtube_video_urls?: string[] | null
  video_url?: string | null
  media?: ProductMedia[]
  created_at?: string
  updated_at?: string
}

export interface BeekeeperProduct {
  id: string
  name: string
  slug: string
  product_type: 'bee_packages' | 'bee_colonies' | 'empty_hives' | 'hives_with_bees' | 'apiary_supply'
  description: string | null
  full_description: string | null
  breeds: string[] | null
  season_note: string | null
  price_uah: number | null
  price_note: string | null
  status: ProductStatus
  is_featured: boolean
  image_url: string | null
  image_alt: string | null
  gallery_images?: string[] | null
  youtube_video_url: string | null
  youtube_video_urls?: string[] | null
  video_url?: string | null
  display_order: number
  media?: ProductMedia[]
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string
  reviewer_name: string
  city: string
  quote: string
  rating: number
  is_visible: boolean
  photo_url?: string | null
  created_at?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'products' | 'ordering' | 'delivery' | 'beekeeping'
  display_order: number
  created_at?: string
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  product: string | null
  message: string | null
  source: string | null
  status: string
  notes: string | null
  created_at: string
}

export interface FlowerProduct {
  id: string
  name: string
  slug: string
  category: string
  variety: string | null
  short_description: string | null
  full_description: string | null
  price_uah: number | null
  color: string | null
  bloom_season: string | null
  height_cm: number | null
  lighting: string | null
  packaging_note: string | null
  display_order: number
  status: ProductStatus
  is_featured: boolean
  image_url: string | null
  image_alt: string | null
  gallery_images?: string[] | null
  youtube_video_url: string | null
  youtube_video_urls?: string[] | null
  video_url?: string | null
  media?: ProductMedia[]
  created_at?: string
  updated_at?: string
}

export interface Service {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  price_uah: number | null
  price_note: string | null
  duration_note: string | null
  status: 'active' | 'inactive'
  is_featured: boolean
  display_order: number
  image_url: string | null
  created_at?: string
  updated_at?: string
}

// ─── Dropshipping / Supplier layer ────────────────────────────────────────
// Completely separate from dacha-tv own catalog (honey, apiary, beekeeper, flowers, services).

export interface SupplierCategory {
  id: string
  supplier_id: string
  name: string
  name_ua: string | null
  slug: string | null
  parent_supplier_id: string | null
  is_approved: boolean
  display_order: number
  raw_data?: Record<string, unknown> | null
  synced_at: string
  created_at: string
}

export interface SupplierProduct {
  id: string
  supplier_sku: string
  supplier_category_id: string | null
  name: string
  name_ua: string | null
  slug: string | null
  description: string | null
  description_ua: string | null
  short_description_ua: string | null
  price_uah: number | null
  our_price_uah: number | null
  stock_quantity: number
  is_in_stock: boolean
  main_image_url: string | null
  images: string[] | null
  attributes: Record<string, unknown> | null
  weight_kg: number | null
  is_approved: boolean
  is_published: boolean
  publish_priority: number
  meta_title: string | null
  meta_description: string | null
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export type CatalogProductStatus = 'published' | 'draft' | 'archived'

export interface CatalogCategory {
  id: string
  supplier_category_id: string | null
  slug: string
  name_ua: string
  description: string | null
  meta_title: string | null
  meta_description: string | null
  image_url: string | null
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface CatalogProduct {
  id: string
  supplier_product_id: string | null
  supplier_sku: string
  name_ua: string
  slug: string
  category_slug: string | null
  short_description: string | null
  description: string | null
  price_uah: number
  compare_price_uah: number | null
  main_image_url: string | null
  images: string[] | null
  attributes: Record<string, unknown> | null
  status: CatalogProductStatus
  is_featured: boolean
  display_order: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface SupplierSyncLog {
  id: string
  sync_type: string
  status: 'running' | 'completed' | 'failed' | 'stale'
  products_total: number
  products_new: number
  products_updated: number
  products_errors: number
  categories_total: number
  error_details: Record<string, unknown> | null
  triggered_by: string | null
  started_at: string
  completed_at: string | null
}

// Legacy type aliases kept for backward compatibility with admin components and inquiry actions
export type InquiryStatus = 'new' | 'contacted' | 'completed' | 'cancelled'
export type InquiryType = 'honey_order' | 'beekeeper_inquiry' | 'general' | 'flower_inquiry'

export interface InquiryData {
  type: InquiryType
  name: string
  phone: string
  product?: string
  packaging?: string
  breed?: string
  quantity?: string
  timing?: string
  message?: string
  source?: string
}
