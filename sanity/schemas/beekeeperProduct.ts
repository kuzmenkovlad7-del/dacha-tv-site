import { defineField, defineType } from 'sanity'

export const beekeeperProduct = defineType({
  name: 'beekeeperProduct',
  title: 'Для пасічників',
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
      name: 'productType',
      title: 'Тип продукту',
      type: 'string',
      options: {
        list: [
          { title: 'Бджолопакети', value: 'bee_packages' },
          { title: "Бджолосім'ї", value: 'bee_colonies' },
          { title: 'Порожні вулики', value: 'empty_hives' },
          { title: 'Вулики з бджолами', value: 'hives_with_bees' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'breeds',
      title: 'Породи',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Тільки для бджолопакетів',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'seasonNote',
      title: 'Примітка щодо сезонності',
      type: 'string',
      description: 'Наприклад: Доступні навесні та влітку',
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
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'productType',
    },
  },
})
