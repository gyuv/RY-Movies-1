"use client";

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  // Only render if there is more than 1 page
  if (totalPages <= 1) return null;

  // Helper to safely preserve existing search params and update the page
  const getPageUrl = (p: number | string) => {
    if (typeof window === 'undefined') return `?page=${p}`;
    const params = new URLSearchParams(window.location.search);
    params.set("page", p.toString());
    return `${window.location.pathname}?${params.toString()}`;
  };

  // Generate page numbers to display with ellipses (from Code 2)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show before/after current
    const range = [1, currentPage - delta, currentPage - 1, currentPage, currentPage + 1, currentPage + delta, totalPages];
    
    for (let i = 0; i < range.length - 1; i++) {
      const start = range[i];
      const end = range[i + 1];
      
      if (end - start === 2) {
        for (let j = start; j <= end; j++) {
          pages.push(j);
        }
      } else if (end - start > 2) {
        pages.push(start);
        pages.push('...');
        pages.push(end);
      } else if (start > 0 && start <= totalPages) {
        pages.push(start);
      }
    }
    
    // Filter out duplicates and out-of-bound values
    return Array.from(new Set(pages)).filter(p => p === '...' || (typeof p === 'number' && p >= 1 && p <= totalPages));
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4 flex-wrap">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link 
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-white text-sm font-medium transition-colors"
        >
          Previous
        </Link>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <span key={index} className="px-2 text-white/50">...</span>;
        }
        return (
          <Link
            key={index}
            href={getPageUrl(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link 
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-white text-sm font-medium transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
