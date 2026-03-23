import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Ticket, X } from 'lucide-react';
import axios from 'axios';

interface Props {
  orderId?: number | null;
  currentPromo?: {
    code: string;
    discount: number;
  } | null;
  onApplied?: (promo: any) => void;
  subtotal?: number;
}

export default function PromoInput({
  orderId,
  currentPromo,
  onApplied,
  subtotal = 0,
}: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!code) return;
    setLoading(true);
    setError('');

    if (orderId) {
      router.post(
        route('owner.orders.apply-promo', orderId),
        { promo_code: code },
        {
          preserveScroll: true,
          onSuccess: () => {
            setCode('');
            onApplied?.({ code, discount: 0 });
          },
          onError: (errors) => setError(errors.error || 'Promo tidak valid'),
          onFinish: () => setLoading(false),
        },
      );
    } else {
      axios
        .post('/owner/promo/validate', {
          promo_code: code,
          subtotal: subtotal,
        })
        .then((res) => {
          setCode('');
          onApplied?.(res.data);
        })
        .catch((err) => {
          setError(err.response?.data?.error || 'Promo tidak valid');
        })
        .finally(() => setLoading(false));
    }
  }; // <-- HAPUS SATU KURUNG INI

  if (currentPromo) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
        <Ticket className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            Promo {currentPromo.code}
          </p>
          <p className="text-xs text-green-600">
            Diskon Rp {currentPromo.discount.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Masukkan kode promo"
          className="flex-1 rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Pakai'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
