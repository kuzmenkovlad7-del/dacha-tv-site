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
      description: 'Наприклад: Бджолопакет Buckfast 4-рамковий',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Натисніть "Generate" — заповниться автоматично',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productType',
      title: 'Тип',
      type: 'string',
      description: 'Визначає в який розділ сторінки потрапить цей товар',
      options: {
        list: [
          { title: 'Бджолопакети', value: 'bee_packages' },
          { title: "Бджолосім'ї", value: 'bee_colonies' },
          { title: 'Порожні вулики', value: 'empty_hives' },
          { title: 'Вулики з бджолами', value: 'hives_with_bees' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'breeds',
      title: 'Породи (тільки для бджолопакетів)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Натисніть Enter після кожної породи. Наприклад: Buckfast · Українська степова · Карніка',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'seasonNote',
      title: 'Примітка про сезон',
      type: 'string',
      description: 'Наприклад: Доступні з квітня по серпень',
      placeholder: 'Доступні навесні та влітку',
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Необов\'язково — детальний опис для сторінки',
    }),
    defineField({
      name: 'image',
      title: 'Фото (необов\'язково)',
      type: 'image',
      description: 'Фото бджолопакету, вулика або бджіл. Мінімум 800×600px',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативний текст',
          type: 'string',
          description: 'Наприклад: Бджолопакет Buckfast від пасіки Дача TV',
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
    prepare({ title, media, subtitle }) {
      const typeLabels: Record<string, string> = {
        bee_packages: 'Бджолопакети',
        bee_colonies: "Бджолосім'ї",
        empty_hives: 'Порожні вулики',
        hives_with_bees: 'Вулики з бджолами',
      }
      return {
        title: title as string,
        media,
        subtitle: typeLabels[subtitle as string] || subtitle as string,
      }
    },
  },
})
