# Tech Summary - PromptPlace (formerly Becodemy)

**Generated:** October 19, 2024

## Framework & Core

| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| **Next.js** | latest (13.5.3) | ⚠️ OUTDATED | Should upgrade to 14.x LTS for better stability |
| **React** | latest (18.x) | ✅ CURRENT | Good |
| **TypeScript** | latest (5.x) | ✅ CURRENT | Good |
| **Node.js** | 20.19.5 | ✅ CURRENT | LTS version |

## Routing Mode
**App Router** (`/app` directory) - Modern Next.js 13+ pattern

## UI & Styling

| Library | Version | Purpose |
|---------|---------|---------|
| **TailwindCSS** | latest | Utility-first styling |
| **NextUI** | 2.1.13 | Component library (React Aria) |
| **MUI (Material-UI)** | 5.14.12 | Used for data grids |
| **Framer Motion** | 10.16.4 | Animations |
| **React Icons** | 4.11.0 | Icon library |

## Database & ORM

| Technology | Version | Notes |
|------------|---------|-------|
| **Prisma** | 5.3.1 (client), 5.5.2 (CLI) | ⚠️ Version mismatch - should align |
| **MongoDB** | 6.0.26 | Local (replica set: rs0) |
| **Database** | Local MongoDB | Switch to MongoDB Atlas or Supabase for production |

## Authentication & Payments

| Service | Version | Status |
|---------|---------|--------|
| **Clerk** | 4.25.1 | 🔄 CURRENTLY MOCKED | Will replace with Supabase |
| **Stripe** | 14.1.0 | 🔄 MOCKED | Ready for real integration |
| **Cloudinary** | 1.41.0 | 🔄 MOCKED | Using local storage in demo |

## Other Dependencies

- **Axios** 1.5.1 - HTTP client
- **React Hot Toast** 2.4.1 - Notifications
- **Recharts** 2.9.2 - Analytics charts
- **timeago.js** 4.0.2 - Relative time formatting

---

## Current Architecture

### Mode: DEMO MODE ACTIVE
- **Auth:** Cookie-based sessions (3 preset users)
- **Uploads:** Local file system (`/public/uploads`)
- **Payments:** Fake instant checkout
- **Database:** Local MongoDB with replica set

### File Structure
```
app/                    # Next.js App Router
├── (Main)/            # Public pages
├── (Shop)/            # Seller dashboard
├── (Providers)/       # Context providers
└── api/               # API routes

components/            # React components
├── Layout/           # Header, Footer, Navigation
├── Prompts/          # Prompt cards, details
├── Shop/             # Seller components
└── Auth/             # Demo auth UI

lib/                  # Utilities & wrappers
├── auth/            # Auth wrapper (Clerk → Demo)
├── config.ts        # Feature flags
├── uploads.ts       # Upload wrapper
└── payments.ts      # Payment wrapper

prisma/              # Database schema & seed
```

---

## Known Issues

### 🔴 Critical
1. **UserContext not found** - Clerk components used without provider
2. **Image placeholders missing** - Seed images don't exist (`.txt` files instead)
3. **Clerk errors in console** - Expected in demo mode but needs cleanup

### 🟡 Medium
4. Prisma version mismatch (5.3.1 vs 5.5.2)
5. Next.js 13.5.3 is outdated (should use 14.x)
6. Multiple demo banners shown on every page compile

### 🟢 Low
7. Browserslist outdated
8. No form validation library (need react-hook-form + zod)
9. No proper error boundaries
10. Missing loading states

---

## Recommended Upgrades

### Safe Immediate Upgrades
```bash
npm install @prisma/client@5.5.2  # Align with Prisma CLI
npm install next@14.2.15          # Latest stable 14.x
npx update-browserslist-db@latest
```

### Later (Supabase Migration)
- Remove `@clerk/nextjs`
- Add `@supabase/supabase-js`
- Add `react-hook-form` + `zod`
- Add `@radix-ui/react-*` for accessible components

---

## Build & Quality Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

**Missing Scripts:**
- `typecheck` - Need to add
- `format` - Need to add (Prettier)
- `test` - No testing setup

---

## Supabase Migration Readiness

Current abstraction layer makes Supabase swap easy:

**Ready:**
- ✅ Auth wrapper interface (`lib/auth/index.ts`)
- ✅ Upload wrapper (`lib/uploads.ts`)
- ✅ Payment wrapper (`lib/payments.ts`)
- ✅ Config-driven feature flags

**Needs Work:**
- ❌ Form validation (add react-hook-form + zod)
- ❌ Proper auth UI components
- ❌ Database migration from MongoDB to Postgres
- ❌ Real-time subscriptions (if needed)

---

## Performance Notes

- ⚡ SSR/SSG not heavily utilized (mostly client components)
- ⚡ No image optimization for seed data
- ⚡ Multiple demo banners indicate re-renders
- ⚡ Could benefit from React Server Components refactor

---

## Security Notes

- 🔒 Demo mode uses localStorage (client-only, no HttpOnly cookies)
- 🔒 No CSRF protection in current setup
- 🔒 No rate limiting
- 🔒 Secrets in `.env.local` (gitignored ✅)

---

**Status:** Functional in DEMO mode. Ready for production auth/payment integration.

