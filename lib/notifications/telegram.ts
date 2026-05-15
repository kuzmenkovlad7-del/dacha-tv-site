import type { InquiryData } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  honey_order: 'Замовлення меду',
  beekeeper_inquiry: 'Заявка пасічника',
  general: 'Загальна заявка',
  flower_inquiry: '🌸 Замовлення квітів',
}

function formatTelegramMessage(inquiry: InquiryData): string {
  const typeLabel = TYPE_LABELS[inquiry.type] || inquiry.type
  const timestamp = new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kiev',
  }).format(new Date())

  const lines = [
    `🆕 Нова заявка — ${typeLabel}`,
    '',
    `Ім'я: ${inquiry.name}`,
    `Телефон: <a href="tel:${inquiry.phone}">${inquiry.phone}</a>`,
  ]

  if (inquiry.product) lines.push(`Продукт: ${inquiry.product}`)
  if (inquiry.packaging) lines.push(`Упаковка: ${inquiry.packaging}`)
  if (inquiry.breed) lines.push(`Порода: ${inquiry.breed}`)
  if (inquiry.quantity) lines.push(`Кількість: ${inquiry.quantity}`)
  if (inquiry.timing) lines.push(`Час: ${inquiry.timing}`)
  if (inquiry.message) lines.push(`Повідомлення: ${inquiry.message}`)
  if (inquiry.source) lines.push(`Сторінка: ${inquiry.source}`)

  lines.push(`⏰ ${timestamp}`)

  return lines.join('\n')
}

export async function sendTelegramNotification(inquiry: InquiryData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return

  // Flower inquiries can be routed to a separate chat if configured
  const isFlower = inquiry.type === 'flower_inquiry'
  const chatId = isFlower
    ? (process.env.TELEGRAM_CHAT_ID_FLOWERS || process.env.TELEGRAM_CHAT_ID)
    : process.env.TELEGRAM_CHAT_ID

  if (!chatId) return

  const text = formatTelegramMessage(inquiry)

  const tasks: Promise<void>[] = []

  tasks.push(
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    }).then(() => {}).catch(() => {})
  )

  // Optional n8n / webhook forwarding — set WEBHOOK_URL env var to enable
  const webhookUrl = process.env.WEBHOOK_URL
  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: inquiry.type,
          name: inquiry.name,
          phone: inquiry.phone,
          product: inquiry.product ?? null,
          message: inquiry.message ?? null,
          source: inquiry.source ?? null,
          timestamp: new Date().toISOString(),
        }),
      }).then(() => {}).catch(() => {})
    )
  }

  await Promise.allSettled(tasks)
}
