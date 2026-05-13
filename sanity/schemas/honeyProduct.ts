import { defineField, defineType } from 'sanity'

export const honeyProduct = defineType({
  name: 'honeyProduct',
  title: 'Мед',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Назва',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variety',
      title: 'Сорт',
      type: 'string',
      description: 'Наприклад: Акація, Липа, Сонях',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'packaging',
      title: 'Упаковка',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Наприклад: 1L пластик, 1L скло',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Рекомендований',
      type: 'boolean',
      description: 'Показувати на головній сторінці',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'В наявності',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'image',
      title: 'Фото',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативний текст',
          type: 'string',
          description: 'Опис зображення для пошукових систем і доступності',
        }),
      ],
    }),
    defineField({
      name: 'youtubeVideoLink',
      title: 'Посилання на YouTube відео',
      type: 'url',
      description: "Необов'язково — відео безпосередньо про цей сорт меду",
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'variety',
    },
  },
})
