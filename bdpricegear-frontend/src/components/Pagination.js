'use client';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalProducts,
  productsPerPage 
}) {
  // Always show pagination, even for single page
  if (totalPages < 1) {
    return null;
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-emerald-600 hover:text-white transition-all duration-200"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="flex items-center justify-center w-10 h-10 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Visible pages
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
            page === currentPage
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'bg-gray-800/50 text-gray-300 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          {page}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="flex items-center justify-center w-10 h-10 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-emerald-600 hover:text-white transition-all duration-200"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Pagination Info */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-full px-4 py-2">
          <span className="text-gray-300 text-sm">
            Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300 text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-2">
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 disabled:hover:text-gray-300 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {generatePageNumbers()}

              {/* Next Button */}
              <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 disabled:hover:text-gray-300 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}