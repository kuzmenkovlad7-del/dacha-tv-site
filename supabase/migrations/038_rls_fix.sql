-- Migration 038: RLS policies for services + dropshipping tables
-- Root cause of empty public /services page: the services table was created in
-- migration 035 without RLS policies. All other storefront tables (honey, apiary,
-- beekeeper, flower, reviews, faq) follow the pattern from migration 001:
--   ENABLE ROW LEVEL SECURITY + public SELECT policy + service_role ALL policy.
-- The anon key cannot read rows without a matching policy when RLS is enabled.
-- Idempotent — safe to re-run.

-- ─── services (public storefront read + admin write) ─────────────────────────

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_services"
  ON services FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "service_role_all_services"
  ON services FOR ALL USING (auth.role() = 'service_role');

-- ─── product_media (public storefront read + admin write) ────────────────────

ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_product_media"
  ON product_media FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "service_role_all_product_media"
  ON product_media FOR ALL USING (auth.role() = 'service_role');

-- ─── Dropshipping tables (service_role admin only — no public access yet) ────
-- These tables require migration 037 to have been run first.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'supplier_categories'
  ) THEN
    ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

CREATE POLICY IF NOT EXISTS "service_role_all_supplier_categories"
  ON supplier_categories FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'supplier_products'
  ) THEN
    ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

CREATE POLICY IF NOT EXISTS "service_role_all_supplier_products"
  ON supplier_products FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'catalog_products'
  ) THEN
    ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Only published catalog products are visible to public
CREATE POLICY IF NOT EXISTS "public_read_published_catalog_products"
  ON catalog_products FOR SELECT USING (status = 'published');

CREATE POLICY IF NOT EXISTS "service_role_all_catalog_products"
  ON catalog_products FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'supplier_sync_log'
  ) THEN
    ALTER TABLE supplier_sync_log ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

CREATE POLICY IF NOT EXISTS "service_role_all_supplier_sync_log"
  ON supplier_sync_log FOR ALL USING (auth.role() = 'service_role');
