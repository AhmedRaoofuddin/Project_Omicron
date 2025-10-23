# 🔍 Search Feature Documentation

## Overview

PromptPlace features a powerful, real-time search system with **Elasticsearch integration** and **automatic fallback** to database search. The search provides instant, predictive results as users type.

---

## ✨ Features

### 1. **Dual-Mode Search**
- **Elasticsearch Mode**: Fuzzy matching, advanced relevance scoring, multi-field search
- **Database Mode**: Fallback to Prisma when Elasticsearch is unavailable
- **Automatic Detection**: Seamlessly switches between modes

### 2. **Real-Time Predictive Results**
- ⚡ **300ms debounce** for smooth typing experience
- 📊 **Live dropdown** with rich preview cards
- 🎯 **Top 6 results** displayed instantly

### 3. **Rich Result Cards**
Each result shows:
- 🖼️ **Thumbnail image** (rounded, 64×64px)
- 📝 **Title** (bold, truncated)
- 🏷️ **Category** (colored pill badge)
- 💰 **Price** (green accent)
- 👤 **Seller name**
- ⭐ **Rating** (if available)

### 4. **Advanced UX**
- ⌨️ **Keyboard navigation** (↑ ↓ ↵ Esc)
- 📱 **Fully responsive** (mobile overlay, desktop dropdown)
- 🎨 **Theme-aware** (adapts to light/dark mode)
- 🔍 **Expandable search** (desktop: click to expand)
- ❌ **Clear button** (instant query reset)
- 🔄 **Loading indicator** (spinner while fetching)

### 5. **Smart Fallback**
If Elasticsearch is unavailable:
- ✅ Automatically uses Prisma database search
- ✅ Same UI/UX experience
- ✅ No errors or broken functionality
- ⚠️ Logs a warning in console

---

## 🏗️ Architecture

### Files Structure

```
lib/
  elastic.ts                    # Elasticsearch client & utilities
app/api/search/
  route.ts                      # Search API endpoint (ES + Prisma fallback)
components/Search/
  SearchBar.tsx                 # Main search component
scripts/
  syncElastic.ts                # Sync MongoDB → Elasticsearch
```

### API Endpoint

**GET** `/api/search?q={query}`

**Response**:
```json
[
  {
    "id": "68f4bedd3b5131d09ebe2d43",
    "title": "ChatGPT Prompt for Code Review",
    "description": "Get detailed code reviews...",
    "category": "Development",
    "price": 29.99,
    "sellerName": "TechPro Shop",
    "image": "/uploads/prompt-1.jpg",
    "rating": 4.8
  }
]
```

---

## 🚀 Setup Guide

### Option 1: Database Search (Default - Zero Setup)

Just start the app — search works out of the box!

```bash
npm run dev
```

**No Elasticsearch needed.** The app automatically uses Prisma.

---

### Option 2: Elasticsearch (Recommended for Production)

#### Step 1: Install Elasticsearch

**Using Docker**:
```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

**Using Homebrew** (macOS):
```bash
brew install elasticsearch
brew services start elasticsearch
```

**Verify it's running**:
```bash
curl http://localhost:9200
```

#### Step 2: Configure Environment

Add to your `.env.local`:
```bash
ELASTICSEARCH_NODE="http://localhost:9200"
ELASTICSEARCH_API_KEY=""  # Leave empty for local dev
```

#### Step 3: Sync Data

```bash
npm run sync:elastic
```

Expected output:
```
🔍 Checking Elasticsearch connection...
✅ Connected to Elasticsearch
📦 Creating index: prompts
✅ Index created: prompts
📚 Fetching prompts from database...
✅ Found 12 prompts
🔄 Syncing to Elasticsearch...
✅ Synced: 12/12

✅ Elasticsearch sync complete!
   Success: 12
   Errors: 0

🎉 Done!
```

#### Step 4: Test Search

1. Open http://localhost:3000
2. Click the search icon in the navbar
3. Type "chatgpt" or "marketing"
4. See instant results! 🎉

---

## 🎨 UI Components

### Desktop Experience

```tsx
// Collapsed state (icon only)
[🔍]  <- Click to expand

