import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Database,
  Download,
  Trash2,
  RotateCcw,
  HardDrive,
  Cloud,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface Backup {
  filename: string;
  size: string;
  created_at: string;
  download_url: string;
}

interface Props {
  backups: Backup[];
  diskUsage: string;
}

export default function BackupsIndex({ backups, diskUsage }: Props) {
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const createBackup = () => {
    if (confirm('Buat backup database sekarang?')) {
      setCreating(true);
      router.post(
        '/owner/backups/create',
        {},
        {
          onFinish: () => setCreating(false),
        },
      );
    }
  };

  const restoreBackup = (filename: string) => {
    if (
      confirm(
        `Restore database dari ${filename}? Semua data saat ini akan diganti!`,
      )
    ) {
      setRestoring(filename);
      router.post(
        '/owner/backups/restore',
        { backup_file: filename },
        {
          onFinish: () => setRestoring(null),
        },
      );
    }
  };

  const deleteBackup = (filename: string) => {
    if (confirm(`Hapus backup ${filename}?`)) {
      router.delete(`/owner/backups/delete/${filename}`);
    }
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
                  <Database className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Backup Database
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Kelola backup dan restore database
                  </p>
                </div>
              </div>
              <button
                onClick={createBackup}
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Cloud className="h-4 w-4" />
                {creating ? 'Membuat...' : 'Buat Backup'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Backup</p>
                  <p className="text-2xl font-bold">{backups.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <HardDrive className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Disk Usage</p>
                  <p className="text-2xl font-bold">{diskUsage}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Backup</p>
                  <p className="text-lg font-bold">
                    {backups[0]?.created_at || 'Belum ada'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Backup List */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {backups.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <Database className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                      <p>Belum ada backup</p>
                      <p className="text-sm">
                        Klik tombol "Buat Backup" untuk memulai
                      </p>
                    </td>
                  </tr>
                ) : (
                  backups.map((backup) => (
                    <tr key={backup.filename} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-slate-400" />
                          <span className="font-mono text-sm">
                            {backup.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{backup.size}</td>
                      <td className="px-6 py-4 text-sm">{backup.created_at}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={backup.download_url}
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => restoreBackup(backup.filename)}
                            disabled={restoring === backup.filename}
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            title="Restore"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteBackup(backup.filename)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info */}
          <div className="mt-6 rounded-2xl bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Tips Backup:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>Backup database secara rutin minimal 1 minggu sekali</li>
                  <li>Simpan backup di tempat aman atau cloud storage</li>
                  <li>Restore akan mengganti semua data saat ini</li>
                  <li>Backup otomatis dapat dijadwalkan via cron job</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
