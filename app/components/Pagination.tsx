"use client";

import Link from 'next/link';

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  // Only render if there are more than 1 page
  if (totalPages <= 1) return null;

  // Helper to get URL for a specific page
  const getPageUrl = (p: number) => {
    // Safe to use window here because it's a Client Component
    const params = new URLSearchParams(window.location.search);
    params.set("page", p.toString());
    return `${window.location.pathname}?${params.toString()}`;
  };

  // Generate page numbers to show (max 5 buttons)
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  
  // Adjust start if we're near the end
  const adjustedStart = Math.max(1, end - 4);

  for (let i = adjustedStart; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white transition-colors">
          Prev
        </Link>
      )}
      
      {pages.map(p => (
        <Link 
          key={p} 
          href={getPageUrl(p)} 
          className={`px-3 py-1 rounded text-sm transition-colors ${
            p === currentPage 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          }`}
        >
          {p}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white transition-colors">
          Next
        </Link>
      )}
    </div>
  );
}
