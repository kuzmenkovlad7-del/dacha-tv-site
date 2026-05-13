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
      description: 'Формат: +380XXXXXXXXX',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'telegramUrl',
      title: 'Telegram посилання',
      type: 'url',
      description: 'Наприклад: https://t.me/dachatv',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube канал (головний)',
      type: 'url',
      description: 'Тільки головний канал Дача TV',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook сторінка',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram профіль',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok профіль',
      type: 'url',
    }),
    defineField({
      name: 'addressDisplay',
      title: 'Адреса (коротка)',
      type: 'string',
      description: 'Наприклад: Коротич, Харківська область',
    }),
    defineField({
      name: 'addressFull',
      title: 'Адреса (повна)',
      type: 'string',
      description: 'Наприклад: Коротич, Пісочинська ОТГ, Харківська область, Україна',
    }),
  ],
  preview: {
    select: {
      title: 'phone',
    },
    prepare({ title }) {
      return { title: `Налаштування: ${(title as string) || 'не вказано'}` }
    },
  },
})
