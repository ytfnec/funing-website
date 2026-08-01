-- Funing Electronics D1 Database Schema

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sub_title TEXT,
  price_range TEXT,
  category TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  hero_image TEXT,
  gallery_images TEXT,
  specifications TEXT,
  features TEXT,
  warranty_info TEXT,
  installation_info TEXT,
  electrical_requirements TEXT,
  lead_time TEXT,
  in_stock INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price_adjustment INTEGER DEFAULT 0,
  attributes TEXT,
  in_stock INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  settings TEXT,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  location TEXT,
  message TEXT,
  product_interest TEXT,
  preferred_contact TEXT,
  best_time TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  status TEXT DEFAULT 'active',
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'editor',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_library (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  r2_key TEXT NOT NULL,
  r2_bucket TEXT,
  alt_text TEXT,
  tags TEXT,
  uploaded_by TEXT REFERENCES admin_users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_page_section ON content_blocks(page, section);
CREATE INDEX IF NOT EXISTS idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted ON contact_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_media_r2_key ON media_library(r2_key);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);

-- Triggers
CREATE TRIGGER IF NOT EXISTS trigger_products_updated
AFTER UPDATE ON products
BEGIN
  UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_content_blocks_updated
AFTER UPDATE ON content_blocks
BEGIN
  UPDATE content_blocks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_contact_submissions_updated
AFTER UPDATE ON contact_submissions
BEGIN
  UPDATE contact_submissions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Seed: site settings
INSERT OR IGNORE INTO site_settings (key, value, description) VALUES
  ('site_name', 'Funing Electronics', 'Site name'),
  ('site_tagline', 'Precision Electronic Control Systems. Engineered in Yantai, China.', 'Tagline'),
  ('contact_email', 'info@fnec.net', 'Contact email'),
  ('contact_phone', '+86 535-6778069', 'Contact phone');

-- Seed: products
INSERT OR IGNORE INTO products (id, slug, name, sub_title, price_range, category, short_description, in_stock, sort_order) VALUES
  ('prod-sauna-controllers', 'sauna-controllers', 'Sauna Control Systems', 'Infrared · Touch Panel · LED', 'Sample pricing', 'sauna-control', 'Embedded MCU controllers for infrared saunas with touch-key interface and LED output.', 1, 1),
  ('prod-jacquard-drivers', 'jacquard-drivers', 'Jacquard Machine Drivers', 'Textile · Electronic Control · Driver Cards', 'Volume pricing', 'industrial-control', 'High-speed driver cards and electronic control modules for jacquard weaving machines.', 1, 2),
  ('prod-branded-units', 'branded-units', 'Branded Sauna Units', 'Authorized Distributor · Health Mate · Samick', 'Wholesale pricing', 'sauna-control', 'Authorized distributor of premium infrared sauna brands with full warranty support.', 1, 3),
  ('prod-accessories', 'accessories', 'Components & Accessories', 'LED Boards · Sensors · Cables · Heaters', 'Bulk pricing', 'components', 'OEM replacement parts and add-on modules for sauna and industrial control systems.', 1, 4);
