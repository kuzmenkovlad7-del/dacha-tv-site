-- site_settings (singleton — always one row with id=1)
create table if not exists site_settings (
  id int primary key default 1,
  phone text,
  address_full text,
  address_display text,
  telegram_url text,
  youtube_url text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  hero_tagline text,
  hero_subtext text,
  updated_at timestamptz default now()
);

-- honey_products
create table if not exists honey_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  variety text not null,
  description text,
  packaging text[],
  is_featured boolean default false,
  in_stock boolean default true,
  display_order int default 10,
  image_url text,
  image_alt text,
  youtube_video_link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- apiary_products
create table if not exists apiary_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  packaging text[],
  in_stock boolean default true,
  display_order int default 10,
  image_url text,
  image_alt text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- beekeeper_products
create table if not exists beekeeper_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  product_type text not null,
  description text,
  breeds text[],
  season_note text,
  image_url text,
  image_alt text,
  display_order int default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  city text not null,
  quote text not null,
  rating int not null check (rating between 1 and 5),
  is_visible boolean default false,
  created_at timestamptz default now()
);

-- faq_items
create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null,
  display_order int default 10,
  created_at timestamptz default now()
);

-- inquiries already exists — skip if creating
create table if not exists inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  product text,
  message text,
  source text,
  status text default 'new'
);

-- RLS: enable for all tables, allow service_role full access
alter table site_settings enable row level security;
alter table honey_products enable row level security;
alter table apiary_products enable row level security;
alter table beekeeper_products enable row level security;
alter table reviews enable row level security;
alter table faq_items enable row level security;
alter table inquiries enable row level security;

-- Public read for content tables
create policy if not exists "public_read_site_settings" on site_settings for select using (true);
create policy if not exists "public_read_honey_products" on honey_products for select using (true);
create policy if not exists "public_read_apiary_products" on apiary_products for select using (true);
create policy if not exists "public_read_beekeeper_products" on beekeeper_products for select using (true);
create policy if not exists "public_read_reviews" on reviews for select using (true);
create policy if not exists "public_read_faq_items" on faq_items for select using (true);

-- Service role full access (for admin server actions)
create policy if not exists "service_role_all_site_settings" on site_settings for all using (auth.role() = 'service_role');
create policy if not exists "service_role_all_honey_products" on honey_products for all using (auth.role() = 'service_role');
create policy if not exists "service_role_all_apiary_products" on apiary_products for all using (auth.role() = 'service_role');
create policy if not exists "service_role_all_beekeeper_products" on beekeeper_products for all using (auth.role() = 'service_role');
create policy if not exists "service_role_all_reviews" on reviews for all using (auth.role() = 'service_role');
create policy if not exists "service_role_all_faq_items" on faq_items for all using (auth.role() = 'service_role');
create policy if not exists "service_role_all_inquiries" on inquiries for all using (auth.role() = 'service_role');
