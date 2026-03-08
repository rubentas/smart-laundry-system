import AppLayout from '@/layouts/app-layout';

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-bold">Admin Cabang Dashboard</h1>
              <p className="mt-2">Selamat datang Admin!</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
