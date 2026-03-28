import { X, Truck, Phone, Car } from 'lucide-react';

interface Courier {
  id: number;
  name: string;
  phone: string;
  license_plate: string | null;
  status: string;
}

interface Props {
  order: any;
  couriers: Courier[];
  onClose: () => void;
  onAssign: (courierId: number) => void;
}

export default function AssignCourierModal({
  order,
  couriers,
  onClose,
  onAssign,
}: Props) {
  const availableCouriers = couriers.filter((c) => c.status === 'available');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold">Assign Kurir</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-4 text-sm text-slate-600">
            Order: <span className="font-medium">{order.order_number}</span>
          </p>

          <div className="space-y-2">
            {availableCouriers.length === 0 ? (
              <p className="py-4 text-center text-slate-500">
                Tidak ada kurir tersedia
              </p>
            ) : (
              availableCouriers.map((courier) => (
                <button
                  key={courier.id}
                  onClick={() => onAssign(courier.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <div className="rounded-full bg-indigo-100 p-2">
                    <Truck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{courier.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {courier.phone}
                      </span>
                      {courier.license_plate && (
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" /> {courier.license_plate}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-600">
                    Tersedia
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
