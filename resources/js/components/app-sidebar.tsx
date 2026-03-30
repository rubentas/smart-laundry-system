import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Activity,
  LogOut,
  ChevronRight,
  Store,
  Receipt,
  CreditCard,
  LineChart,
  HelpCircle,
  Brain,
  Settings2,
  Truck,
  Award,
  Database,
  Ticket,
  History,
  User,
} from 'lucide-react';
import { useState } from 'react';
import BranchSelector from '@/components/branch-selector';

type PageProps = {
  auth: {
    user: {
      name: string;
      email: string;
      roles?: Array<{ name: string }>;
      branch_id?: number | null;
    };
  };
  branches?: Array<{ id: number; name: string; code: string }>;
  currentBranchId?: number | null;
};

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

type MenuConfig = Record<
  'owner' | 'branch_admin' | 'cashier' | 'customer',
  MenuItem[]
>;

export function AppSidebar() {
  const page = usePage<PageProps>();
  const { auth, branches = [], currentBranchId = null } = page.props;
  const url = page.url;
  const user = auth.user;
  const [collapsed, setCollapsed] = useState(false);

  // Menu definitions per role
  const menuConfig: MenuConfig = {
    owner: [
      { title: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
      { title: 'Analytics', href: '/owner/analytics', icon: LineChart },
      { title: 'Cabang', href: '/owner/branches', icon: Building2 },
      { title: 'Layanan', href: '/owner/services', icon: Package },
      { title: 'Pelanggan', href: '/owner/customers', icon: Users },
      { title: 'Transaksi', href: '/owner/orders', icon: ShoppingBag },
      { title: 'Pembayaran', href: '/owner/payments', icon: CreditCard },
      { title: 'Laporan', href: '/owner/reports', icon: BarChart3 },
      { title: 'Kurir', href: '/owner/couriers', icon: Truck },
      { title: 'Loyalty', href: '/owner/loyalty', icon: Award },
      { title: 'Activity Logs', href: '/owner/activity-logs', icon: Activity },
      { title: 'AI Insights', href: '/owner/ai/insights', icon: Brain },
      { title: 'Backup', href: '/owner/backups', icon: Database },
      {
        title: 'Pengaturan',
        href: '/owner/business/settings',
        icon: Settings2,
      },
    ],
    branch_admin: [
      { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { title: 'Layanan', href: '/admin/services', icon: Package },
      { title: 'Pelanggan', href: '/admin/customers', icon: Users },
      { title: 'Transaksi', href: '/admin/orders', icon: ShoppingBag },
      { title: 'Pembayaran', href: '/admin/payments', icon: CreditCard },
      { title: 'Laporan', href: '/admin/reports', icon: BarChart3 },
      { title: 'Kurir', href: '/admin/couriers', icon: Truck },
      { title: 'Analytics', href: '/admin/analytics', icon: LineChart },
    ],
    cashier: [
      { title: 'Dashboard', href: '/cashier/dashboard', icon: LayoutDashboard },
      { title: 'Transaksi', href: '/cashier/orders', icon: ShoppingBag },
      { title: 'Pelanggan', href: '/cashier/customers', icon: Users },
      { title: 'Pembayaran', href: '/cashier/payments', icon: CreditCard },
      { title: 'Promo', href: '/cashier/promo', icon: Ticket },
    ],
    customer: [
      {
        title: 'Dashboard',
        href: '/customer/dashboard',
        icon: LayoutDashboard,
      },
      { title: 'Order Saya', href: '/customer/orders', icon: Receipt },
      { title: 'Loyalty', href: '/customer/loyalty', icon: Award },
      { title: 'Riwayat Poin', href: '/customer/points', icon: History },
      { title: 'Profil', href: '/customer/profile', icon: User },
    ],
  };

  // Get user role
  const userRole = user.roles?.[0]?.name || 'customer';
  const menuItems = menuConfig[userRole as keyof typeof menuConfig] || [];

  const isActive = (href: string) => url.startsWith(href);

  return (
    <aside
      className={`flex h-screen flex-col bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-600 p-1.5">
            <Store className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white">Smart Laundry</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 transition-colors hover:bg-slate-700"
        >
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="border-b border-slate-700 px-4 py-3">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <span className="capitalize">{userRole.replace('_', ' ')}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>{user.email}</span>
          </div>
        </div>
      )}

      {/* Branch Selector for Owner */}
      {!collapsed && userRole === 'owner' && branches.length > 0 && (
        <div className="border-b border-slate-700 px-4 py-3">
          <label className="mb-2 block text-xs font-medium text-slate-400">
            Pilih Cabang
          </label>
          <BranchSelector
            branches={branches}
            currentBranchId={currentBranchId}
          />
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`}
              />

              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.description && (
                    <span className="text-xs text-slate-400 group-hover:text-slate-300">
                      {item.description}
                    </span>
                  )}
                </>
              )}

              {active && !collapsed && (
                <div className="absolute right-2 h-2 w-2 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Menu */}
      <div className="border-t border-slate-700 p-3">
        <Link
          href="/help"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white"
        >
          <HelpCircle
            className={`h-5 w-5 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`}
          />
          {!collapsed && 'Bantuan'}
        </Link>

        <Link
          href="/logout"
          method="post"
          as="button"
          className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-600/10 hover:text-rose-300"
        >
          <LogOut
            className={`h-5 w-5 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`}
          />
          {!collapsed && 'Keluar'}
        </Link>
      </div>
    </aside>
  );
}
