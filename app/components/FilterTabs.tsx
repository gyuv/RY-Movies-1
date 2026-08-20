// app/components/FilterTabs.tsx
'use client';
import { useState } from 'react';

const TABS = [
  { label: 'Top Airing', icon: '📡' },
  { label: 'Most Popular', icon: '⭐' },
  { label: 'Most Favorite', icon: '❤️' },
  { label: 'Latest Completed', icon: '✅' },
];

export default function FilterTabs({ onChange }: { onChange?: (tab: string) => void }) {
  const [active, setActive] = useState('Top Airing');

  return (
    <div className="flex justify-center gap-3 flex-wrap py-6">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => { setActive(tab.label); onChange?.(tab.label); }}
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
            active === tab.label
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-white/20 text-gray-300 hover:border-white/40'
          }`}
        >
          <span className="mr-1">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
