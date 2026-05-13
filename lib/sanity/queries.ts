import { sanityClient } from './client'
import type {
  HoneyProduct,
  ApinaryProduct,
  BeekeeperProduct,
  FaqItem,
  Review,
  SiteConfig,
  HomepageConfig,
  DeliveryPage,
} from '@/types'

const revalidate = 60

export async function getAllHoneyProducts(): Promise<HoneyProduct[]> {
  return sanityClient.fetch(
    `*[_type == "honeyProduct"] | order(isFeatured desc, name asc) {
      _id, _type, name, slug, variety, description, packaging, isFeatured, inStock, image, youtubeVideoLink
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getHoneyProductBySlug(slug: string): Promise<HoneyProduct | null> {
  return sanityClient.fetch(
    `*[_type == "honeyProduct" && slug.current == $slug][0] {
      _id, _type, name, slug, variety, description, packaging, isFeatured, inStock, image, youtubeVideoLink
    }`,
    { slug },
    { next: { revalidate } }
  )
}

export async function getFeaturedProducts(): Promise<HoneyProduct[]> {
  return sanityClient.fetch(
    `*[_type == "honeyProduct" && isFeatured == true] | order(name asc) [0...4] {
      _id, _type, name, slug, variety, description, packaging, isFeatured, inStock, image, youtubeVideoLink
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getAllHoneySlugs(): Promise<Array<{ slug: { current: string } }>> {
  return sanityClient.fetch(
    `*[_type == "honeyProduct"] { slug }`,
    {},
    { next: { revalidate } }
  )
}

export async function getAllApinaryProducts(): Promise<ApinaryProduct[]> {
  return sanityClient.fetch(
    `*[_type == "apinaryProduct"] | order(name asc) {
      _id, _type, name, slug, description, packaging, inStock, image
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getAllBeekeeperProducts(): Promise<BeekeeperProduct[]> {
  return sanityClient.fetch(
    `*[_type == "beekeeperProduct"] | order(name asc) {
      _id, _type, name, slug, productType, description, breeds, seasonNote, image
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  return sanityClient.fetch(
    `*[_type == "faqItem"] | order(category asc, order asc) {
      _id, _type, question, answer, category, order
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getVisibleReviews(): Promise<Review[]> {
  return sanityClient.fetch(
    `*[_type == "review" && isVisible == true] | order(_createdAt desc) {
      _id, _type, reviewerName, city, quote, rating, isVisible
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return sanityClient.fetch(
    `*[_type == "siteConfig"][0] {
      _type, phone, telegramUrl, youtubeUrl, facebookUrl, instagramUrl, tiktokUrl,
      addressDisplay, addressFull
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getHomepageConfig(): Promise<HomepageConfig | null> {
  return sanityClient.fetch(
    `*[_type == "homepageConfig"][0] {
      _type, heroTagline, heroSubtext,
      "featuredProductIds": featuredProductIds[]->{
        _id, _type, name, slug, variety, description, packaging, isFeatured, inStock, image
      }
    }`,
    {},
    { next: { revalidate } }
  )
}

export async function getDeliveryPage(): Promise<DeliveryPage | null> {
  return sanityClient.fetch(
    `*[_type == "deliveryPage"][0] {
      _type, sections
    }`,
    {},
    { next: { revalidate } }
  )
}
