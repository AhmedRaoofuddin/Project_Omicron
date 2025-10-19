# AI Prompt Marketplace - Complete Setup Guide

## Prerequisites

1. **Node.js 18 LTS or newer** - Install from https://nodejs.org/ or use Homebrew:
   ```bash
   brew install node@20
   ```

## Step-by-Step Service Setup (All FREE)

### 1. MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a **FREE** M0 cluster (512MB)
   - Choose AWS or Google Cloud
   - Select nearest region (e.g., US-WEST-2)
   - Cluster name: e.g., "PromptMarketplace"
4. **Security Setup:**
   - Create database user: username + strong password (save these!)
   - Add IP: Click "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0) for dev
5. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prompt-marketplace?retryWrites=true&w=majority`

**Save this as DATABASE_URL**

---

### 2. Cloudinary (Free Image Hosting)

1. Go to https://cloudinary.com/users/register_free
2. Sign up for FREE account (25GB storage, 25GB bandwidth/month)
3. After login, go to Dashboard (https://console.cloudinary.com/console)
4. Copy these three values:
   - **Cloud Name** (e.g., `dxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Show" icon, e.g., `abcdefghijklmnopqrstuvwxyz`)

**Save these as CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET**

---

### 3. Clerk (Free Authentication)

1. Go to https://dashboard.clerk.com/sign-up
2. Sign up for FREE account (10,000 MAU free)
3. Create a new application:
   - Name: "Prompt Marketplace"
   - Enable: Email + Google (optional)
4. On the dashboard:
   - Copy **Publishable Key** (starts with `pk_test_...`)
   - Copy **Secret Key** (starts with `sk_test_...`)
5. **Important:** Configure allowed origins:
   - Go to "Domains" in sidebar
   - Add `http://localhost:3000` to allowed origins
   - Add `http://localhost:3000` to redirect URLs

**Save these as NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY**

---

### 4. Stripe (Free Test Mode)

1. Go to https://dashboard.stripe.com/register
2. Sign up for FREE account
3. **Stay in TEST MODE** (toggle in top-left should say "Test mode")
4. Go to Developers → API Keys (https://dashboard.stripe.com/test/apikeys)
5. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...` - click "Reveal")

**Save these as STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY**

---

## Installation Steps

Once you have all the API keys above:

### 1. Install Node.js (if not already installed)
```bash
# Check Node version (need >= 18.17)
node --version

# If not installed or old version:
brew install node@20
# OR download from https://nodejs.org/
```

### 2. Install Dependencies
```bash
cd /Users/pradeepvallat/Downloads/AI-Prompt-Selling-MarketPlace-master
npm install
```

### 3. Create Environment File

Create a file named `.env.local` in the project root with your keys:

```env
# MongoDB Atlas
DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prompt-marketplace?retryWrites=true&w=majority"

# Cloudinary
CLOUD_NAME="your_cloud_name"
CLOUD_API_KEY="your_api_key"
CLOUD_API_SECRET="your_api_secret"

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxx"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxx"
```

### 4. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## Testing Stripe Payments

Use these test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Any future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure IP whitelist includes 0.0.0.0/0
- Check username/password are URL-encoded (no special chars or escape them)
- Database user has "Read and write to any database" permission

### Clerk Authentication Issues
- Verify localhost:3000 is in allowed origins
- Clear browser cookies and try again
- Check both keys are from the same application

### Cloudinary Upload Issues
- Verify all three credentials are correct
- Check account is verified (check email)

### Build Errors
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

---

## Quick Test Checklist

After setup, test these flows:

1. ✅ Sign up with email (Clerk)
2. ✅ Create a shop (your seller profile)
3. ✅ Upload a prompt with images (Cloudinary)
4. ✅ View prompt in marketplace
5. ✅ Purchase with test card (Stripe)
6. ✅ Check "My Orders" page

---

## Need Help?

- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- Cloudinary Docs: https://cloudinary.com/documentation
- Clerk Docs: https://clerk.com/docs
- Stripe Testing: https://stripe.com/docs/testing

