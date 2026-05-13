import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityClient } from './client'
import type { SanityImage } from '@/types'

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}
