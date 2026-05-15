import { existsSync } from 'fs'
import { join } from 'path'
import Image from 'next/image'

const PASSPORT_IMAGE = '/images/dacha-tv/documents/apiary-passport.jpg'

export function ApiaryTrust() {
  const hasPassportImage = existsSync(join(process.cwd(), 'public', PASSPORT_IMAGE))

  return (
    <section aria-labelledby="trust-apiary-heading" className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div>
          <h3 id="trust-apiary-heading" className="font-serif text-lg font-bold text-gray-900">
            Зареєстрована пасіка
          </h3>
          <p className="text-gray-500 text-sm mt-0.5">Ветеринарно-санітарний паспорт пасіки</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-5">
        Наша пасіка офіційно зареєстрована та має ветеринарно-санітарний паспорт пасіки — документ державного зразка, що підтверджує відповідність санітарним нормам та відкритість нашого виробництва. Ми нічого не приховуємо: вся наша робота задокументована і доступна на перевірку.
      </p>

      {hasPassportImage && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-100 mb-5">
          <Image
            src={PASSPORT_IMAGE}
            alt="Ветеринарно-санітарний паспорт пасіки Дача TV"
            fill
            className="object-contain object-center bg-gray-50"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {['Офіційна реєстрація', 'Ветеринарний нагляд', 'Відкрите виробництво'].map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
