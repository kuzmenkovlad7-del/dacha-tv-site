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
      description: "Тільки ім'я або ім'я + перша літера прізвища. Наприклад: Олена або Олена К.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Місто',
      type: 'string',
      description: 'Наприклад: Харків, Київ, Полтава',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Текст відгуку',
      type: 'text',
      rows: 4,
      description: 'Реальні слова покупця. Не скорочуйте і не редагуйте — лише видаляйте особисту інформацію',
      validation: (Rule) => Rule.required().min(20).max(400),
    }),
    defineField({
      name: 'rating',
      title: 'Оцінка',
      type: 'number',
      options: {
        list: [
          { title: '⭐ 1 — Погано', value: 1 },
          { title: '⭐⭐ 2 — Задовільно', value: 2 },
          { title: '⭐⭐⭐ 3 — Нормально', value: 3 },
          { title: '⭐⭐⭐⭐ 4 — Добре', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5 — Відмінно', value: 5 },
        ],
        layout: 'radio',
      },
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'isVisible',
      title: 'Показувати на сайті',
      type: 'boolean',
      description: '⚠️ Увімкніть тільки після перевірки відгуку — за замовчуванням відгук прихований',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'reviewerName',
      subtitle: 'city',
      rating: 'rating',
    },
    prepare({ title, subtitle, rating }) {
      const stars = '⭐'.repeat((rating as number) || 5)
      return {
        title: title as string,
        subtitle: `${subtitle as string} · ${stars}`,
      }
    },
  },
})
