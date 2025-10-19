/**
 * Unified useUser hook - works in both DEMO and PRODUCTION modes
 * Drop-in replacement for Clerk's useUser()
 */

'use client';

import { useEffect, useState } from 'react';
import { config } from '@/lib/config';

interface User {
  id: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  email?: string;
}

interface UseUserReturn {
  user: User | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (config.demo) {
        // Demo mode: load from cookies
        try {
          const response = await fetch('/api/dev-auth/me');
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error loading demo user:', error);
          setUser(null);
        }
      } else {
        // Production mode: would use Clerk's client-side hooks
        // For now, just set null since Clerk is disabled
        setUser(null);
      }
      setIsLoaded(true);
    }

    loadUser();
  }, []);

  return {
    user,
    isLoaded,
    isSignedIn: user !== null && user !== undefined,
  };
}

