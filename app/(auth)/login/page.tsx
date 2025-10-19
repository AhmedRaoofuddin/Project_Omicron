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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Welcome to <span className="text-[#64ff4c]">PromptPlace</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
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
                  input: "text-white",
                  inputWrapper: "border-gray-600 data-[hover=true]:border-gray-500",
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
                  input: "text-white",
                  inputWrapper: "border-gray-600 data-[hover=true]:border-gray-500",
                }}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-[#64ff4c] text-black font-semibold hover:bg-[#52cc3d] transition-colors"
              isLoading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#64ff4c] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Logins */}
        <div className="mt-6 border-t border-gray-700 pt-6">
          <p className="text-center text-xs text-gray-500 mb-3">Quick demo access:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
              onClick={() => handleDemoLogin('buyer')}
              disabled={loading}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buyer</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-50"
              onClick={() => handleDemoLogin('seller')}
              disabled={loading}
            >
              <Store className="w-4 h-4" />
              <span>Seller</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
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

