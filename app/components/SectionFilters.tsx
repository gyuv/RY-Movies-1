// Save as: components/SectionFilters.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface FilterOption {
  label: string;
  value: string;
}

interface SectionFiltersProps {
  interface SectionFiltersProps {
  sortOptions: FilterOption[];
  extraOptions?: {
    name: string;
    label: string;
    options: FilterOption[];
  }[];
}

export default function SectionFilters({ sortOptions, extraOptions = [] }: SectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || sortOptions[0]?.value || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 px-4 sm:px-6 lg:px-8">
      {/* Sort Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-paper-dim uppercase tracking-wider">Sort By:</span>
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="bg-ink-raised border border-ink-line text-paper text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-marquee"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Optional Filters (e.g., Status, Type) */}
      {extraOptions.map((extra) => {
        const currentVal = searchParams.get(extra.name) || '';
        return (
          <div key={extra.name} className="flex items-center gap-2">
            <span className="text-xs text-paper-dim uppercase tracking-wider">{extra.label}:</span>
            <select
              value={currentVal}
              onChange={(e) => handleFilterChange(extra.name, e.target.value)}
              className="bg-ink-raised border border-ink-line text-paper text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-marquee"
            >
              <option value="">All</option>
              {extra.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
