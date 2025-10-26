# 🎯 Supabase Setup Guide - PromptPlace

## ✅ What We're Setting Up

**Supabase Postgres Database** with:
- Full-text search (FTS) capabilities
- Vector search ready (pgvector)
- Secure Row Level Security (RLS)
- Real-time subscriptions
- RESTful API auto-generated
- Cloud-hosted & scalable

---

## 🔑 Your Credentials

**Project URL**: `https://wniddgcxljclikyfthjx.supabase.co`

**Anon Key** (Public, safe for client-side):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduaWRkZ2N4bGpjbGlreWZ0aGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NTE4NjAsImV4cCI6MjA3NzAyNzg2MH0.3rON3jGMcYTGkOg4R19URLEroDuvsyYl7Tps3lTs2UA
```

**Service Role Key** (Secret, server-only):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduaWRkZ2N4bGpjbGlreWZ0aGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NTE4NjAsImV4cCI6MjA3NzAyNzg2MH0.3rON3jGMcYTGkOg4R19URLEroDuvsyYl7Tps3lTs2UA
```

**Connection String** (needs your password):
```
postgresql://postgres:[YOUR_PASSWORD]@db.wniddgcxljclikyfthjx.supabase.co:5432/postgres
```

⚠️ **IMPORTANT**: Replace `[YOUR_PASSWORD]` with the password you set when creating the project.

---

## 📦 What's Been Installed

```bash
✅ @supabase/supabase-js  # Supabase client
✅ pg                      # PostgreSQL driver
```

---

## 🗂️ Files Created

### 1. `/lib/supabase/client.ts`
**Use**: Client components, browser code  
**Auth Level**: Public (anon key)

```typescript
import { supabase } from '@/lib/supabase/client'

// Example: Fetch data in a client component
const { data } = await supabase.from('prompts').select('*')
```

### 2. `/lib/supabase/server.ts`
**Use**: Server actions, API routes, server components  
**Auth Level**: Elevated (service role)

```typescript
import { supabaseServer } from '@/lib/supabase/server'

// Example: Admin operation in API route
const { data } = await supabaseServer.from('users').select('*')
```

---

## 🔄 Next Steps

### Step 1: Provide Database Password
I need your database password to complete the setup. Once you provide it, I'll:
- Update `.env.local` with all credentials
- Configure Prisma to use Supabase Postgres
- Create the database schema
- Enable search extensions
- Migrate your data

### Step 2: Schema Migration
I'll convert your existing MongoDB schema to PostgreSQL format:
- `Shops` → `shops` table
- `Prompts` → `prompts` table
- `Orders` → `orders` table
- `Reviews` → `reviews` table
- `Images` → `images` table

### Step 3: Enable Search Extensions
In Supabase SQL Editor, I'll run:
```sql
create extension if not exists vector;      -- Vector search (AI embeddings)
create extension if not exists pg_trgm;     -- Trigram matching (fuzzy search)
create extension if not exists unaccent;    -- Remove accents for better search
```

### Step 4: Full-Text Search Setup
Create search-optimized indexes:
```sql
-- Add tsvector column for fast full-text search
ALTER TABLE prompts ADD COLUMN search_vector tsvector;

-- Create GIN index for instant search
CREATE INDEX prompts_search_idx ON prompts USING GIN(search_vector);

-- Auto-update search vector on changes
CREATE TRIGGER prompts_search_vector_update
BEFORE INSERT OR UPDATE ON prompts
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.simple', title, description, category);
```

### Step 5: Migrate Data
I'll create a migration script to:
- Export from MongoDB
- Transform data format
- Import to Supabase
- Verify integrity

---

## 🎨 Benefits You'll Get

### 1. **Instant Search**
```typescript
// Fast full-text search (PostgreSQL FTS)
const results = await supabase.rpc('search_prompts', { query: 'chatgpt' })
```

### 2. **Real-time Updates**
```typescript
// Subscribe to new prompts
supabase
  .channel('prompts')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prompts' }, 
    (payload) => console.log('New prompt:', payload.new))
  .subscribe()
```

### 3. **Row Level Security**
```sql
-- Users can only see their own orders
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);
```

### 4. **Vector Search (Future)**
```typescript
// Find similar prompts by embedding
const { data } = await supabase.rpc('match_prompts', {
  query_embedding: embedding,
  match_threshold: 0.8,
  match_count: 10
})
```

---

## 📊 Database Comparison

| Feature | MongoDB (Current) | Supabase Postgres (New) |
|---------|------------------|------------------------|
| **Search** | Text indexes | Full-text + Vector + Fuzzy |
| **Joins** | $lookup (slow) | Native SQL joins (fast) |
| **Real-time** | Change streams | Built-in subscriptions |
| **Auth Integration** | Manual | Auto-syncs with Clerk |
| **Analytics** | Aggregation pipeline | SQL queries + CTEs |
| **Scaling** | Manual sharding | Auto-scaling |

---

## 🔐 Security Best Practices

### ✅ DO:
- Use `supabase` (client) for public data fetching
- Use `supabaseServer` (server) for admin operations
- Enable RLS on all tables
- Use Clerk user IDs as foreign keys

### ❌ DON'T:
- Expose service role key in client code
- Disable RLS without a reason
- Store sensitive data without encryption
- Share connection string publicly

---

## 🚨 Important Notes

### MongoDB vs PostgreSQL
- MongoDB: Document-based, flexible schema
- PostgreSQL: Relational, strict schema
- **Migration**: I'll handle all data transformation

### Prisma Configuration
- Current: MongoDB provider
- New: PostgreSQL provider
- **Change**: I'll update `schema.prisma` automatically

### No Breaking Changes
- Your current code will keep working
- I'll update database calls gradually
- Demo mode still works locally

---

## 🎯 What I Need From You

Please provide:
1. **Database password** (the one you created in Supabase dashboard)

That's it! Once I have the password, I'll:
- ✅ Update `.env.local`
- ✅ Configure Prisma
- ✅ Create tables
- ✅ Enable extensions
- ✅ Migrate data
- ✅ Update search API
- ✅ Test everything

---

## 📞 Support Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/wniddgcxljclikyfthjx
- **Supabase Docs**: https://supabase.com/docs
- **SQL Editor**: https://supabase.com/dashboard/project/wniddgcxljclikyfthjx/sql
- **Database**: https://supabase.com/dashboard/project/wniddgcxljclikyfthjx/database/tables

---

**Ready to continue! Please provide your database password.** 🚀

