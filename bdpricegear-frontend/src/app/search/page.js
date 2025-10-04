'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductSearch } from '@/hooks/useProductSearch';
import ProductGrid from '@/components/ProductGrid';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import Pagination from '@/components/Pagination';

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [sortBy, setSortBy] = useState('relevance');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  
  const { 
    searchTerm,
    setSearchTerm,
    handleSearch,
    results,
    allProducts,
    currentProducts,
    totalProducts,
    totalPages,
    currentPage,
    productsPerPage,
    setCurrentPage,
    responseTime,
    loading, 
    error 
  } = useProductSearch();

  useEffect(() => {
    if (query && query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [query, searchTerm, setSearchTerm]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

  const handleSortChange = (value) => {
    setSortBy(value);
    // Add sorting logic here
  };

  const handlePriceFilter = () => {
    // Add price filtering logic here
    if (searchTerm) {
      handleSearch();
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Health & Beauty'
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Results</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, #8b5cf6 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push('/')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300">Search Results</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-10"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6 lg:sticky lg:top-8 overflow-hidden">
                <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-700/80 backdrop-blur border border-gray-600/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range (৳)
                  </label>
                  <div className="flex gap-2 w-full">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1 min-w-0 bg-gray-700/80 backdrop-blur border border-gray-600/50 rounded-lg px-2 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1 min-w-0 bg-gray-700/80 backdrop-blur border border-gray-600/50 rounded-lg px-2 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all text-sm"
                    />
                  </div>
                  <button
                    onClick={handlePriceFilter}
                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 font-medium"
                  >
                    Apply Filter
                  </button>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full bg-gray-700/80 backdrop-blur border border-gray-600/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setCategory('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSortBy('relevance');
                  }}
                  className="w-full bg-gray-700/80 text-gray-300 py-2.5 rounded-lg hover:bg-gray-600 transition-all font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="lg:w-3/4">
            {/* Search Header */}
            <div className="mb-6 text-center">
              <h1 className="text-5xl font-bold text-white mb-2">
                Search Results
              </h1>
              {query && (
                <p className="text-gray-400">
                  Showing results for: <span className="text-white font-medium">"{query}"</span>
                </p>
              )}
              {responseTime && !loading && (
                <div className="flex justify-center mt-2">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-full px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-300 text-sm font-medium">
                          Response time: <span className="text-green-400 font-semibold">{parseFloat(responseTime).toFixed(2)}s</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : totalProducts > 0 ? (
              <div>
                {/* Top Pagination */}
                <div className="mb-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalProducts={totalProducts}
                    productsPerPage={productsPerPage}
                  />
                </div>
                
                <ProductGrid products={currentProducts} />
              </div>
            ) : !loading && query ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any products matching "{query}". Try adjusting your search terms or filters.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Suggestions:</p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Check your spelling</li>
                    <li>• Use more general terms</li>
                    <li>• Try different keywords</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Your Search</h3>
                <p className="text-gray-400">Enter a product name or keyword to find the best deals.</p>
              </div>
            )}

            {/* Bottom Pagination */}
            {totalProducts > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalProducts={totalProducts}
                  productsPerPage={productsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading search results...</div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}