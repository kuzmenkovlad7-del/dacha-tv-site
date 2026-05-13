import { honeyProduct } from './schemas/honeyProduct'
import { apinaryProduct } from './schemas/apinaryProduct'
import { beekeeperProduct } from './schemas/beekeeperProduct'
import { faqItem } from './schemas/faqItem'
import { review } from './schemas/review'
import { homepageConfig } from './schemas/homepageConfig'
import { siteConfig } from './schemas/siteConfig'
import { deliveryPage } from './schemas/deliveryPage'

export const schema = {
  types: [
    honeyProduct,
    apinaryProduct,
    beekeeperProduct,
    faqItem,
    review,
    homepageConfig,
    siteConfig,
    deliveryPage,
  ],
}
