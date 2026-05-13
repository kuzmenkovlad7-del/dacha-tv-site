# Дача TV — V1 Implementation Plan

> Planning document only. No code should be written until this plan is reviewed and approved.

---

## 1. Positioning Statement

**Дача TV** is a Ukrainian family apiary brand rooted in Харківська область, offering real honey and beekeeping products direct from the source — backed by years of hands-on expertise and a growing content community on YouTube.

**Core message:**
> Справжній мед. Справжня сім'я. Справжня пасіка.
> *(Real honey. Real family. Real apiary.)*

**Positioning pillars:**

| Pillar | What it means |
|---|---|
| Authenticity | Real people, real location, real process — not a reseller |
| Expertise | Beekeepers by practice, educators by content |
| Quality | Premium natural products, honest about what they are |
| Directness | You buy from the people who made it |
| Trust | Content-first brand — you know us before you buy |

**What this brand is NOT:**
- Not a marketplace or aggregator
- Not a generic "eco honey" shop
- Not a village souvenir stall
- Not a fake luxury brand with stock photos

---

## 2. Recommended Site Structure

```
/                        → Home (hero, trust, products preview, social proof, CTA)
/honey                   → Honey catalog (all varieties + packaging)
/honey/[slug]            → Individual honey product page
/products                → Other apiary products (pollen, propolis, nuts in honey)
/beekeeper               → Beekeeping products (bee packages, colonies, hives) — inquiry flow
/about                   → Brand story, family, apiary, location
/blog                    → Optional at launch — YouTube-linked content hub
/contact                 → Contact, location, inquiry form
/delivery                → Delivery info, pickup, Ukraine/abroad policy
/faq                     → Common questions about products and ordering
```

**Navigation (primary):**
- Мед (Honey)
- Продукти (Products)
- Пасічникам (For Beekeepers)
- Про нас (About)
- Контакти (Contact)

---

## 3. Page-by-Page Purpose

