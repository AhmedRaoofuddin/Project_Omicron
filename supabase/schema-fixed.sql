-- PromptPlace Database Schema for Supabase PostgreSQL
-- Fixed version: Uses trigger for FTS (no immutable generated column)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Trigram matching for fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";     -- Remove accents for better search
CREATE EXTENSION IF NOT EXISTS "vector";       -- Vector search for AI embeddings (optional)

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  total_sales INTEGER DEFAULT 0,
  all_products INTEGER DEFAULT 0,
  ratings REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts table with FTS (trigger-based)
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT,
  tags TEXT,
  price NUMERIC(10,2) NOT NULL,
  estimated_price NUMERIC(10,2),
  image_url TEXT,
  rating REAL DEFAULT 0,
  status TEXT DEFAULT 'Live',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector TSVECTOR  -- Updated by trigger
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt files table
CREATE TABLE IF NOT EXISTS prompt_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  prompt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT,
  payment_method TEXT DEFAULT 'stripe',
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banks table (for seller payouts)
CREATE TABLE IF NOT EXISTS banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bank_name TEXT,
  account_number TEXT,
  routing_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES (for performance)
-- ========================================

CREATE INDEX IF NOT EXISTS idx_prompts_fts ON prompts USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_shop ON prompts(shop_id);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON prompts(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_prompt ON orders(prompt_id);
CREATE INDEX IF NOT EXISTS idx_reviews_prompt ON reviews(prompt_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_owner ON shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk ON users(clerk_id);

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to update search_vector for prompts (immutable-safe)
CREATE OR REPLACE FUNCTION trg_prompts_search_vector()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    unaccent(coalesce(NEW.title, '') || ' ' ||
             coalesce(NEW.description, '') || ' ' ||
             coalesce(NEW.category, '') || ' ' ||
             coalesce(NEW.tags, ''))
  );
  RETURN NEW;
END$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger for search_vector on INSERT
DROP TRIGGER IF EXISTS tsv_prompts_ins ON prompts;
CREATE TRIGGER tsv_prompts_ins
BEFORE INSERT ON prompts
FOR EACH ROW EXECUTE FUNCTION trg_prompts_search_vector();

-- Trigger for search_vector on UPDATE (only when title/description/category/tags change)
DROP TRIGGER IF EXISTS tsv_prompts_upd ON prompts;
CREATE TRIGGER tsv_prompts_upd
BEFORE UPDATE OF title, description, category, tags ON prompts
FOR EACH ROW EXECUTE FUNCTION trg_prompts_search_vector();

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Public read policies (marketplace data)
DROP POLICY IF EXISTS "Public read for prompts" ON prompts;
CREATE POLICY "Public read for prompts" ON prompts FOR SELECT USING (status = 'Live');

DROP POLICY IF EXISTS "Public read for shops" ON shops;
CREATE POLICY "Public read for shops" ON shops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for reviews" ON reviews;
CREATE POLICY "Public read for reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for images" ON images;
CREATE POLICY "Public read for images" ON images FOR SELECT USING (true);

-- Users can view their own data
DROP POLICY IF EXISTS "Users see own data" ON users;
CREATE POLICY "Users see own data" ON users FOR SELECT USING (auth.uid()::text = clerk_id);

DROP POLICY IF EXISTS "Users see own orders" ON orders;
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid()::text = (SELECT clerk_id FROM users WHERE id = buyer_id));

-- Sellers can manage their shops
DROP POLICY IF EXISTS "Sellers manage own shops" ON shops;
CREATE POLICY "Sellers manage own shops" ON shops FOR ALL USING (auth.uid()::text = (SELECT clerk_id FROM users WHERE id = owner_id));

-- Success message
SELECT 'Database schema created successfully!' AS message;

