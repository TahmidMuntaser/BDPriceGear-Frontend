'use client';

import { useProductSearch } from '../hooks/useProductSearch';
import SearchForm from './SearchForm';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';

export default function PriceComparison() {
  const {
    searchTerm,
    loading,
    error,
    currentPage,
    currentProducts,
    totalProducts,
    totalPages,
    productsPerPage,
    results,
    responseTime,
    setSearchTerm,
    setCurrentPage,
    handleSearch,
    clearError
  } = useProductSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-8">
      
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, #8b5cf6 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        {/* <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <span className="text-3xl">🛒</span>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight">
            BD Price Gear
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the best deals across Bangladesh's top e-commerce stores
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div> */}

        {/*Search */}
        <SearchForm 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          loading={loading}
          redirectToResults={true}
        />

        {/*Error msg */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-30"></div>
              <div className="relative bg-red-900/20 backdrop-blur-xl border border-red-800/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-300 font-semibold mb-2">Search Error</h3>
                    <p className="text-red-200/80">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-3 px-4 py-2 bg-red-600/30 text-red-200 rounded-lg hover:bg-red-600/50 transition-colors text-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-16 h-16 border-4 border-gray-700 rounded-full animate-spin border-t-blue-500"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-gray-800 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Searching for &quot;{searchTerm}&quot;
            </h3>
            <p className="text-gray-400">
              Finding the best deals across multiple stores...
            </p>
          </div>
        )}

        {/* Results - Unified View */}
        {results.length > 0 && !loading && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Results for &quot;{searchTerm}&quot;
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/20 rounded-full px-6 py-3">
                  <span className="text-white font-semibold">
                    {totalProducts} products
                  </span>
                  <span className="text-gray-400">from</span>
                  <span className="text-white font-semibold">
                    {results.length} store{results.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Response Time Indicator */}
                {responseTime && (
                  <div className="inline-flex items-center space-x-2 bg-green-600/20 backdrop-blur-xl border border-green-500/20 rounded-full px-6 py-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 font-medium text-sm">
                      Response time: {responseTime.toFixed(2)}s
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalProducts={totalProducts}
              productsPerPage={productsPerPage}
            />

            {/* Product Grid */}
            <ProductGrid products={currentProducts} showModal={true} />

            {/* Pagination (Bottom) */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalProducts={totalProducts}
              productsPerPage={productsPerPage}
            />
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && results.length === 0 && searchTerm && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No results found
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try searching for a different product or check your spelling.
            </p>

            {responseTime && (
              <div className="mt-4 inline-flex items-center space-x-2 bg-green-600/20 backdrop-blur-xl border border-green-500/20 rounded-full px-6 py-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-300 font-medium text-sm">
                  Response time: {responseTime.toFixed(2)}s
                </span>
              </div>
            )}
          </div>
        )}

        {/*Initial State */}
        {!loading && !error && results.length === 0 && !searchTerm && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl">🛍️</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Ready to find amazing deals?
            </h3>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Search for any product and compare prices across Bangladesh&apos;s top e-commerce stores
            </p>
          </div>
        )}
      </div>
    </div>
  );
}