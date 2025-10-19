'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/providers/auth-provider';
import { useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@nextui-org/react';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signup(data.email, data.password, data.firstName, data.lastName);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Join <span className="text-[#64ff4c]">PromptPlace</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                type="text"
                label="First Name"
                placeholder="John"
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-600 data-[hover=true]:border-gray-500",
                }}
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName?.message}
              />

              <Input
                {...register('lastName')}
                type="text"
                label="Last Name"
                placeholder="Doe"
                variant="bordered"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-600 data-[hover=true]:border-gray-500",
                }}
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName?.message}
              />
            </div>

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

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="At least 6 characters"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "border-gray-600 data-[hover=true]:border-gray-500",
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />

            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "border-gray-600 data-[hover=true]:border-gray-500",
              }}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-[#64ff4c] text-black font-semibold hover:bg-[#52cc3d] transition-colors"
              isLoading={loading}
              size="lg"
            >
              Create Account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#64ff4c] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

