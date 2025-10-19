# ⚡ Quick Start - AI Prompt Marketplace (DEMO Mode)

## 🎯 One-Command Startup

```bash
./start-demo.sh
```

This will:
1. ✅ Start MongoDB (if not running)
2. ✅ Initialize replica set (if needed)
3. ✅ Start Next.js dev server
4. ✅ Display demo mode banner

---

## 🌐 Access the App

Once the server starts, open:
**http://localhost:3000**

You'll see:
- 🟡 Yellow "DEMO MODE" badge (bottom-right)
- 🔐 "Demo Login" button (top-right header)

---

## 👥 Login Options

Click **"Demo Login"** in the header and choose:

| Role | Use Case | Access |
|------|----------|--------|
| **🛒 Buyer** | Purchase prompts, view orders | Marketplace, My Orders |
| **💼 Seller** | Create/manage prompts, view analytics | My Shop, Create Prompt, Shop Orders |
| **⚙️ Admin** | Full access | All features + future admin panel |

---

## 🧪 Test Flows

### 1️⃣ Browse Marketplace (No Login Required)
1. Open http://localhost:3000
2. Scroll to "Latest Prompts"
3. See 6 pre-seeded prompts
4. Click any prompt to view details

### 2️⃣ Seller: Upload New Prompt
1. Login as **Seller**
2. Navigate to "My Shop"
3. Click "Create Prompt" or "Upload Prompt"
4. Fill in:
   - Name: "My Test Prompt"
   - Description: "This is a test"
   - Price: 9.99
   - Category: "Marketing"
   - Upload cover image
5. Submit → Prompt appears in marketplace

### 3️⃣ Buyer: Purchase Prompt
1. Login as **Buyer**
2. Browse marketplace
3. Click on any prompt
4. Click "Buy Now"
5. Fake checkout completes instantly
6. Go to "My Orders" → See purchase
7. Download prompt file

### 4️⃣ Seller: View Orders & Analytics
1. Login as **Seller**
2. Go to "Shop" → "Orders"
3. See purchases made by buyers
4. View analytics dashboard

---

## 🛠️ Manual Setup (If Script Fails)

### Start MongoDB
```bash
mongod --replSet rs0 --port 27017 \
  --dbpath /opt/homebrew/var/mongodb \
  --bind_ip localhost --fork \
  --logpath /opt/homebrew/var/log/mongodb/mongo.log

mongosh --eval "rs.initiate()"
```

### Start Next.js
```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
npm run dev
```

---

## 🔄 Reset Demo Data

To reset and re-seed the database:

```bash
# Drop database
mongosh prompt_demo --eval "db.dropDatabase()"

# Re-run Prisma
export DATABASE_URL="mongodb://127.0.0.1:27017/prompt_demo?replicaSet=rs0"
npx prisma db push

# Re-seed
npx tsx prisma/seed.ts
```

---

## 🐛 Common Issues

### ❌ Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### ❌ MongoDB connection failed
```bash
brew services restart mongodb-community@6.0
mongosh --eval "rs.initiate()"
```

### ❌ "Module not found" errors
```bash
rm -rf .next node_modules
npm install
```

### ❌ Clerk errors in console
This is normal in DEMO mode! Clerk is disabled. Errors are expected and don't affect functionality.

---

## 📊 What's Working

✅ **Authentication**: Cookie-based sessions (3 demo users)
✅ **Database**: Local MongoDB with 6 seeded prompts
✅ **Uploads**: Files saved to `/public/uploads/`
✅ **Payments**: Instant fake checkout
✅ **UI**: Full Next.js app with TailwindCSS
✅ **Navigation**: All routes and pages
✅ **Forms**: Create prompts, shops, reviews
✅ **Search**: Filter and browse prompts
✅ **Orders**: Track purchases and sales
✅ **Analytics**: View seller statistics

---

## 🚀 Next Steps

### Want to add features?
- Modify components in `/components/`
- Add API routes in `/app/api/`
- Update database schema in `/prisma/schema.prisma`

### Ready for production?
1. See `README.md` for production setup
2. Set `DEV_DEMO_MODE=0` in `.env.local`
3. Add real Clerk, Stripe, Cloudinary keys
4. Deploy to Vercel/Netlify

---

## 📚 Documentation

- **DEMO_MODE_SUMMARY.md** - Complete technical details
- **README.md** - Full setup guide (demo + production)
- **.env.example** - Environment template
- **SETUP_GUIDE.md** - External service setup

---

## 💬 Support

Having issues? Check:
1. Console for error messages
2. DEMO_MODE_SUMMARY.md troubleshooting section
3. Make sure MongoDB is running
4. Verify Node.js version >= 18

---

**Enjoy testing your AI Prompt Marketplace! 🎉**

