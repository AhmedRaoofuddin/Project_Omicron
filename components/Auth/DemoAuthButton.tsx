"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShoppingCart, Store, Settings } from "lucide-react";

export default function DemoAuthButton() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await fetch('/api/dev-auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  const handleDemoLogin = async (preset: 'buyer' | 'seller' | 'admin') => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast.success(`Logged in as ${preset}`);
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev-auth/logout', { method: 'POST' });
      
      if (response.ok) {
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/');
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2190ff] px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 hover:bg-[#1a7ad9] transition-colors"
        disabled={loading}
      >
        {user ? (
          <>
            <img 
              src={user.imageUrl || '/demo/avatars/default.svg'} 
              alt="avatar" 
              className="w-7 h-7 rounded-full object-cover border-2 border-white/20" 
            />
            <span>{user.firstName || 'User'}</span>
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
            {user ? (
              <div>
                <div className="px-4 py-3 border-b bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors font-medium text-gray-900 border-b"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign Up
                </Link>
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <p className="text-xs text-gray-600 font-medium">Quick Demo Access:</p>
                </div>
                <button
                  onClick={() => handleDemoLogin('buyer')}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>Demo Buyer</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('seller')}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 transition-colors flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-green-600" />
                  <span>Demo Seller</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span>Demo Admin</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

