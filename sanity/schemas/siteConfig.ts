import { defineField, defineType } from 'sanity'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Налаштування сайту',
  type: 'document',
  fields: [
    defineField({
      name: 'phone',
      title: 'Номер телефону',
      type: 'string',
      description: 'Формат: +380XXXXXXXXX або 0XXXXXXXXX — показується в шапці, підвалі та формах',
      placeholder: '+380671234567',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'addressFull',
      title: 'Адреса (повна)',
      type: 'string',
      description: 'Показується в підвалі та на сторінці контактів',
      placeholder: 'Коротич, Пісочинська ОТГ, Харківська область, Україна',
    }),
    defineField({
      name: 'telegramUrl',
      title: 'Telegram (канал або особистий)',
      type: 'url',
      description: 'Наприклад: https://t.me/dachatv або https://t.me/ваш_нікнейм',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube канал',
      type: 'url',
      description: 'Головна сторінка вашого YouTube-каналу. Наприклад: https://youtube.com/@dachatv',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram',
      type: 'url',
      description: 'Необов\'язково. Наприклад: https://instagram.com/dachatv',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook',
      type: 'url',
      description: 'Необов\'язково',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok',
      type: 'url',
      description: 'Необов\'язково',
    }),
    defineField({
      name: 'addressDisplay',
      title: 'Адреса (коротка, для виводу в тексті)',
      type: 'string',
      description: 'Необов\'язково. Наприклад: Коротич, Харківська область',
    }),
  ],
  preview: {
    select: { title: 'phone' },
    prepare({ title }) {
      return { title: `Налаштування: ${(title as string) || '⚠️ Телефон не вказано'}` }
    },
  },
})
