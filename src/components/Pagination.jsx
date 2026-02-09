import React from 'react';

/**
 * Pagination component for data tables
 * @param {Object} props
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onPageChange - Callback when page changes
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display (with ellipsis)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50 bg-white rounded-b-2xl">
      {/* Page status info */}
      <div className="text-[13px] font-medium text-slate-500">
        Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all group"
          aria-label="Previous page"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-active:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`min-w-[26px] h-[26px] px-1.5 rounded-lg text-[11px] font-bold transition-all ${
              page === currentPage
                ? 'bg-[#1B3C53] text-white shadow-md shadow-blue-900/20 scale-105 active:scale-95'
                : page === '...'
                ? 'text-slate-400 cursor-default'
                : 'text-slate-600 hover:bg-slate-50 active:scale-95'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all group"
          aria-label="Next page"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-active:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
