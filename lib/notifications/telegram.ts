import type { InquiryData } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  honey_order: 'Замовлення меду',
  beekeeper_inquiry: 'Заявка пасічника',
  general: 'Загальна заявка',
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
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return
  }

  const text = formatTelegramMessage(inquiry)

  try {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    )
  } catch {
    // Non-blocking — do not propagate
  }
}
