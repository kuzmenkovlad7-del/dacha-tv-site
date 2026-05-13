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
      description: 'Повна назва для сторінки і форм замовлення. Наприклад: Мед Акація',
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
      name: 'variety',
      title: 'Сорт',
      type: 'string',
      description: 'Оберіть сорт із списку — це визначає інформацію на картці і сторінці продукту',
      options: {
        list: [
          { title: 'Акація', value: 'Акація' },
          { title: 'Липа', value: 'Липа' },
          { title: 'Сонях', value: 'Сонях' },
          { title: "Різнотрав'я", value: "Різнотрав'я" },
          { title: 'Сади', value: 'Сади' },
          { title: 'Ліс', value: 'Ліс' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис (необов\'язково)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Додатковий опис для сторінки продукту. Якщо порожньо — стандартний опис з сайту',
    }),
    defineField({
      name: 'packaging',
      title: 'Упаковка',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Натисніть Enter після кожного варіанту. Приклади: 1L пластик · 1L скло · 3L пластик',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Показувати на головній',
      type: 'boolean',
      description: 'Увімкніть для 3–4 найпопулярніших сортів',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'В наявності',
      type: 'boolean',
      description: 'Вимкніть коли сорт закінчився — замість кнопки замовлення з\'явиться повідомлення',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Порядок у каталозі',
      type: 'number',
      description: 'Менше число = вище в списку. Наприклад: 1 для акації, 2 для липи...',
      initialValue: 10,
    }),
    defineField({
      name: 'image',
      title: 'Фото',
      type: 'image',
      description: 'Квадратне фото банки меду. Мінімум 800×800px, JPG або WebP',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Альтернативний текст',
          type: 'string',
          description: 'Наприклад: Мед акація 1L від пасіки Дача TV',
        }),
      ],
    }),
    defineField({
      name: 'youtubeVideoLink',
      title: 'Посилання на YouTube відео (необов\'язково)',
      type: 'url',
      description: 'Відео про збір цього конкретного сорту. З\'явиться як кнопка на сторінці продукту',
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
      subtitle: 'variety',
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title as string,
        media,
        subtitle: subtitle as string,
      }
    },
  },
})
