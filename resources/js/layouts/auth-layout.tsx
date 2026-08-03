import { ReactNode } from 'react';
import { Store } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="rounded-xl bg-indigo-600 p-2.5 shadow-lg shadow-indigo-200">
              <Store className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">
              Smart Laundry
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Smart Laundry System. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