// Expanded state
[🔍 Search prompts...___________[×]]
     └─────────────┬─────────────┘
                   └─ Dropdown appears below
```

### Mobile Experience

Opens as full-width search in sidebar menu:
```
┌──────────────────────────┐
│ [🔍 Search prompts... [×]]│
│                          │
│ Results dropdown below... │
└──────────────────────────┘
```

---

## 🧪 Testing

### 1. Test Database Fallback

```bash
# Don't run Elasticsearch
npm run dev

# Search still works via Prisma ✅
```

### 2. Test Elasticsearch Mode

```bash
# Start Elasticsearch
docker start elasticsearch

# Sync data
npm run sync:elastic

# Dev server
npm run dev

# Check console - no "fallback" warning ✅
```

### 3. Test Keyboard Navigation

1. Type a query
2. Press `↓` - highlights first result
3. Press `↓` again - highlights second
4. Press `↑` - goes back up
5. Press `↵` - navigates to selected prompt
6. Press `Esc` - closes dropdown

### 4. Test Mobile

1. Open dev tools (responsive mode)
2. Open mobile menu (hamburger icon)
3. Search bar appears at top
4. Type query
5. Results appear in full-width dropdown

---

## 📊 Search Fields & Weights

Elasticsearch searches across:

| Field        | Weight | Description                    |
|-------------|--------|--------------------------------|
| `title`     | 3×     | Highest priority              |
| `description`| 1×     | Standard weight               |
| `category`  | 1×     | Exact keyword match           |
| `sellerName`| 1×     | Shop/seller name              |

**Fuzziness**: AUTO (allows typos like "chatgtp" → "chatgpt")

---

## 🔧 Customization

### Change Result Limit

In `app/api/search/route.ts`:
```typescript
size: 6,  // Change to 10, 12, etc.
```

### Change Debounce Time

In `components/Search/SearchBar.tsx`:
```typescript
const timer = setTimeout(async () => {
  // ...
}, 300);  // Change to 500ms, 200ms, etc.
```

### Add More Search Fields

In `scripts/syncElastic.ts`:
```typescript
document: {
  title: prompt.name,
  description: prompt.description || "",
  tags: prompt.tags,  // Add tags field
  // ...
}
```

Then update `app/api/search/route.ts`:
```typescript
fields: ["title^3", "description", "category", "sellerName", "tags"],
```

---

## 🐛 Troubleshooting

### Search Returns No Results

1. **Check if data is seeded**:
   ```bash
   npm run seed
   ```

2. **If using Elasticsearch, sync data**:
   ```bash
   npm run sync:elastic
   ```

3. **Check console** for fallback warnings

### Elasticsearch Connection Error

1. **Verify ES is running**:
   ```bash
   curl http://localhost:9200
   ```

2. **Check `.env.local`** has correct `ELASTICSEARCH_NODE`

3. **App will auto-fallback** to database search — no crashes!

### Search Icon Not Visible

- Check `Header.tsx` imports `SearchBar`
- Verify theme variables are defined in `globals.css`

---

## 🎯 Performance

### Database Search (Prisma)
- ⚡ ~50-100ms query time
- 📊 Works for small datasets (<10k prompts)
- 🔍 Case-insensitive `contains` matching

### Elasticsearch Search
- ⚡ ~5-20ms query time
- 📊 Scales to millions of documents
- 🔍 Fuzzy matching, relevance scoring, typo tolerance

---

## 🚢 Deployment Checklist

- [ ] Set `ELASTICSEARCH_NODE` in production env
- [ ] Set `ELASTICSEARCH_API_KEY` if using Elastic Cloud
- [ ] Run `npm run sync:elastic` after seeding
- [ ] Set up cron job to re-sync daily (optional)
- [ ] Test search on production domain
- [ ] Monitor Elasticsearch logs/metrics

---

## 📝 Next Steps

1. ✅ Search is fully functional with fallback
2. 🔄 Optionally set up Elasticsearch for production
3. 📈 Monitor search query logs for popular terms
4. 🎨 Customize result card styling if needed
5. 🔍 Add search analytics (track clicks, popular queries)

---

**Happy Searching! 🎉**

