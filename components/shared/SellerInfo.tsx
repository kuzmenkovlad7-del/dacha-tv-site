import Link from 'next/link'

interface SellerInfoProps {
  compact?: boolean
}

export function SellerInfo({ compact = false }: SellerInfoProps) {
  if (compact) {
    return (
      <div className="text-xs text-gray-400 space-y-1">
        <p>Продавець: ФОП · Харківська обл., Коротич</p>
        <p>Оплата після підтвердження замовлення · <Link href="/delivery" className="underline hover:text-gray-600">Умови</Link></p>
      </div>
    )
  }

  return (
    <section aria-label="Інформація про продавця" className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Продавець</h3>
      <dl className="space-y-3 text-sm">
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="text-gray-400 whitespace-nowrap">Статус</dt>
          <dd className="text-gray-800">ФОП (фізична особа-підприємець)</dd>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="text-gray-400 whitespace-nowrap">Місцезнаходження</dt>
          <dd className="text-gray-800">Коротич, Харківська область, Україна</dd>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="text-gray-400 whitespace-nowrap">Оплата</dt>
          <dd className="text-gray-800">Після підтвердження замовлення. Реквізити надаємо при замовленні.</dd>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="text-gray-400 whitespace-nowrap">IBAN</dt>
          <dd className="text-gray-500 italic">Надається при оформленні замовлення</dd>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt className="text-gray-400 whitespace-nowrap">Претензії</dt>
          <dd className="text-gray-800">Звертайтеся за контактним номером або через <Link href="/contact" className="underline hover:text-gray-600">форму зворотного зв&apos;язку</Link>.</dd>
        </div>
      </dl>
    </section>
  )
}