### `/` — Home
**Purpose:** Convert cold social/YouTube traffic into warm prospects.
- Establish brand immediately (who you are, where you're from, why trust you)
- Show best-selling products with clear path to purchase/inquiry
- Surface social proof (YouTube presence, reviews)
- One primary CTA: order honey or get in touch

### `/honey` — Honey Catalog
**Purpose:** Showcase the full honey range clearly and build purchase intent.
- All 6 varieties displayed with visual differentiation
- Both packaging options visible (1L plastic, 1L glass)
- Акація highlighted as best-seller
- Clear per-item CTA: "Замовити" (order via phone/form, not cart at launch)

### `/honey/[slug]` — Individual Honey Page
**Purpose:** Deep trust-building page for each honey type.
- Full description: bloom season, taste profile, origin, when harvested
- Photos (ideally real apiary photos)
- How to order section
- Related products

### `/products` — Other Products
**Purpose:** Capture buyers of complementary products.
- Pollen, propolis, nuts in honey
- Similar CTA flow as honey

### `/beekeeper` — Beekeeping Products
**Purpose:** Capture beekeepers looking for packages, colonies, hives.
- Different tone: peer-to-peer, expert-to-expert
- No prices shown
- Clear inquiry/call flow for each product type
- Seasonal availability notes (bee packages: spring to autumn)
- Breed options for bee packages (Buckfast, Ukrainian steppe, Carnica)

### `/about` — Brand Story
**Purpose:** The trust anchor. The page people visit before they buy.
- Family story, apiary location (Коротич, Харківська обл.)
- Why they started, how long they've been doing it
- Photos of the actual apiary, real people
- Link to YouTube channel

### `/contact` — Contact & Inquiry
**Purpose:** All conversion paths lead here if no other inline form is used.
- Phone number (primary for Ukrainian buyers)
- Short inquiry form (name, phone, message)
- Map/area reference (Коротич)
- Business hours if relevant

### `/delivery` — Delivery Info
**Purpose:** Remove friction by answering logistics questions proactively.
- Honey: Nova Poshta / Ukrposhta across Ukraine
- International: clarify availability (future)
- Bee products: self-pickup / agreed delivery, no automated shipping

### `/faq` — FAQ
**Purpose:** Handle objections, reduce support volume.
- Product quality questions
- Storage and shelf life
- How to order, how to pay
- Delivery questions
- Beekeeping product questions

---

## 4. Conversion Strategy

**Primary conversion goal at launch:** Phone call or form submission.
No cart, no payment gateway in v1. The goal is qualified lead capture.

**Conversion hierarchy:**

```
1. Phone call (top priority for Ukrainian market)
2. Inquiry form submission (honey order or beekeeping inquiry)
3. Telegram/Viber message (common in Ukraine, easy to add)
4. Email (backup)
```

**Sticky elements:**
- Phone number visible in header on every page
- "Замовити" (Order) CTA on every product card
- Floating WhatsApp/Telegram button on mobile

**Trust before conversion:**
Every page should give the visitor enough reason to trust the brand before asking for action. The brand story, real photos, and YouTube content do most of this work.

**Traffic source alignment:**

| Source | Landing page | Primary CTA |
|---|---|---|
| YouTube description | `/` or `/honey` | "Замовити мед" |
| Instagram bio | `/` | Phone / form |
| Facebook post | Product page | Inquiry |
| Direct search | SEO-optimized pages | Relevant product |

---

## 5. Catalog vs Inquiry Flow

| Product | Flow | Reasoning |
|---|---|---|
| Honey (all types) | Catalog + order form | Standard product, shippable, predictable |
| Pollen | Catalog + order form | Similar to honey |
| Propolis | Catalog + order form | Similar to honey |
| Nuts in honey | Catalog + order form | Clear SKU, shippable |
| Bee packages | Inquiry / call only | Seasonal, breed selection, live animals |
| Bee colonies | Inquiry / call only | High value, complex logistics, live animals |
| Empty hives | Inquiry / call only | Size/type selection needed, no fixed price |
| Hives with bees | Inquiry / call only | Complex, high-touch, live animals |

**Inquiry flow for beekeeping products:**
1. User reads product info page
2. Clicks "Залишити заявку" (Submit inquiry)
3. Short form: name, phone, product interest, approximate quantity/timing
4. Owner gets notification (email or Telegram bot)
5. Owner calls the buyer back

---

## 6. Recommended User Flows

### Flow A: Honey buyer from YouTube
```
YouTube video → description link → Home page
→ sees honey section → clicks "Акація" → product page
→ sees "Замовити" → short order form
→ receives confirmation message → owner calls back
```

### Flow B: Beekeeper looking for bee packages
```
Instagram or search → /beekeeper page
→ reads about bee packages + breeds → clicks "Залишити заявку"
→ inquiry form (product: packages, breed preference, qty, timing)
→ owner contacts by phone
```

### Flow C: Gift buyer, discovery via search
```
Search "мед Харків купити" → /honey or home
→ browses honey types → reads about packaging options
→ reads delivery page → submits order form
```

### Flow D: Existing customer returning
```
Direct URL or bookmark → home
→ navigates to honey → selects preferred type
→ quick repeat order via phone (phone number always visible)
```

---

## 7. MVP Scope for Launch

**Must have at launch:**

- [ ] Home page with hero, products preview, trust section, YouTube integration
- [ ] Honey catalog page (all 6 types, both packaging options)
- [ ] Individual honey product pages (at minimum Акація, Липа — the rest can be simpler at start)
- [ ] Other products page (pollen, propolis, nuts in honey)
- [ ] Beekeeping products page (bee packages, colonies, hives — inquiry flow)
- [ ] About page
- [ ] Contact page with form
- [ ] Delivery page
- [ ] FAQ page
- [ ] Order/inquiry form (no payment, just lead capture)
- [ ] Phone number in header on every page
- [ ] Mobile-first design
- [ ] Basic SEO (title, description, OG tags)
- [ ] Google Analytics 4

**Explicitly out of scope for v1:**

- [ ] Online payment / cart / checkout
- [ ] User accounts / login
- [ ] CMS with full admin panel (use simple data files)
- [ ] Blog/content hub (link to YouTube instead)
- [ ] Automated shipping calculations
- [ ] Inventory management
- [ ] Reviews system (show manually curated at first)
- [ ] International e-commerce (mention availability only)
- [ ] Price display for beekeeping products

---

## 8. Phase 2 Improvements (Post-Launch)

**Phase 2A — Conversion optimization (1-3 months post-launch):**
- Add Telegram bot for instant order notifications
- Add Viber/WhatsApp integration
- A/B test CTA copy and placement
- Add customer review collection flow
- Google Merchant integration for honey products

**Phase 2B — Commerce (3-6 months post-launch):**
- LiqPay or Monobank acquiring integration for honey products
- Simple cart for honey + other products (not beekeeping)
- Order tracking via Nova Poshta API
- Email confirmation automation

**Phase 2C — Content and SEO (ongoing):**
- Blog/content hub synced with YouTube topics
- Seasonal landing pages (e.g., "Мед 2025 врожай")
- More detailed product pages with video embeds
- FAQ expansion based on real customer questions

**Phase 2D — Scale (6-12 months):**
- EU market landing page (translated)
- European payment methods
- Broader eco / garden product line
- Subscription honey delivery

---

## 9. Visual Direction and Design Principles

**Overall feel:** Modern Ukrainian family brand. Warm and clean. Premium but grounded.

**Color palette direction:**
- Primary: warm amber / honey gold (natural, product-rooted)
- Secondary: deep forest green (nature, trust, apiary)
- Neutral: warm off-white / cream (not stark white)
- Text: near-black warm tone (not pure #000)
- Accents: muted terracotta or sage for highlights

**Typography:**
- Primary heading font: Modern serif or semi-serif (trustworthy, not clinical)
- Body font: Clean readable sans-serif
- Ukrainian language support required (all text in Ukrainian by default)

**Photography direction:**
- Real photos only — no stock photos
- Apiary location shots
- Honey jars with natural backgrounds
- Family/process photos (builds trust)
- Seasonal shots (spring bloom, sunflowers, linden trees)

**Layout principles:**
- Full-width hero sections with strong imagery
- Clean grid for product listings
- Generous whitespace — premium feel
- Mobile-first (majority of Ukrainian social traffic is mobile)
- No cluttered sidebars
- CTAs are clear, high-contrast, never buried

**What to avoid:**
- Clipart bees, cartoons, yellow/black striped clichés
- Fake discount badges ("50% off!!!")
- Dense walls of text
- Dark or gothic styling
- Anything that looks like a template

---

## 10. Trust-Building Elements

Trust is the primary sales mechanism for this brand. Every page should contribute.

**Primary trust signals:**
1. **Real photos** of the apiary, the family, the products — non-negotiable
2. **Location specificity** — Коротич, Харківська область. Real place = real people
3. **YouTube channel** — existing audience proves credibility. Embed or prominently link
4. **Product transparency** — honey types named honestly, breeds specified for bees
5. **Seasonal honesty** — communicate that availability varies (seasonal product)
6. **No fake prices** — do not show "crossed out" fake RRP pricing
7. **Phone number visible** — Ukrainian buyers trust brands they can call
8. **Customer reviews** — real quotes, even if curated manually at launch
9. **Process content** — photos/videos of extraction, hive management, packaging
10. **About page depth** — the more real the story, the more trust it builds

**Secondary trust signals:**
- Professional design (signals investment and seriousness)
- Fast page load (technical trust)
- HTTPS
- Ukrainian language by default
- Delivery policy clearly stated
- Privacy policy / terms (basic)

---

## 11. Content Strategy Integration

**YouTube is the primary content engine.** The website does not need to compete with it — it should convert viewers who already trust the brand.

**Integration approach:**
- Hero section or About page: embed or link to latest/best YouTube video
- Home page: YouTube channel section with thumbnail preview + subscriber count
- Product pages: link to relevant YouTube videos ("Як ми збираємо акацієвий мед")
- Do NOT auto-embed videos on every page (performance)
- Use YouTube thumbnails as trust imagery where appropriate

**Social proof integration:**
- Instagram: embed feed widget or curated screenshots on home/about
- Facebook: link to page, potentially embed reviews
- TikTok: link from footer/social icons

**Content calendar (Phase 2):**
At launch, no blog is needed. YouTube is the blog. After launch, create a simple content section that mirrors YouTube topics (seasonal honey, beekeeping guides) for SEO value.

**Seasonal content triggers:**
- Spring: bee packages, early honey harvest, Акація season
- Summer: main honey harvest, sunflower honey
- Autumn: closing season, late honey, propolis
- Winter: gift sets, wholesale inquiry push

---

## 12. SEO Foundation Recommendations

**Ukrainian-language SEO is the priority at launch.**

**Target keywords (Ukrainian):**
- Купити мед Харків / мед Харківська область
- Акацієвий мед купити
- Природний мед прямо від пасічника
- Бджолопакети Харків / продаж бджолопакетів
- Вулики купити Харків
- Мед оптом Харків

**On-page SEO basics:**
- Unique `<title>` and `<meta description>` per page
- Proper heading hierarchy (H1 → H2 → H3)
- Product pages: structured data (Product schema)
- Local business schema for location/contact page
- Open Graph tags for all pages (social sharing)
- Sitemap.xml generated automatically
- robots.txt

**Image SEO:**
- All product images: descriptive Ukrainian alt text
- Compress and serve WebP
- Use consistent naming (akatsiya-med-1l.webp)

**Technical SEO:**
- Next.js with SSR/SSG — pages are indexable
- Fast load times (Core Web Vitals)
- Mobile-friendly (ranking factor)
- Ukrainian hreflang for future EU expansion

**Local SEO:**
- Google Business Profile — register or claim for Коротич location
- Include full address in footer schema markup
- Consistent NAP (Name, Address, Phone) across all pages

---

## 13. Admin / Order Handling Recommendations

**At launch — fully manual, low-tech:**

1. Customer submits inquiry/order form
2. Form submission triggers email notification to owner
3. Optional: Telegram bot notification (more reliable for mobile)
4. Owner reviews the inquiry
5. Owner calls customer back within agreed timeframe
6. Order is agreed via phone
7. Payment: bank transfer (monobank send link) or cash on delivery
8. Shipping: owner books Nova Poshta manually

**What to track manually at launch:**
- Keep a simple Google Sheet or Notion table of orders
- Log: date, customer name, phone, product, qty, status, notes
- This is sufficient for v1 volume

**When to automate (trigger points):**
- 10+ orders per week → add Telegram bot notifications
- 20+ orders per week → add simple order management in admin panel
- 50+ orders per week → proper e-commerce checkout needed

---

## 14. Manual vs Automated at Launch

| Function | v1 Approach | Automate when |
|---|---|---|
| Order intake | Form → email to owner | Volume > 10/week |
| Order confirmation to buyer | Manual phone call | Volume > 20/week |
| Payment | Bank transfer / cash | Volume > 30/week |
| Shipping booking | Manual Nova Poshta | Volume > 20/week |
| Inquiry routing | Email inbox | Multiple products/staff |
| Review collection | Ask manually, post manually | Phase 2 |
| Inventory display | Static (update manually) | Phase 2 |
| Newsletter | Not at launch | Phase 2 |
| SEO tracking | Google Search Console (free) | From day 1 |
| Analytics | Google Analytics 4 (free) | From day 1 |

---

## 15. Launch Checklist

### Content
- [ ] All product descriptions written in Ukrainian
- [ ] About page story written and approved
- [ ] Real product photos provided (minimum: all honey types)
- [ ] Apiary / family photos provided
- [ ] Delivery terms written and approved
- [ ] FAQ written
- [ ] Phone number confirmed
- [ ] Contact details reviewed

### Technical
- [ ] Domain configured and HTTPS active
- [ ] All pages rendering correctly on mobile
- [ ] All forms sending email notifications correctly
- [ ] Google Analytics 4 installed and verified
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] robots.txt configured
- [ ] OG images set for social sharing
- [ ] Page load speed tested (target < 3s on mobile)
- [ ] 404 page exists

### Business
- [ ] Google Business Profile created for Коротич location
- [ ] Phone number added to all social bios
- [ ] Website URL added to all social bios
- [ ] YouTube description updated with website link
- [ ] Owner knows how to receive and respond to form notifications
- [ ] Simple order tracking sheet ready (Google Sheets)
- [ ] Privacy policy page published (GDPR / Ukrainian law minimum)
