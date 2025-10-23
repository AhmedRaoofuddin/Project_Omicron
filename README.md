# PromptPlace - AI Prompts Marketplace

## 🤖 Introduction

Welcome to **PromptPlace**, a modern AI prompt marketplace where creators can sell high-quality prompts for ChatGPT, Midjourney, DALL-E, Claude, Stable Diffusion, and more. Whether you create prompts for text generation, image creation, code assistance, or creative writing—turn your expertise into income.

What makes this project even more exciting? It's fully completed and ready for deployment, allowing you to kickstart your AI startup effortlessly. Explore the added convenience of a separate Admin Dashboard, empowering you to take control of the main website seamlessly. Get ready to embark on your AI journey with this comprehensive and innovative project.

## ⚙️ Tech Stack

- Next.js
- NextUI
- TailwindCSS
- Clerk
- Prisma
- TypeScript
- Elasticsearch (optional, with Prisma fallback)


## 🤸 Getting Started

This project supports **two modes**: **DEMO** mode (no external services) and **PRODUCTION** mode (with real services).

### 🎯 DEMO Mode (Quick Start - No API Keys Required!)

Perfect for local testing and development without any external service accounts.

**Prerequisites**

- [Node.js 18+](https://nodejs.org/en)
- [MongoDB 6.0+](https://www.mongodb.com/try/download/community)

**Quick Setup**

```bash
# Clone the repository
git clone https://github.com/AhmedRaoofuddin/New_MarketPlace_PromptPlace.git
cd New_MarketPlace_PromptPlace

# Install dependencies
npm install

# Copy environment template (DEMO mode is pre-configured)
cp .env.example .env.local

# Start MongoDB as replica set
mongod --replSet rs0 --port 27017 --dbpath /path/to/data --bind_ip localhost --fork --logpath /path/to/mongo.log
mongosh --eval "rs.initiate()"

# Set up database
npx prisma db push

# Seed demo data
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll see a **DEMO MODE** badge!

**Demo Features:**
- ✅ One-click authentication (Buyer/Seller/Admin)
- ✅ Local file uploads (saved to `/public/uploads`)
- ✅ Fake payment processing (instant success)
- ✅ Pre-seeded demo prompts and shops
- ✅ Full UI testing without external dependencies
- ✅ Real-time predictive search with automatic Prisma fallback

**Demo Accounts:**
- **Buyer**: Quick "Login as Buyer" button in header
- **Seller**: Quick "Login as Seller" button in header
- **Admin**: Quick "Login as Admin" button in header

---

### 🚀 Production Mode (Full Setup)

For deployment with real authentication, payments, and cloud storage.

**Prerequisites**

Same as demo mode, plus accounts for:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier)
- [Clerk](https://dashboard.clerk.com/sign-up) (free tier)
- [Stripe](https://dashboard.stripe.com/register) (test mode)
- [Cloudinary](https://cloudinary.com/users/register_free) (free tier)

**Setup**

1. **Create `.env.local` with real credentials:**

```env
# Disable demo mode
DEV_DEMO_MODE=0

# MongoDB Atlas (replace with your connection string)
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/prompts?retryWrites=true&w=majority"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Stripe Payments
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Cloudinary Uploads
CLOUD_NAME="your_cloud_name"
CLOUD_API_KEY="your_api_key"
CLOUD_API_SECRET="your_api_secret"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

2. **Configure Clerk:**
   - Add `http://localhost:3000` to allowed origins
   - Set up sign-in/sign-up pages

3. **Configure Stripe:**
   - Stay in TEST mode for development
   - Use test cards: `4242 4242 4242 4242`

4. **Run setup:**

```bash
npx prisma generate
npx prisma db push
npm run dev
```

**Deployment Notes:**
- Set `DEV_DEMO_MODE=0` in production
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Configure webhooks for Stripe
- Update Clerk allowed domains

---

## 🔍 Search Feature

PromptPlace includes a powerful **real-time predictive search** with two modes:

### 1. **Database Search (Default - Zero Setup)**
Works out of the box using Prisma. No additional configuration needed.

### 2. **Elasticsearch (Optional - Production Recommended)**

For enhanced search with fuzzy matching and better performance:

```bash
# Start Elasticsearch (Docker)
docker run -d --name elasticsearch -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0

# Add to .env.local
ELASTICSEARCH_NODE="http://localhost:9200"
ELASTICSEARCH_API_KEY=""

# Sync your data
npm run sync:elastic
```

**Search Features:**
- ⚡ 300ms debounced real-time results
- 🎯 Multi-field search (title, description, category, seller)
- 🎨 Rich preview cards with images, prices, ratings
- ⌨️ Full keyboard navigation (↑ ↓ ↵ Esc)
- 📱 Responsive (mobile overlay, desktop dropdown)
- 🌓 Theme-aware (light/dark mode)

See [docs/SEARCH_FEATURE.md](docs/SEARCH_FEATURE.md) for detailed documentation.

---

## 🚨 Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
