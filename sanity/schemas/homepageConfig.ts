import { defineField, defineType } from 'sanity'

export const homepageConfig = defineType({
  name: 'homepageConfig',
  title: 'Налаштування головної сторінки',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTagline',
      title: 'Головний слоган',
      type: 'string',
      description: 'Наприклад: Справжній мед. Від нашої пасіки — до вашого столу.',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Підзаголовок героя',
      type: 'string',
      description: 'Наприклад: Сімейна пасіка на Харківщині.',
    }),
    defineField({
      name: 'featuredProductIds',
      title: 'Рекомендовані продукти',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'honeyProduct' }],
        },
      ],
      description: 'Виберіть до 4 продуктів для відображення на головній',
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: 'heroTagline',
    },
    prepare({ title }) {
      return { title: (title as string) || 'Налаштування головної' }
    },
  },
})
