export interface SiteSettings {
  id: number
  phone: string | null
  phone_secondary: string | null
  address_full: string | null
  address_display: string | null
  telegram_url: string | null
  youtube_url: string | null
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
  packaging: string[] | null
  is_featured: boolean
  in_stock: boolean
  display_order: number
  image_url: string | null
  image_alt: string | null
  youtube_video_link: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiaryProduct {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  composition: string | null
  usage_notes: string | null
  storage_info: string | null
  weight_g: number | null
  is_featured: boolean
  gallery_images: string[] | null
  packaging: string[] | null
  in_stock: boolean
  display_order: number
  image_url: string | null
  image_alt: string | null
  created_at?: string
  updated_at?: string
}

export interface BeekeeperProduct {
  id: string
  name: string
  slug: string
  product_type: 'bee_packages' | 'bee_colonies' | 'empty_hives' | 'hives_with_bees'
  description: string | null
  breeds: string[] | null
  season_note: string | null
  image_url: string | null
  image_alt: string | null
  display_order: number
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
  created_at: string
}

// Legacy type aliases kept for backward compatibility with admin components and inquiry actions
export type InquiryStatus = 'new' | 'contacted' | 'completed' | 'cancelled'
export type InquiryType = 'honey_order' | 'beekeeper_inquiry' | 'general'

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
