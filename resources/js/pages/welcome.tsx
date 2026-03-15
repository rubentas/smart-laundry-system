import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Store, ChevronRight, Menu, X } from 'lucide-react';

export default function Welcome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      {/* Simple Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-600 p-1.5">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Smart Laundry
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-slate-600" />
              ) : (
                <Menu className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="space-y-1 px-4 py-3">
              <Link
                href="/login"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
          <div className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              <span className="block">Smart Laundry</span>
              <span className="block text-indigo-600">Management System</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Kelola bisnis laundry Anda dengan mudah. Pantau transaksi, kelola
              pelanggan, dan dapatkan insight bisnis dalam satu platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
              >
                Mulai Sekarang
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Simple */}
      <div className="bg-white/50 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Manajemen Order',
                description:
                  'Catat dan pantau setiap transaksi laundry dengan mudah.',
                icon: '📋',
              },
              {
                title: 'Data Pelanggan',
                description:
                  'Kelola database pelanggan dan riwayat transaksi mereka.',
                icon: '👥',
              },
              {
                title: 'Laporan Bisnis',
                description: 'Dapatkan insight dan laporan keuangan otomatis.',
                icon: '📊',
              },
              {
                title: 'Multi Cabang',
                description: 'Kelola beberapa cabang laundry dalam satu akun.',
                icon: '🏢',
              },
              {
                title: 'Tracking Status',
                description: 'Pantau status laundry secara real-time.',
                icon: '📍',
              },
              {
                title: 'Notifikasi',
                description: 'Kirim notifikasi ke pelanggan via WhatsApp.',
                icon: '📱',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-600 p-1">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-900">
                Smart Laundry
              </span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Smart Laundry System. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
