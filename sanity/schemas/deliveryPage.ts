import { defineField, defineType } from 'sanity'

export const deliveryPage = defineType({
  name: 'deliveryPage',
  title: 'Сторінка доставки',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Розділи',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Заголовок',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Текст',
              type: 'array',
              of: [{ type: 'block' }],
            }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Сторінка доставки' }
    },
  },
})
