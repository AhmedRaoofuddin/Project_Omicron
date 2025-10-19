# Refactor Log - PromptPlace Migration

**Date:** October 19, 2024  
**Objective:** Fix all errors, rebrand to PromptPlace, create production-ready auth system

---

## Phase 0: Initial Assessment ✅

**Issues Found:**
1. ❌ UserContext not found error on `/create-shop`
2. ❌ Clerk errors despite demo mode
3. ❌ Missing image files (prompt placeholders)
4. ❌ Brand still shows "Becodemy"
5. ❌ No proper auth UI for login/signup
6. ❌ Demo banner shows multiple times

---

## Phase 1: Critical Error Fixes 🔄 IN PROGRESS

### 1.1 Fix ClerkProvider Error
**File:** `app/layout.tsx`
**Change:** Conditionally render ClerkProvider only in production mode
**Reason:** ClerkProvider requires API keys; in demo mode we bypass it entirely
**Status:** ✅ DONE

### 1.2 Fix Sign-in/Sign-up Pages
**Files:** 
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`

**Change:** Add demo mode check and redirect to home
**Reason:** These pages use Clerk components that break in demo mode
**Status:** ✅ DONE

### 1.3 Create Real Image Placeholders
**Files:** 
- `public/demo/seed/prompt-placeholder.png` (need to create actual PNG)
- `public/placeholders/` (new directory)

**Status:** ⏳ TODO

### 1.4 Fix UserContext Error in create-shop
**File:** `app/create-shop/page.tsx`
**Issue:** Uses Clerk's `useUser()` hook without provider
**Solution:** Replace with our auth wrapper
**Status:** ⏳ TODO

---

## Phase 2: Rebrand to PromptPlace ⏳ TODO

### Files to Update:
- [ ] `app/layout.tsx` - metadata
- [ ] `README.md` - title, description
- [ ] `package.json` - name
- [ ] All component files with "Becodemy" strings
- [ ] `public/` assets (favicon, logo, og-image)
- [ ] SEO meta tags

### Search & Replace Strategy:
```bash
# Find all occurrences
grep -r "Becodemy" --include="*.tsx" --include="*.ts" --include="*.md"
grep -r "becodemy" --include="*.tsx" --include="*.ts" --include="*.md"
```

---

## Phase 3: Production Auth System ⏳ TODO

### 3.1 Create Auth Provider
**New Files:**
- `app/providers/auth-provider.tsx`
- `hooks/useAuth.ts`
- `lib/auth/local-auth-api.ts`

**Interface:**
```typescript
interface AuthAPI {
  signup(email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  loginDemo(role: 'buyer'|'seller'|'admin'): Promise<User>;
  currentUser(): Promise<User|null>;
}
```

### 3.2 Create Auth Pages
**New Files:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/logout/page.tsx`

**Dependencies to Add:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

### 3.3 Route Guards
**New Files:**
- `lib/route-guards.ts`
- `components/auth/ProtectedRoute.tsx`

---

## Phase 4: UI Fixes ⏳ TODO

### 4.1 Standardize Buttons
**New File:** `components/ui/Button.tsx`
**Consolidate:** All button variants into one component

### 4.2 Fix Image Pipeline
**New File:** `components/ui/SafeImage.tsx`
**Features:**
- Fallback on error
- Loading skeleton
- Next Image optimization

### 4.3 Add Error Boundaries
**New Files:**
- `app/error.tsx` (global error UI)
- `app/loading.tsx` (global loading UI)
- `app/not-found.tsx` (404 page)

### 4.4 Fix Demo Login Dropdown
**File:** `components/Auth/DemoAuthButton.tsx`
**Issues:**
- Improve accessibility
- Fix positioning
- Add keyboard navigation

---

## Phase 5: Data Layer ⏳ TODO

### 5.1 Mock Data
**New Files:**
- `data/mock-prompts.ts`
- `data/mock-users.ts`
- `data/mock-orders.ts`

### 5.2 API Layer
**New Directory:** `lib/api/`
**Files:**
- `prompts.ts`
- `users.ts`
- `orders.ts`

---

## Phase 6: Package Updates ⏳ TODO

### Commands to Run:
```bash
npm install @prisma/client@5.5.2
npm install next@14.2.15
npm install react-hook-form zod @hookform/resolvers
npx update-browserslist-db@latest
```

### Add New Scripts to package.json:
```json
{
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

---

## Phase 7: Documentation ⏳ TODO

### Files to Create:
- [x] `docs/tech-summary.md`
- [x] `docs/refactor-log.md` (this file)
- [ ] `docs/supabase-plan.md`
- [ ] `docs/qa-walkthrough.md`
- [ ] `.env.example` (update)

---

## Change Tracking

| File | Change | Reason | Status |
|------|--------|--------|--------|
| `app/layout.tsx` | Conditional ClerkProvider | Fix demo mode errors | ✅ |
| `app/sign-in/[[...sign-in]]/page.tsx` | Add demo redirect | Prevent Clerk errors | ✅ |
| `app/sign-up/[[...sign-up]]/page.tsx` | Add demo redirect | Prevent Clerk errors | ✅ |
| `lib/config.ts` | Created feature flags | Centralize demo mode | ✅ |
| `lib/auth/` | Created auth wrapper | Abstract Clerk → Demo | ✅ |
| `docs/tech-summary.md` | Created | Document stack | ✅ |
| `docs/refactor-log.md` | Created | Track changes | ✅ |

---

## Next Steps

1. Create actual image placeholders (PNG files)
2. Fix remaining Clerk hook usages
3. Start rebrand search & replace
4. Implement production auth system
5. Add form validation
6. Create Supabase migration plan

---

**Last Updated:** October 19, 2024 at 3:45 PM

