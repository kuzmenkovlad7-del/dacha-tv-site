import { defineField, defineType } from 'sanity'

export const homepageConfig = defineType({
  name: 'homepageConfig',
  title: 'Налаштування головної сторінки',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTagline',
      title: 'Головний слоган (герой)',
      type: 'string',
      description: 'Великий заголовок у верхній секції. Наприклад: Справжній мед. Від нашої пасіки — до вашого столу.',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Підзаголовок (герой)',
      type: 'string',
      description: 'Рядок під головним слоганом. Наприклад: Сімейна пасіка на Харківщині — без посередників, без домішок.',
    }),
    defineField({
      name: 'featuredProductIds',
      title: 'Рекомендовані сорти меду',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'honeyProduct' }],
        },
      ],
      description: 'Оберіть 3–4 сорти, які показуватимуться на головній. Якщо порожньо — відображаються перші за порядком',
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
