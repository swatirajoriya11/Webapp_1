import { STATUS_META, STATUS_ORDER, type BookStatus } from '@/lib/supabase';

interface FilterTabsProps {
  active: BookStatus | 'all';
  counts: Record<string, number>;
  total: number;
  onChange: (value: BookStatus | 'all') => void;
}

export default function FilterTabs({ active, counts, total, onChange }: FilterTabsProps) {
  const tabs: { key: BookStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: total },
    ...STATUS_ORDER.map((s) => ({
      key: s,
      label: STATUS_META[s].label,
      count: counts[s] ?? 0,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.key !== 'all' && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${STATUS_META[tab.key as BookStatus].dot}`}
              />
            )}
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
