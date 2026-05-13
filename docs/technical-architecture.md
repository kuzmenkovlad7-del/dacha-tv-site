# Дача TV — Technical Architecture

> Planning document only. No code should be written until this plan is reviewed and approved.

---

## 1. Recommended Stack for Fast Launch

The goal is a fast, production-quality launch without overengineering. Every technology choice should be justified by real v1 requirements.

### Core Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | **Next.js 14+** (App Router) | SSR/SSG for SEO, React ecosystem, Vercel-native |
| Language | **TypeScript** | Type safety, better DX, fewer runtime errors |
| Styling | **Tailwind CSS** | Fast to build, consistent design system, no CSS bloat |
| Component library | **shadcn/ui** (selected components only) | Accessible, unstyled-by-default, no vendor lock-in |
| Package manager | **pnpm** | Faster than npm, efficient disk use |

### Data Layer (v1)

At launch, product data should be **static TypeScript files**, not a database. This eliminates a full CMS dependency, speeds up launch, and has zero operational cost.

```
/data
  /products
    honey.ts       ← All honey variants with metadata
    other.ts       ← Pollen, propolis, nuts in honey
    beekeeper.ts   ← Bee packages, colonies, hives
  /config
    site.ts        ← Brand name, contact, social links
    nav.ts         ← Navigation structure
```

**Upgrade path:** When product data needs frequent updates by a non-developer, migrate to a headless CMS (see section 2).

### Forms and Inquiry Handling

| Need | Technology |
|---|---|
| Form UI | React Hook Form + Zod (validation) |
| Form submission | Next.js Server Action (no separate API route needed) |
| Email delivery | **Resend** (modern, reliable, free tier covers v1 volume) |
| Telegram notification | Telegram Bot API (simple HTTP POST, instant mobile notification) |

**Why Telegram bot:**
Ukrainian business owners predominantly use Telegram. A bot notification is faster and more reliable than email for real-time order alerts. Implementation is a single API call.

### Analytics and Monitoring

| Tool | Purpose | Cost |
|---|---|---|
| Google Analytics 4 | Traffic, conversions, source attribution | Free |
| Google Search Console | SEO performance, keyword tracking | Free |
| Vercel Analytics | Core Web Vitals, performance | Free tier |

---

## 2. CMS / Admin Recommendations

### v1: No CMS (static data files)

At launch, product data lives in TypeScript files in the repository. Updates require a code deployment (Vercel handles this in seconds via git push).

**Suitable when:**
- Product catalog changes infrequently (new honey varieties, seasonal notes)
- Owner is not editing content themselves
- Team is technical enough to do small text edits via GitHub

### v1.5: Simple headless CMS (if needed)

If the owner needs to manage content without developer help, the lowest-friction option is:

**Recommended: Sanity.io (free tier)**
- Visual editing UI
- Ukrainian language content support
- Real-time preview
- Next.js integration is first-class
- Free tier covers all v1 needs

**Alternative: Notion as CMS**
- Owner is likely already familiar with Notion
- Can be queried via official API
- Less structured, but zero learning curve
- Suitable for managing FAQs, blog posts, reviews

**Do NOT use at launch:**
- WordPress (overkill, different stack)
- Webflow (replaces Next.js, loses flexibility)
- Shopify (overkill for v1, no beekeeper inquiry flow)
- Strapi (self-hosted, operational burden)

### When to introduce CMS:
- Owner wants to update product descriptions themselves
- Blog/content section is added (Phase 2C)
- Reviews need to be managed without code changes

---

## 3. Form Handling Recommendations

### Inquiry/Order Form (honey products)

**Fields:**
```
name        string, required
phone       string, required, Ukrainian format validation
product     select (honey variety + packaging)
quantity    number, optional
message     string, optional, max 500 chars
```

**Flow:**
1. User submits form
2. Server Action validates with Zod
3. Send email via Resend to owner's address
4. Send Telegram bot message to owner's Telegram chat
5. Return success state to UI
6. Show confirmation message to user ("Ми зв'яжемося з вами найближчим часом")

**Rate limiting:**
- Simple IP-based rate limit on the Server Action (max 3 submissions per hour per IP)
- Add honeypot field for bot filtering

### Inquiry Form (beekeeping products)

**Fields:**
```
name          string, required
phone         string, required
product_type  select (bee packages / bee colonies / hives / hives with bees)
breed         select (Buckfast / Українська степова / Карніка / Not sure) — shown only for packages
quantity      string, optional (free text, "approximate")
timing        string, optional ("планую навесні", etc.)
message       string, optional
```

**Same notification flow as above.**

### Email templates (Resend)

