import { defineField, defineType } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Відгуки',
  type: 'document',
  fields: [
    defineField({
      name: 'reviewerName',
      title: "Ім'я покупця",
      type: 'string',
      description: "Тільки ім'я — без прізвища",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Місто',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Відгук',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Оцінка',
      type: 'number',
      options: {
        list: [
          { title: '⭐ 1', value: 1 },
          { title: '⭐⭐ 2', value: 2 },
          { title: '⭐⭐⭐ 3', value: 3 },
          { title: '⭐⭐⭐⭐ 4', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5', value: 5 },
        ],
      },
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'isVisible',
      title: 'Показувати на сайті',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'reviewerName',
      subtitle: 'city',
    },
  },
})
