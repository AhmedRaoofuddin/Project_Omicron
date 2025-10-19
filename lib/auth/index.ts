/**
 * Unified auth API - automatically switches between DEMO and Clerk
 * based on DEV_DEMO_MODE environment variable
 */

import { config } from '../config';

// Types
export type { DemoUser as User } from './types';

/**
 * Get current authenticated user
 * Compatible with Clerk's currentUser()
 */
export async function currentUser() {
  if (config.demo) {
    const { getDemoUser } = await import('./demo-auth');
    return getDemoUser();
  } else {
    const { currentUser: clerkCurrentUser } = await import('@clerk/nextjs/server');
    return clerkCurrentUser();
  }
}

/**
 * Require authenticated user (throws if not authenticated)
 */
export async function requireUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Get auth object (userId, sessionId, etc.)
 */
export async function auth() {
  if (config.demo) {
    const { getDemoSession } = await import('./demo-auth');
    const session = await getDemoSession();
    return {
      userId: session?.userId || null,
      sessionId: session ? 'demo_session' : null,
    };
  } else {
    const { auth: clerkAuth } = await import('@clerk/nextjs/server');
    return clerkAuth();
  }
}

/**
 * Clerk client for fetching user data
 */
export const clerkClient = new Proxy({} as any, {
  get(_target, prop) {
    if (prop === 'users') {
      return {
        async getUser(userId: string) {
          if (config.demo) {
            const { demoClerkClient } = await import('./demo-auth');
            return demoClerkClient.users.getUser(userId);
          } else {
            const { clerkClient: realClerkClient } = await import('@clerk/nextjs');
            return realClerkClient.users.getUser(userId);
          }
        },
      };
    }
    return undefined;
  },
});

