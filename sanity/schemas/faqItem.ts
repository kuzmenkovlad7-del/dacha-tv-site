import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Питання',
      type: 'string',
      description: 'Наприклад: Як правильно зберігати мед? або Чи є доставка у моє місто?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Відповідь',
      type: 'text',
      rows: 5,
      description: 'Чітка і конкретна відповідь. Уникайте рекламних фраз — краще пряма і корисна інформація',
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'category',
      title: 'Категорія',
      type: 'string',
      description: 'Визначає в який блок на сторінці FAQ потрапить це питання',
      options: {
        list: [
          { title: 'Про продукти', value: 'products' },
          { title: 'Замовлення', value: 'ordering' },
          { title: 'Доставка', value: 'delivery' },
          { title: 'Бджільництво', value: 'beekeeping' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Порядок у категорії',
      type: 'number',
      description: 'Менше число = вище в списку. Наприклад: 1 для найважливішого питання',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'За порядком',
      name: 'orderAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      const categoryLabels: Record<string, string> = {
        products: 'Про продукти',
        ordering: 'Замовлення',
        delivery: 'Доставка',
        beekeeping: 'Бджільництво',
      }
      return {
        title: title as string,
        subtitle: categoryLabels[subtitle as string] || (subtitle as string),
      }
    },
  },
})
