'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useShops } from '@/hooks/useShops';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');

  const filters = {
    category: selectedCategory,
    shop: selectedShop,
  };

  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
    nextPage,
    previousPage,
    goToPage,
    clearError,
  } = useProducts(1, 21, filters);

  const { categories } = useCategories();
  const { shops } = useShops();

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedShop('');
  };

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
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300">Products</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 lg:sticky lg:top-32 lg:self-start">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-10"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-700/80 backdrop-blur border border-gray-600/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name} ({category.product_count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shop Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Shop
                  </label>
                  <select
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    className="w-full bg-gray-700/80 backdrop-blur border border-gray-600/50 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all"
                  >
                    <option value="">All Shops</option>
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.slug}>
                        {shop.name} ({shop.product_count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={handleClearFilters}
                  disabled={!selectedCategory && !selectedShop}
                  className="w-full bg-gray-700/80 text-gray-300 py-2.5 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Clear All Filters
                </button>

                {/* Active Filters */}
                {(selectedCategory || selectedShop) && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Active Filters:</p>
                    <div className="space-y-2">
                      {selectedCategory && (
                        <div className="flex items-center justify-between bg-blue-600/20 text-blue-300 px-3 py-1.5 rounded-lg text-xs">
                          <span className="truncate">📁 {categories.find(c => c.slug === selectedCategory)?.name}</span>
                          <button
                            onClick={() => setSelectedCategory('')}
                            className="ml-2 hover:text-blue-100 transition-colors font-bold"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {selectedShop && (
                        <div className="flex items-center justify-between bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs">
                          <span className="truncate">🏪 {shops.find(s => s.slug === selectedShop)?.name}</span>
                          <button
                            onClick={() => setSelectedShop('')}
                            className="ml-2 hover:text-purple-100 transition-colors font-bold"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="lg:w-3/4">
            {/* Page Header */}
            <div className="mb-6 text-center">
              <h1 className="text-5xl font-bold text-white mb-2">
                Product Catalog
              </h1>
              {!loading && totalCount > 0 && (
                <p className="text-gray-400 pb-4">
                  Showing {totalCount.toLocaleString()} products
                </p>
              )}
            </div>

            
            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-red-900/20 backdrop-blur-xl border border-red-800/30 rounded-xl p-5">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-red-300 font-semibold text-sm mb-1">Error Loading Products</h3>
                        <p className="text-red-200/80 text-sm">{error}</p>
                        <button
                          onClick={clearError}
                          className="mt-2 px-3 py-1.5 bg-red-600/30 text-red-200 rounded-lg hover:bg-red-600/50 transition-colors text-xs"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && <ProductGridSkeleton count={18} />}

            {/* Products with Pagination */}
            {!loading && !error && products.length > 0 && (
              <div>
                {/* Top Pagination */}
                <div className="mb-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    totalProducts={totalCount}
                    productsPerPage={21}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                  />
                </div>

                {/* Products Grid */}
                <ProductGrid products={products} />

                {/* Bottom Pagination */}
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    totalProducts={totalCount}
                    productsPerPage={21}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                  />
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                <p className="text-gray-400 mb-6">
                  {(selectedCategory || selectedShop) 
                    ? "No products match your filters. Try adjusting your selection."
                    : "No products available at the moment."
                  }
                </p>
                {(selectedCategory || selectedShop) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
