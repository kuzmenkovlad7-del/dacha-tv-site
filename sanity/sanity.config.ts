import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'dacha-tv',
  title: 'Дача TV — CMS',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Контент')
          .items([
            S.listItem()
              .title('Мед')
              .child(S.documentTypeList('honeyProduct')),
            S.listItem()
              .title('Продукти пасіки')
              .child(S.documentTypeList('apinaryProduct')),
            S.listItem()
              .title('Для пасічників')
              .child(S.documentTypeList('beekeeperProduct')),
            S.listItem()
              .title('FAQ')
              .child(S.documentTypeList('faqItem')),
            S.listItem()
              .title('Відгуки')
              .child(S.documentTypeList('review')),
            S.divider(),
            S.listItem()
              .title('Головна сторінка')
              .child(
                S.document()
                  .schemaType('homepageConfig')
                  .documentId('homepageConfig')
              ),
            S.listItem()
              .title('Налаштування сайту')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
              ),
            S.listItem()
              .title('Сторінка доставки')
              .child(
                S.document()
                  .schemaType('deliveryPage')
                  .documentId('deliveryPage')
              ),
          ]),
    }),
  ],
  schema,
})