Two email templates needed:
1. **Owner notification** — plaintext, all form fields, reply-to set to customer phone
2. **Customer confirmation** — simple branded HTML, "thank you, we will call you"

Customer confirmation email is optional at launch but recommended for professionalism.

---

## 4. Database Structure for Inquiries and Products

### v1: No database for products (static files)

### v1: Inquiry log (optional but recommended)

Even at launch, storing inquiries in a database is valuable:
- Prevents loss if email delivery fails
- Enables future admin panel
- Simple audit trail

**Recommended: Vercel Postgres (Neon) or Planetscale free tier**

**Inquiry table:**

```sql
CREATE TABLE inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  type          TEXT NOT NULL, -- 'honey_order' | 'beekeeper_inquiry'
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  product       TEXT,
  breed         TEXT,          -- for bee packages
  quantity      TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'completed' | 'cancelled'
  notes         TEXT           -- internal owner notes
);
```

**Status updates:** At launch, status is updated manually via a simple admin page or directly in the DB. No complex admin UI needed.

### Simple admin view (optional v1.5):

A password-protected Next.js route `/admin/inquiries` showing a table of all inquiries with status toggle. No external admin framework needed — 50–100 lines of code.

### v2: Product database (when CMS is introduced)

```sql
CREATE TABLE products (
  id            UUID PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  category      TEXT,  -- 'honey' | 'other' | 'beekeeper'
  name_ua       TEXT,
  description_ua TEXT,
  is_active     BOOLEAN DEFAULT true,
  requires_inquiry BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_variants (
  id          UUID PRIMARY KEY,
  product_id  UUID REFERENCES products(id),
  name_ua     TEXT,  -- '1л скло', '1л пластик', '200мл'
  price       NUMERIC(10,2), -- null = price on inquiry
  in_stock    BOOLEAN DEFAULT true
);
```

---

## 5. What Should Be Built Now vs Deferred

### Build now (v1):

| Feature | Why now |
|---|---|
| All static pages (home, honey, products, beekeeper, about, contact, delivery, faq) | Core commercial need |
| Honey product pages (6 varieties) | Primary revenue driver |
| Inquiry/order forms | Primary conversion mechanism |
| Email + Telegram notifications | Owner must receive leads |
| Mobile-optimized design | Majority of traffic is mobile |
| GA4 + Search Console | Measure from day 1 |
| SEO metadata per page | Indexability from day 1 |
| Sitemap.xml | Crawlability |
| 404 page | Basic site quality |
| Privacy policy page | Legal minimum |

### Defer (Phase 2+):

| Feature | Why defer |
|---|---|
| Shopping cart / checkout | Volume doesn't justify yet |
| Payment gateway (LiqPay, Monobank) | Manual payment works at launch |
| User accounts | No use case in v1 |
| CMS / admin panel | Static files sufficient at launch |
| Blog / content section | YouTube fills this role |
| Reviews widget | Manual curation sufficient at launch |
| Nova Poshta API integration | Manual booking works at launch |
| Inventory management | Not needed at v1 volume |
| Email newsletter | No list yet |
| International e-commerce | Mention only, no infrastructure |
| Multi-language (EN/DE) | Ukraine-first at launch |

---

## 6. Deployment Notes

### Hosting: Vercel

**Why Vercel:**
- Native Next.js deployment (zero config)
- Free tier covers v1 traffic comfortably
- Automatic HTTPS
- Global CDN (fast for Ukraine via EU edge nodes)
- Preview deployments per git branch
- Easy environment variable management

**Environment variables needed:**
```
RESEND_API_KEY          # Email delivery
TELEGRAM_BOT_TOKEN      # Bot notifications
TELEGRAM_CHAT_ID        # Owner's chat ID
DATABASE_URL            # If using Postgres for inquiry log
NEXT_PUBLIC_GA_ID       # Google Analytics
```

### Domain

- Register a `.ua` or `.com.ua` domain (preferred for Ukrainian SEO)
- Alternative: `.com` if international expansion is planned
- Configure DNS at Vercel or use external registrar (Hostpro, NIC.UA are common in Ukraine)
- Automatic SSL via Vercel

### Deployment workflow:

```
developer → git push → GitHub → Vercel auto-deploys
                    ↓
              Preview URL (for review before merge)
                    ↓
              Merge to main → Production deploy
```

### Branch strategy:

```
main           → Production (dacha-tv.com or similar)
dev / staging  → Preview deployments
feature/*      → Individual feature work
```

---

## 7. SEO / Metadata / Image Handling Notes

### Metadata (Next.js 14 Metadata API)

Each page exports a `generateMetadata` function or static `metadata` object:

