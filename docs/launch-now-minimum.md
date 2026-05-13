# Мінімальний план запуску сьогодні

Щоб сайт запрацював і міг приймати реальні заявки — виконайте лише ці кроки. Нічого зайвого.

Орієнтовний час: **45–90 хвилин**.

---

## Блок 1 — Sanity (контент-база)

### 1. Створіть проект
1. sanity.io → Sign in → **Create new project**
2. Назва: будь-яка, Dataset: `production`
3. Запишіть **Project ID** (8 символів на головній сторінці проекту)

### 2. Отримайте токен
1. sanity.io → ваш проект → **Settings → API → Tokens**
2. **Add API token** → Name: `vercel` → Permissions: **Editor** → Save
3. Скопіюйте токен — він показується **один раз**

### 3. Внесіть мінімальний контент
Відкрийте Studio (`/studio` на вашому Vercel-домені або `localhost:3000/studio`).

**Обов'язково:**

| Розділ | Що заповнити |
|--------|-------------|
| Налаштування сайту | Ваш телефон (формат `+380...`) |
| Мед → додайте хоча б 1 продукт | Назва + Сорт (з випадаючого списку) + В наявності = увімкнено |

Без телефону — шапка порожня. Без продукту — каталог порожній.

Фото, відгуки, FAQ — додайте пізніше, сайт працює і без них.

---

## Блок 2 — Supabase (для прийому заявок)

### 1. Створіть проект
1. supabase.com → **New project** → будь-яка назва, регіон EU
2. Збережіть пароль бази даних (знадобиться якщо щось піде не так)

### 2. Створіть таблицю
**SQL Editor** → вставте і натисніть **Run**:

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

### 3. Запишіть ключі
supabase.com → проект → **Settings → API**:
- **URL** (наприклад `https://abcxyz.supabase.co`)
- **anon public** key
- **service_role** key (прихований — натисніть "Reveal")

---

## Блок 3 — Vercel (деплой)

### Обов'язкові змінні середовища — 7 штук

Vercel → ваш проект → **Settings → Environment Variables** → додайте кожну:

| Назва змінної | Значення |
|---------------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID з Sanity (8 символів) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Токен з Sanity (починається з `sk`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL з Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key з Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key з Supabase |
| `ADMIN_PASSWORD` | Придумайте пароль — мінімум 16 символів |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` — лише сервер, ніколи не `NEXT_PUBLIC_`.

Після додавання всіх змінних: **Deployments → три крапки → Redeploy**.

---

## Блок 4 — Мінімальне тестування (5 хвилин)

Після успішного деплою перевірте по черзі:

- [ ] Шапка сайту показує ваш телефон
- [ ] `/honey` показує ваш продукт (не заглушку)
- [ ] Натисніть "Замовити" на продукті → форма відкривається → заповніть → відправте
- [ ] Supabase → **Table Editor → inquiries** → ваша заявка є в таблиці
- [ ] `/admin` → вводьте `ADMIN_PASSWORD` → заявка видна в панелі

Якщо всі 5 пунктів пройдено — сайт приймає реальні заявки.

---

## Що залишити на потім (не блокує запуск)

- Telegram-сповіщення (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
- Email-сповіщення (Resend)
- Фото продуктів у Sanity
- Відгуки та FAQ
- Власний домен
