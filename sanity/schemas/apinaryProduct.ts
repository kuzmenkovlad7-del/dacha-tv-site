import { defineField, defineType } from 'sanity'

export const apinaryProduct = defineType({
  name: 'apinaryProduct',
  title: 'Продукти пасіки',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Назва',
      type: 'string',
      description: 'Наприклад: Пилок квітковий, Прополіс, Горіхи в меду, Перга',
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
      name: 'description',
      title: 'Опис',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Розкажіть про корисні властивості та спосіб застосування',
    }),
    defineField({
      name: 'packaging',
      title: 'Упаковка',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Натисніть Enter після кожного варіанту. Наприклад: 100г · 250г · 500г',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'inStock',
      title: 'В наявності',
      type: 'boolean',
      description: 'Вимкніть коли товар закінчився — на сторінці з\'явиться повідомлення про відсутність',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Порядок у каталозі',
      type: 'number',
      description: 'Менше число = вище в списку. Наприклад: 1, 2, 3...',
      initialValue: 10,
    }),
    defineField({
      name: 'image',
      title: 'Фото',
      type: 'image',
      description: 'Квадратне фото продукту. Мінімум 800×800px, JPG або WebP',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативний текст',
          type: 'string',
          description: 'Наприклад: Квітковий пилок від пасіки Дача TV',
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'За порядком',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Назва А–Я',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'inStock',
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title as string,
        media,
        subtitle: subtitle ? 'В наявності' : '⚠️ Немає в наявності',
      }
    },
  },
})
