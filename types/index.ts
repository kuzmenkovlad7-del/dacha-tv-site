// Shared TypeScript types for Дача TV

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface HoneyProduct {
  _id: string
  _type: 'honeyProduct'
  name: string
  slug: { current: string }
  variety: string
  description: PortableTextBlock[]
  packaging: string[]
  isFeatured: boolean
  inStock: boolean
  image: SanityImage
  youtubeVideoLink?: string
}

export interface ApinaryProduct {
  _id: string
  _type: 'apinaryProduct'
  name: string
  slug: { current: string }
  description: PortableTextBlock[]
  packaging: string[]
  inStock: boolean
  image?: SanityImage
}

export type BeekeeperProductType =
  | 'bee_packages'
  | 'bee_colonies'
  | 'empty_hives'
  | 'hives_with_bees'

export interface BeekeeperProduct {
  _id: string
  _type: 'beekeeperProduct'
  name: string
  slug: { current: string }
  productType: BeekeeperProductType
  description: PortableTextBlock[]
  breeds?: string[]
  seasonNote?: string
  image?: SanityImage
}

export type FaqCategory = 'products' | 'ordering' | 'delivery' | 'beekeeping'

export interface FaqItem {
  _id: string
  _type: 'faqItem'
  question: string
  answer: string
  category: FaqCategory
  order: number
}

export interface Review {
  _id: string
  _type: 'review'
  reviewerName: string
  city: string
  quote: string
  rating: number
  isVisible: boolean
}

export interface HomepageConfig {
  _type: 'homepageConfig'
  heroTagline: string
  heroSubtext: string
  featuredProductIds?: HoneyProduct[]
}

export interface SiteConfig {
  _type: 'siteConfig'
  phone: string
  telegramUrl?: string
  youtubeUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
  addressDisplay: string
  addressFull: string
}

export interface DeliverySection {
  _key: string
  heading: string
  body: PortableTextBlock[]
}

export interface DeliveryPage {
  _type: 'deliveryPage'
  sections: DeliverySection[]
}

// Portable text block type
export interface PortableTextBlock {
  _key: string
  _type: string
  children?: Array<{
    _key: string
    _type: string
    marks?: string[]
    text: string
  }>
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
  }>
  style?: string
}

// Inquiry types for Supabase
export type InquiryType = 'honey_order' | 'beekeeper_inquiry' | 'general'
export type InquiryStatus = 'new' | 'contacted' | 'completed' | 'cancelled'

export interface Inquiry {
  id: string
  created_at: string
  type: InquiryType
  name: string
  phone: string
  product?: string
  packaging?: string
  breed?: string
  quantity?: string
  timing?: string
  message?: string
  status: InquiryStatus
  admin_notes?: string
  notified_at?: string
}

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
}
