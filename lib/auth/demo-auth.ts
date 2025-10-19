/**
 * Demo authentication implementation
 * Uses cookies to store session data without external service
 */

import { cookies } from 'next/headers';
import { config } from '../config';
import type { DemoUser, AuthSession } from './types';

const DEMO_SESSION_COOKIE = 'demo_session';

// Convert demo user preset to full user object
function presetToUser(preset: 'buyer' | 'seller' | 'admin'): DemoUser {
  const presetData = config.demoUsers[preset];
  return {
    id: presetData.id,
    emailAddresses: [{ emailAddress: presetData.email }],
    firstName: presetData.firstName,
    lastName: presetData.lastName,
    imageUrl: presetData.imageUrl,
    username: preset,
    role: presetData.role,
  };
}

// Get current session from cookie
export async function getDemoSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(DEMO_SESSION_COOKIE);
    
    if (!sessionCookie) {
      return null;
    }
    
    const session = JSON.parse(sessionCookie.value) as AuthSession;
    return session;
  } catch (error) {
    console.error('Error reading demo session:', error);
    return null;
  }
}

// Get current user (Clerk-compatible format)
export async function getDemoUser(): Promise<DemoUser | null> {
  const session = await getDemoSession();
  if (!session) {
    return null;
  }
  
  return {
    id: session.userId,
    emailAddresses: [{ emailAddress: session.email }],
    firstName: session.firstName,
    lastName: session.lastName,
    imageUrl: session.imageUrl,
    username: session.email.split('@')[0],
    role: session.role,
  };
}

// Set session (for login)
export function setDemoSession(preset: 'buyer' | 'seller' | 'admin') {
  const presetData = config.demoUsers[preset];
  const session: AuthSession = {
    userId: presetData.id,
    email: presetData.email,
    firstName: presetData.firstName,
    lastName: presetData.lastName,
    role: presetData.role,
    imageUrl: presetData.imageUrl,
  };
  
  return session;
}

// Clear session (for logout)
export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

// Mock clerkClient for demo mode
export const demoClerkClient = {
  users: {
    async getUser(userId: string): Promise<DemoUser> {
      // In demo mode, try to match against known demo users
      const demoUser = Object.values(config.demoUsers).find(u => u.id === userId);
      
      if (demoUser) {
        return {
          id: demoUser.id,
          emailAddresses: [{ emailAddress: demoUser.email }],
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          imageUrl: demoUser.imageUrl,
          username: demoUser.email.split('@')[0],
          role: demoUser.role,
        };
      }
      
      // Return a generic demo user if not found
      return {
        id: userId,
        emailAddresses: [{ emailAddress: 'user@example.com' }],
        firstName: 'Demo',
        lastName: 'User',
        imageUrl: '/demo/avatars/default.png',
        username: 'demouser',
      };
    },
  },
};

