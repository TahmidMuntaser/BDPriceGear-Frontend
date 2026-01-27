'use client';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalProducts,
  productsPerPage
}) {
  if (totalPages < 1) {
    return null;
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  // Generate visible page numbers (show 5 around current)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxVisible - 1, totalPages);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Pagination Info */}
      <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2">
        <span className="text-gray-400 text-sm">Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts.toLocaleString()} products</span>
        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
        <span className="text-gray-400 text-sm">Page {currentPage} of {totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="inline-flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
          title="First"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
          title="Previous"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1"></div>

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-medium transition-all ${
              page === currentPage
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1"></div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
          title="Next"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
          title="Last"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
