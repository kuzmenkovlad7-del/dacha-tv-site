'use server'

// Order forwarding foundation — test mode only.
// Map checkout fields → supplier API fields → Nova Poshta delivery.
// Set SUPPLIER_ORDER_MODE=live to enable real order submission.

const ORDER_MODE = process.env.SUPPLIER_ORDER_MODE ?? 'test'

export interface CheckoutItem {
  supplier_sku: string
  quantity: number
  price_uah: number
}

export interface DeliveryAddress {
  recipient_name: string
  phone: string
  city: string
  nova_poshta_warehouse?: string
  nova_poshta_address?: string
}

export interface SupplierOrderPayload {
  items: Array<{ sku: string; qty: number; price: number }>
  delivery: {
    recipient: string
    phone: string
    city: string
    warehouse?: string
    address?: string
  }
  comment?: string
}

export interface OrderResult {
  ok: boolean
  order_id?: string
  test_mode: boolean
  message: string
  payload?: SupplierOrderPayload
}

function buildPayload(items: CheckoutItem[], address: DeliveryAddress, comment?: string): SupplierOrderPayload {
  return {
    items: items.map((i) => ({ sku: i.supplier_sku, qty: i.quantity, price: i.price_uah })),
    delivery: {
      recipient: address.recipient_name,
      phone: address.phone,
      city: address.city,
      warehouse: address.nova_poshta_warehouse,
      address: address.nova_poshta_address,
    },
    comment,
  }
}

export async function submitOrder(
  items: CheckoutItem[],
  address: DeliveryAddress,
  comment?: string,
): Promise<OrderResult> {
  const payload = buildPayload(items, address, comment)

  if (ORDER_MODE !== 'live') {
    console.log('[supplier/order] TEST MODE — order not submitted:', JSON.stringify(payload, null, 2))
    return {
      ok: true,
      test_mode: true,
      message: 'Тестовий режим — замовлення не відправлено постачальнику',
      payload,
    }
  }

  const apiUrl = process.env.SUPPLIER_API_URL
  const apiKey = process.env.SUPPLIER_API_KEY
  if (!apiUrl || !apiKey) {
    return { ok: false, test_mode: false, message: 'SUPPLIER_API_URL та SUPPLIER_API_KEY не налаштовані' }
  }

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, test_mode: false, message: `Помилка API: ${res.status} — ${text}` }
    }

    const data = await res.json() as Record<string, unknown>
    return {
      ok: true,
      test_mode: false,
      order_id: String(data.order_id ?? data.id ?? ''),
      message: 'Замовлення передано постачальнику',
    }
  } catch (e) {
    return { ok: false, test_mode: false, message: e instanceof Error ? e.message : String(e) }
  }
}
