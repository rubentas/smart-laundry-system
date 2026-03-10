import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Branch {
  id: number;
  branch_code: string;
  name: string;
  city: string;
  phone: string;
  is_active: boolean;
}

interface Props {
  branches: {
    data: Branch[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
}

export default function BranchIndex({ branches }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus cabang ini?')) {
      router.delete(`/owner/branches/${id}`);
    }
  };

  return (
    <AppLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="mb-6 flex justify-between">
                <h1 className="text-2xl font-bold">Daftar Cabang</h1>
                <Link
                  href="/owner/branches/create"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  + Tambah Cabang
                </Link>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Kota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {branches.data.map((branch) => (
                    <tr key={branch.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {branch.branch_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {branch.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {branch.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {branch.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            branch.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {branch.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/owner/branches/${branch.id}/edit`}
                          className="mr-3 text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
