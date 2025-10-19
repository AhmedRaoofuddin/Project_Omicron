'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type Role = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  role: Role;
  emailAddresses?: Array<{ emailAddress: string }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Load user on mount - only on client side
  useEffect(() => {
    setMounted(true);
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await fetch('/api/dev-auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      // In demo/local mode, we'll accept any email/password
      // In production, this would validate against a backend
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName: email.split('@')[0],
        lastName: 'User',
        imageUrl: '/demo/avatars/default.svg',
        role: 'buyer',
        emailAddresses: [{ emailAddress: email }],
      };

      const response = await fetch('/api/dev-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: mockUser }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success('Logged in successfully!');
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    }
  }

  async function signup(email: string, password: string, firstName: string, lastName: string) {
    try {
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        imageUrl: '/demo/avatars/default.svg',
        role: 'buyer',
        emailAddresses: [{ emailAddress: email }],
      };

      const response = await fetch('/api/dev-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: newUser }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success('Account created successfully!');
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    }
  }

  async function logout() {
    try {
      await fetch('/api/dev-auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed');
    }
  }

  async function loginDemo(role: Role) {
    try {
      const response = await fetch('/api/dev-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: role }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success(`Logged in as ${role}`);
        router.refresh();
      } else {
        throw new Error('Demo login failed');
      }
    } catch (error) {
      toast.error('Demo login failed');
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loginDemo,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

