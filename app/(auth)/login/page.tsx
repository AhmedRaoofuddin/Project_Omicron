'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { styles } from '@/utils/styles';
import { ShoppingCart, Store, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const mockUser = {
        id: `user_${Date.now()}`,
        email: data.email,
        firstName: data.email.split('@')[0],
        lastName: 'User',
        imageUrl: '/demo/avatars/default.svg',
        role: 'buyer',
      };

      const response = await fetch('/api/dev-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: mockUser }),
      });

      if (response.ok) {
        toast.success('Logged in successfully!');
        router.push('/');
        router.refresh();
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

  const handleDemoLogin = async (role: 'buyer' | 'seller' | 'admin') => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: role }),
      });

      if (response.ok) {
        toast.success(`Logged in as ${role}`);
        router.push('/');
        router.refresh();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--card-bg)] backdrop-blur-sm p-8 rounded-2xl border border-[var(--border-color)] shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-[var(--text-primary)]">
            Welcome to <span className="text-[var(--accent-primary)] dark:text-[#64ff4c]">PromptPlace</span>
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Input
                {...register('email')}
                type="email"
                label="Email address"
                placeholder="you@example.com"
                variant="bordered"
                classNames={{
                  input: "text-[var(--text-primary)]",
                  inputWrapper: "border-[var(--border-color)] data-[hover=true]:border-[var(--accent-primary)]",
                  label: "text-[var(--text-secondary)]",
                }}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="Enter your password"
                variant="bordered"
                classNames={{
                  input: "text-[var(--text-primary)]",
                  inputWrapper: "border-[var(--border-color)] data-[hover=true]:border-[var(--accent-primary)]",
                  label: "text-[var(--text-secondary)]",
                }}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-[var(--accent-primary)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors dark:bg-[#64ff4c] dark:text-black"
              isLoading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--accent-primary)] dark:text-[#64ff4c] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Logins */}
        <div className="mt-6 border-t border-[var(--border-color)] pt-6">
          <p className="text-center text-xs text-[var(--text-secondary)] mb-3">Quick demo access:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-colors disabled:opacity-50 text-[var(--text-primary)]"
              onClick={() => handleDemoLogin('buyer')}
              disabled={loading}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buyer</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg hover:border-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-50 text-[var(--text-primary)]"
              onClick={() => handleDemoLogin('seller')}
              disabled={loading}
            >
              <Store className="w-4 h-4" />
              <span>Seller</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-[var(--border-color)] rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-colors disabled:opacity-50 text-[var(--text-primary)]"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

