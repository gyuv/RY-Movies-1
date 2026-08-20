// app/components/GenreFilter.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Genre } from '../../lib/jikan';

export default function GenreFilter({ genres }: { genres: Genre[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL on mount
  useEffect(() => {
    const genresParam = searchParams.get('genres');
    if (genresParam) {
      setSelected(genresParam.split(',').map(Number).filter(Boolean));
    }
  }, [searchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGenre = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length) {
      params.set('genres', selected.join(','));
    } else {
      params.delete('genres');
    }
    params.set('page', '1');
    router.push(`/anime?${params.toString()}`);
    setOpen(false);
  };

  const clearFilters = () => {
    setSelected([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('genres');
    router.push(`/anime?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
          selected.length
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-white/20 text-gray-300 hover:border-white/40'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Genres
        {selected.length > 0 && (
          <span className="bg-white/20 text-xs rounded-full px-1.5">{selected.length}</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-72 max-h-96 overflow-y-auto bg-[#141414] border border-white/10 rounded-xl shadow-2xl p-3">
          <div className="grid grid-cols-2 gap-1 mb-3">
            {genres.map((genre) => (
              <label
                key={genre.mal_id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer text-sm text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(genre.mal_id)}
                  onChange={() => toggleGenre(genre.mal_id)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="truncate">{genre.name}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              onClick={clearFilters}
              className="flex-1 text-xs font-medium text-gray-400 hover:text-white py-2"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
