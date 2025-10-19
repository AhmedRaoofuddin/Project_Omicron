# Supabase Migration Plan

**Goal:** Replace local auth system with Supabase Auth, and optionally migrate from MongoDB to Postgres.

---

## Phase 1: Supabase Auth Integration

### 1.1 Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 1.2 Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (server-only)
```

### 1.3 Create Supabase Client
**File:** `lib/supabase/client.ts`
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Client components
export const createClient = () => createClientComponentClient();

// Server components
export const createServerClient = () => 
  createServerComponentClient({ cookies });
```

### 1.4 Implement SupabaseAuthAPI
**File:** `lib/auth/supabase-auth-api.ts`

Implement the same `AuthAPI` interface:
```typescript
export class SupabaseAuthAPI implements AuthAPI {
  async signup(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return mapSupabaseUser(data.user);
  }

  async login(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return mapSupabaseUser(data.user);
  }

  async logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  async currentUser() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user ? mapSupabaseUser(user) : null;
  }

  // Demo logins stay the same for testing
  async loginDemo(role: 'buyer'|'seller'|'admin') {
    // Keep demo mode implementation
    return demoUsers[role];
  }
}
```

### 1.5 Update Auth Index
**File:** `lib/auth/index.ts`

```typescript
import { config } from '../config';
import { LocalAuthAPI } from './local-auth-api';
import { SupabaseAuthAPI } from './supabase-auth-api';

// Switch based on environment
const authAPI = config.useSupabase 
  ? new SupabaseAuthAPI() 
  : new LocalAuthAPI();

export const signup = authAPI.signup.bind(authAPI);
export const login = authAPI.login.bind(authAPI);
export const logout = authAPI.logout.bind(authAPI);
export const currentUser = authAPI.currentUser.bind(authAPI);
```

### 1.6 Update Config
**File:** `lib/config.ts`
```typescript
export const config = {
  demo: process.env.DEV_DEMO_MODE === '1',
  useSupabase: process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined,
  // ...
}
```

---

## Phase 2: Auth UI Components

### 2.1 Create Login Form
**File:** `app/(auth)/login/page.tsx`

Using `react-hook-form` + `zod`:
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await login(data.email, data.password);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### 2.2 Update Sign-in/Sign-up Pages
Replace current Clerk pages with custom forms that call `login()` and `signup()`.

### 2.3 Update useUser Hook
**File:** `hooks/useUser.ts`

```typescript
export function useUser() {
  const [user, setUser] = useState<User | null>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (config.useSupabase) {
      const supabase = createClient();
      
      // Get initial session
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ? mapUser(data.session.user) : null);
        setIsLoaded(true);
      });

      // Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ? mapUser(session.user) : null);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Local mode (existing code)
      loadLocalUser();
    }
  }, []);

  return { user, isLoaded, isSignedIn: !!user };
}
```

---

## Phase 3: Database Migration (Optional)

### 3.1 Current Schema (MongoDB/Prisma)
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

### 3.2 New Schema (Postgres/Supabase)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add Supabase-specific fields
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      String   @default("buyer")
  shops     Shop[]
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3.3 Migration Steps
1. Export data from MongoDB
2. Update Prisma schema for Postgres
3. Create Supabase project with Postgres
4. Run migrations: `npx prisma migrate dev`
5. Import data
6. Update `DATABASE_URL` to Supabase Postgres connection string

**Alternative:** Keep MongoDB, only use Supabase for Auth

---

## Phase 4: Replace Demo Mode UI

### 4.1 Remove Demo Auth Button
Delete `components/Auth/DemoAuthButton.tsx` (keep for testing)

### 4.2 Add Real Auth UI
- Sign-in form with email/password
- Sign-up form with validation
- Password reset flow
- Email verification

### 4.3 Update Header
Replace demo login button with:
- "Sign In" button (when logged out)
- User menu dropdown (when logged in)

---

## Phase 5: Testing Checklist

Before going live:
- [ ] Email/password signup works
- [ ] Email verification works (check spam)
- [ ] Login redirects correctly
- [ ] Logout clears session
- [ ] Protected routes require auth
- [ ] User profile updates work
- [ ] Shop creation works with real user ID
- [ ] Orders tied to real user accounts
- [ ] No demo mode artifacts visible

---

## Files to Modify (Summary)

| File | Change Needed |
|------|--------------|
| `lib/auth/index.ts` | Add Supabase switch |
| `lib/auth/supabase-auth-api.ts` | NEW - Implement AuthAPI |
| `lib/supabase/client.ts` | NEW - Supabase clients |
| `lib/config.ts` | Add `useSupabase` flag |
| `hooks/useUser.ts` | Add Supabase hooks |
| `app/(auth)/login/page.tsx` | Replace with real form |
| `app/(auth)/signup/page.tsx` | Replace with real form |
| `app/(auth)/reset-password/page.tsx` | NEW |
| `components/Layout/Header.tsx` | Remove demo button |
| `middleware.ts` | Add Supabase middleware |
| `package.json` | Add Supabase deps |
| `.env.local` | Add Supabase keys |

---

## Rollback Plan

If issues arise:
1. Set `DEV_DEMO_MODE=1` in `.env.local`
2. Comment out Supabase code
3. Use local auth system
4. Debug Supabase integration separately

---

## Timeline Estimate

- **Phase 1 (Auth Integration):** 2-3 hours
- **Phase 2 (UI Components):** 3-4 hours
- **Phase 3 (DB Migration):** 4-6 hours (optional)
- **Phase 4 (UI Cleanup):** 1-2 hours
- **Phase 5 (Testing):** 2-3 hours

**Total:** 12-18 hours (1-2 days)

---

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)

