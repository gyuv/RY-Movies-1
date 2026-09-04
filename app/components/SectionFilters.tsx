'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface FilterOption {
  label: string;
  value: string;
}

interface SectionFiltersProps {
  sortOptions: FilterOption[];
  extraOptions?: {
    name: string;
    label: string;
    options: FilterOption[];
  }[];
}

/** Premium glassmorphic select chip — floating label + neon focus (TV ready). */
function SelectChip({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const active = Boolean(value);
  return (
    <label
      className={`group relative flex min-w-[132px] flex-col rounded-xl px-3.5 pt-2 pb-1.5 transition-all ${
        active
          ? 'bg-apex-cyan/10 ring-1 ring-apex-cyan/50 shadow-apex-glow'
          : 'apex-glass hover:ring-1 hover:ring-white/20'
      }`}
    >
      <span
        className={`font-mono text-[9px] uppercase tracking-[0.2em] ${
          active ? 'text-apex-cyan' : 'text-white/40'
        }`}
      >
        {label}
      </span>
      <div className="relative flex items-center">
        <select
          aria-label={label}
          data-apex-nav
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="apex-focusable w-full appearance-none cursor-pointer bg-transparent pr-5 py-0.5 text-sm font-medium text-white focus:outline-none"
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-0 text-[10px] text-white/50 group-hover:text-white/80">▾</span>
      </div>
    </label>
  );
}

export default function SectionFilters({ sortOptions, extraOptions = [] }: SectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || sortOptions[0]?.value || '';
  const hasActive = extraOptions.some((e) => searchParams.get(e.name));

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const reset = () => {
    const params = new URLSearchParams(searchParams.toString());
    extraOptions.forEach((e) => params.delete(e.name));
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      <div className="apex-glass flex items-center gap-2.5 overflow-x-auto rounded-2xl p-2.5 scrollbar-hide">
        <SelectChip label="Sort by" value={currentSort} onChange={(v) => handleFilterChange('sort', v)}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-apex-panel text-white">
              {opt.label}
            </option>
          ))}
        </SelectChip>

        {extraOptions.map((extra) => (
          <SelectChip
            key={extra.name}
            label={extra.label}
            value={searchParams.get(extra.name) || ''}
            onChange={(v) => handleFilterChange(extra.name, v)}
          >
            <option value="" className="bg-apex-panel text-white">All {extra.label}s</option>
            {extra.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-apex-panel text-white">
                {opt.label}
              </option>
            ))}
          </SelectChip>
        ))}

        {hasActive && (
          <button
            onClick={reset}
            data-apex-nav
            className="apex-focusable ml-auto flex shrink-0 items-center gap-1.5 rounded-xl border border-reel-rose/40 px-3 py-2 text-xs font-medium text-reel-rose transition-colors hover:bg-reel-rose/10"
          >
            ✕ Reset
          </button>
        )}
      </div>
    </div>
  );
}