```typescript
// Example: honey variety page
export const metadata: Metadata = {
  title: 'Акацієвий мед | Дача TV',
  description: 'Натуральний акацієвий мед від сімейної пасіки в Коротичі, Харківська область. 1л скло та пластик.',
  openGraph: {
    title: 'Акацієвий мед | Дача TV',
    description: '...',
    images: ['/images/honey/akatsiya-og.jpg'],
    locale: 'uk_UA',
    type: 'website',
  },
}
```

**Required metadata per page:**
- `<title>` — unique per page, includes brand name
- `<meta description>` — 150–160 chars, Ukrainian, includes keywords
- Open Graph tags — for Facebook/Telegram link previews
- Canonical URL — prevent duplicate content

### Structured Data (JSON-LD)

| Page | Schema type |
|---|---|
| Home | `Organization`, `LocalBusiness` |
| Honey product pages | `Product` (without price if not shown) |
| Contact/About | `LocalBusiness` with address |
| FAQ | `FAQPage` |

**LocalBusiness schema example:**
```json
{
  "@type": "LocalBusiness",
  "name": "Дача TV",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Коротич",
    "addressRegion": "Харківська область",
    "addressCountry": "UA"
  },
  "telephone": "+380XXXXXXXXX",
  "url": "https://dacha-tv.com"
}
```

### Image Handling

**Next.js `<Image>` component** must be used for all images:
- Automatic WebP conversion
- Lazy loading
- Responsive srcsets
- Prevents layout shift (CLS)

**Image organization:**
```
/public/images
  /honey/           ← Product photos (akatsiya.jpg, lypa.jpg, etc.)
  /products/        ← Pollen, propolis, nuts photos
  /apiary/          ← Location / process photos
  /team/            ← Family / people photos (if used)
  /og/              ← Open Graph images (1200×630)
```

**Image format requirements:**
- Source images: high-res JPG/PNG from real photos
- Serve as: WebP via Next.js Image component
- OG images: 1200×630px JPG (pre-generated)
- Alt text: always in Ukrainian, descriptive

**Performance targets:**
- LCP (Largest Contentful Paint): < 2.5s
- Hero image: preloaded (`priority` prop on Next.js Image)
- No unoptimized images
- Target: 90+ Lighthouse score on mobile

---

## 8. Future Automation Opportunities

Listed in priority order based on business impact:

### Immediate (implement when volume justifies):

**1. Telegram Bot order notifications**
- Simple: single Telegram Bot API call in Server Action
- Instant notification on owner's phone
- Can be built as part of v1 if desired

**2. Auto-reply SMS or Viber to customer**
- After form submission, send automated "дякуємо, зателефонуємо" message
- Requires Turbosms or Alpha SMS gateway (Ukrainian providers)

### Short-term (Phase 2):

**3. Nova Poshta API integration**
- Look up delivery cost based on city
- Generate waybill automatically
- Track shipment status

**4. Payment integration (LiqPay or Monobank Acquiring)**
- Generate payment link for honey orders
- Webhook on payment confirmed → update order status
- Trigger shipping

**5. Google Reviews auto-request**
- After confirmed delivery, send SMS with Google review link
- Low effort, high trust-building ROI

### Medium-term (Phase 2C+):

**6. Email marketing (Brevo/Mailchimp)**
- Collect emails at order time (opt-in)
- Seasonal campaigns: "Акація сезон відкрито", "Нова партія меду"

**7. CRM integration**
- Connect inquiry form to simple CRM (Pipedrive or similar)
- Track leads from first touch to completed order

**8. Inventory sync**
- Admin marks product as "out of stock"
- Product page shows "наразі немає в наявності" automatically
- Re-stock notification opt-in for customers

### Long-term (Phase 3):

**9. EU market infrastructure**
- EN/DE language support via Next.js i18n
- European payment methods (Stripe)
- EU-compliant privacy / GDPR full implementation

**10. Subscription honey**
- Recurring orders for regular customers
- Monthly/quarterly honey delivery
- Requires Stripe subscriptions or similar

**11. Loyalty / referral system**
- Discount code generation
- Referral tracking
- Only relevant at significant scale

---

## Summary: V1 Technology Footprint

```
Next.js 14 (App Router)
TypeScript
Tailwind CSS
shadcn/ui (selected components)
React Hook Form + Zod
Resend (email)
Telegram Bot API (notifications)
Vercel (hosting)
Vercel Postgres or Neon (inquiry storage — optional at launch)
Google Analytics 4
Google Search Console
```

**Total third-party services at launch: 5–6**
**Monthly cost at v1 scale: $0 (all free tiers)**
**Time to deploy first version: 1–2 weeks of focused development**
