import { router } from '@inertiajs/react';
import {
  store,
  destroy,
} from '@/actions/App/Http/Controllers/BranchSessionController';
import { ChevronDown, Store } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Branch {
  id: number;
  name: string;
  code: string;
}

interface Props {
  branches: Branch[];
  currentBranchId?: number | null;
}

export default function BranchSelector({ branches, currentBranchId }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedBranch = branches.find((b) => b.id === currentBranchId);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (branchId: number) => {
    setOpen(false);
    router.post(store().url, { branch_id: branchId }, { preserveScroll: true });
  };

  const handleReset = () => {
    setOpen(false);
    router.delete(destroy().url, { preserveScroll: true });
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg bg-slate-700/50 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-slate-400" />
          <span>{selectedBranch?.name ?? 'Semua Cabang'}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 left-0 z-50 mt-1 origin-top rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
          <div className="p-1">
            <button
              onClick={handleReset}
              className={`w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-slate-700 ${!currentBranchId ? 'bg-indigo-600' : ''}`}
            >
              Semua Cabang
            </button>
            <div className="my-1 border-t border-slate-700" />
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleSelect(branch.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-700 ${selectedBranch?.id === branch.id ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              >
                {branch.name}
                <span className="block text-xs text-slate-500">
                  {branch.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
