import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Enter your details below to create your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-200'} py-2.5 pr-3 pl-10 text-sm transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="John Doe"
              required
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-200'} py-2.5 pr-3 pl-10 text-sm transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="you@example.com"
              required
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-200'} py-2.5 pr-10 pl-10 text-sm transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPasswordConfirmation ? 'text' : 'password'}
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className={`w-full rounded-lg border ${errors.password_confirmation ? 'border-red-500' : 'border-slate-200'} py-2.5 pr-10 pl-10 text-sm transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswordConfirmation(!showPasswordConfirmation)
              }
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPasswordConfirmation ? (
                <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:bg-indigo-700 hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {processing ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
