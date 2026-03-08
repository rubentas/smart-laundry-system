import AppLayout from '@/layouts/app-layout';

export default function OwnerDashboard() {
  return (
    <AppLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-bold">Owner Dashboard</h1>
              <p className="mt-2">Selamat datang Owner!</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
