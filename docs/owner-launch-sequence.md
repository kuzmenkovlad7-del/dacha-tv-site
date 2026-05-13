# Owner Launch Sequence

Покроковий план запуску сайту Дача TV. Виконуйте кроки по порядку — кожен наступний залежить від попереднього.

Орієнтовний час: **2–4 години** при готових матеріалах (фото, тексти, облікові записи).

---

## Передумови

Перед початком підготуйте:
- [ ] Обліковий запис на **sanity.io** (безкоштовно)
- [ ] Обліковий запис на **supabase.com** (безкоштовно)
- [ ] Обліковий запис на **vercel.com** (безкоштовно)
- [ ] Telegram-бот (якщо потрібні сповіщення) — створити через BotFather
- [ ] Обліковий запис на **resend.com** (якщо потрібні email-сповіщення, безкоштовно до 3 000 листів/місяць)
- [ ] Фото продуктів (мінімум по одному для кожного сорту меду що є в наявності)
- [ ] Придуманий надійний пароль для адмін-панелі

---

## Крок 1 — Налаштування Sanity

### 1.1 Створення проекту
1. Зайдіть на [sanity.io](https://sanity.io) → Create new project
2. Назва: `dacha-tv` (або будь-яка)
3. Dataset: `production`
4. Запишіть **Project ID** (8 символів, наприклад `abc123xy`)

### 1.2 API Token
1. sanity.io → ваш проект → Settings → API → Tokens
2. Add API token → Name: `vercel-server` → Permissions: **Editor**
3. Скопіюйте токен — він показується лише один раз!

### 1.3 CORS для Studio
1. sanity.io → Settings → API → CORS Origins
2. Додайте `https://ваш-домен.vercel.app` (після деплою)
3. Для локальної розробки: `http://localhost:3000`

---

## Крок 2 — Налаштування Supabase

### 2.1 Створення проекту
1. Зайдіть на [supabase.com](https://supabase.com) → New project
2. Ім'я: `dacha-tv`, регіон: EU West або Central
3. Пароль бази даних — збережіть його!

### 2.2 Створення таблиці
1. Supabase → SQL Editor → вставте та виконайте:

```sql
create table if not exists inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  product text,
  message text,
  source text
);

alter table inquiries enable row level security;

create policy "service_role_all" on inquiries
  for all using (auth.role() = 'service_role');
```

### 2.3 Ключі доступу
1. Supabase → Settings → API
2. Запишіть **URL**, **anon key**, **service_role key**

---

## Крок 3 — Telegram-бот (необов'язково)

Якщо хочете отримувати замовлення у Telegram:

1. Відкрийте Telegram → знайдіть **@BotFather**
2. Надішліть `/newbot`
3. Ім'я: `DachaTVBot` (або будь-яке)
4. Username: `dacha_tv_orders_bot` (має закінчуватись на `bot`)
5. Скопіюйте **токен**
6. Напишіть боту будь-яке повідомлення
7. Відкрийте в браузері: `https://api.telegram.org/bot<ТОКЕН>/getUpdates`
8. Знайдіть у відповіді `"chat":{"id": 123456789}` — це ваш Chat ID

---

## Крок 4 — Resend (необов'язково)

Якщо хочете email-сповіщення про замовлення:

1. Зайдіть на [resend.com](https://resend.com) → Sign Up
2. Domains → Add Domain → введіть ваш домен і підтвердіть DNS-записи
3. API Keys → Create API Key → скопіюйте

---

## Крок 5 — Vercel (деплой)

### 5.1 Підключення репозиторію
1. vercel.com → New Project → Import Git Repository
2. Оберіть репозиторій `dacha-tv-site`
3. Framework: **Next.js** (визначиться автоматично)
4. **НЕ** натискайте Deploy відразу — спочатку додайте змінні

### 5.2 Змінні середовища
Додайте всі змінні з файлу `docs/vercel-env-checklist.md`:

**Обов'язкові (без них сайт не запуститься):**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` → `production`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

**Додаткові (для сповіщень):**
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_EMAIL`

### 5.3 Деплой
1. Натисніть **Deploy**
2. Дочекайтесь успішного білду (зазвичай 2–5 хвилин)
3. Vercel дасть URL виду `dacha-tv-site-xxx.vercel.app`

---

## Крок 6 — Внесення контенту у Sanity

Відкрийте `https://ваш-домен.vercel.app/studio` і дотримуйтесь порядку з `docs/sanity-content-entry-guide.md`:

1. **Налаштування сайту** — телефон, адреса, соцмережі
2. **Мед** — всі доступні сорти з фото
3. **Відгуки** — мінімум 3–5 реальних відгуків
4. **Продукти пасіки** — пилок, прополіс тощо (якщо є)
5. **Для пасічників** — якщо зараз сезон
6. **FAQ** — мінімум 5–7 питань
7. **Налаштування головної** — якщо хочете обрати конкретні сорти для головної

---

## Крок 7 — Тестування перед відкриттям

Пройдіть по кожному пункту:

### Контент
- [ ] Шапка показує ваш реальний телефон
- [ ] `/honey` показує ваші продукти з фото
- [ ] Головна сторінка: рекомендовані сорти відображаються
- [ ] Відгуки з'являються (хоча б один з увімкненим "Показувати на сайті")
- [ ] `/faq` показує ваші питання

### Форми (критично!)
- [ ] Форма замовлення на сторінці `/honey/[slug]` — заповніть, відправте
- [ ] Форма з'являється в Supabase (перевірте Table Editor → inquiries)
- [ ] Прийшло Telegram-сповіщення (якщо налаштовано)
- [ ] Прийшов email (якщо налаштовано)

### Адмін-панель
- [ ] `/admin` запитує пароль
- [ ] Вхід з вашим `ADMIN_PASSWORD` працює
- [ ] Список замовлень відображається

### Мобільний пристрій
- [ ] Відкрийте сайт на смартфоні
- [ ] Меню (гамбургер) відкривається і закривається
- [ ] Телефон у меню — натискання ініціює дзвінок
- [ ] Форма замовлення зручна для введення

### Технічне
- [ ] Сторінка 404 показує зрозуміле повідомлення (не білу сторінку)
- [ ] `/studio` відкривається після деплою (і після додавання CORS)

---

## Крок 8 — Власний домен (якщо є)

1. Vercel → Settings → Domains → Add Domain
2. Введіть ваш домен (наприклад `dachatv.ua`)
3. Vercel покаже DNS-записи — додайте їх у реєстратора домену
4. Зачекайте 5–60 хвилин на поширення DNS
5. Поверніться у Sanity → Settings → API → CORS Origins → додайте `https://dachatv.ua`

---

## Після запуску

- Слідкуйте за новими замовленнями в `/admin` або через Telegram
- Вимикайте "В наявності" для сортів, що закінчились
- Додавайте відгуки і вмикайте "Показувати на сайті" після перевірки
- Оновлення продуктів — одразу з'являються на сайті (через 60 секунд кешу)

---

## Контакти та підтримка

- Документація Next.js: `node_modules/next/dist/docs/`
- Документація Sanity: [sanity.io/docs](https://sanity.io/docs)
- Документація Supabase: [supabase.com/docs](https://supabase.com/docs)
- Документація Vercel: [vercel.com/docs](https://vercel.com/docs)
