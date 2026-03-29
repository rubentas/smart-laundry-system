import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Search, Download, Eye, Clock, User, Activity } from 'lucide-react';

interface Log {
  id: number;
  user_name: string;
  user_role: string;
  action: string;
  description: string;
  created_at: string;
  ip_address: string;
}

interface Props {
  logs: { data: Log[]; links: any[] };
  actions: string[];
  filters: { user: string; action: string; date: string };
}

export default function ActivityLogsIndex({ logs, actions, filters }: Props) {
  const [search, setSearch] = useState(filters.user || '');
  const [actionFilter, setActionFilter] = useState(filters.action || '');
  const [dateFilter, setDateFilter] = useState(filters.date || '');

  const applyFilters = () => {
    router.get(
      '/owner/activity-logs',
      {
        user: search,
        action: actionFilter,
        date: dateFilter,
      },
      { preserveState: true },
    );
  };

  const resetFilters = () => {
    setSearch('');
    setActionFilter('');
    setDateFilter('');
    router.get('/owner/activity-logs', {}, { preserveState: true });
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      created: 'text-green-600 bg-green-100',
      updated: 'text-blue-600 bg-blue-100',
      deleted: 'text-red-600 bg-red-100',
      POST: 'text-purple-600 bg-purple-100',
      PUT: 'text-orange-600 bg-orange-100',
      DELETE: 'text-red-600 bg-red-100',
    };
    return colors[action] || 'text-gray-600 bg-gray-100';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <Activity className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Activity Logs
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Riwayat aktivitas semua user dalam sistem
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.get('/owner/activity-logs/export')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  User
                </label>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari user..."
                    className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Action
                </label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Semua</option>
                  {actions.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                    Aksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.data.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium">{log.user_name}</p>
                          <p className="text-xs text-slate-500">
                            {log.user_role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="max-w-md truncate px-6 py-4 text-sm text-slate-600">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/owner/activity-logs/${log.id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <div className="text-sm text-slate-500">
                Total {logs.data.length} logs
              </div>
              <div className="flex gap-2">
                {logs.links?.map((link, i) => (
                  <button
                    key={i}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      link.active
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
