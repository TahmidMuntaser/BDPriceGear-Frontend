'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { priceComparisonAPI } from '@/services/api';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';

function PriceComparisonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productQuery = searchParams.get('product') || '';
  
  const [selectedShops, setSelectedShops] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch price comparison results
  useEffect(() => {
    if (!productQuery) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      const startTime = performance.now();

      try {
        const data = await priceComparisonAPI.searchProducts(productQuery);
        const endTime = performance.now();
        setResponseTime((endTime - startTime) / 1000);
        
        // Convert object response to array format
        // API returns: { "StarTech": { name: "StarTech", products: [...] }, ... }
        if (data && typeof data === 'object') {
          const shopsArray = Object.keys(data).map(shopKey => ({
            shop_name: data[shopKey].name || shopKey,
            shop_logo: data[shopKey].logo || '',
            products: data[shopKey].products || []
          }));
          setResults(shopsArray);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Price comparison error:', err);
        setError(err.message || 'Failed to fetch price comparison. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [productQuery]);

  // Get all products from shops
  const allProducts = results.flatMap(shop => 
    (shop.products || []).map(product => ({
      ...product,
      shop_name: shop.shop_name,
      shop_logo: shop.shop_logo
    }))
  );

  // Get unique shop names for filter
  const availableShops = [...new Set(results.map(shop => shop.shop_name))];

  // Apply filters
  const filteredProducts = allProducts.filter(product => {
    // Shop filter
    if (selectedShops.length > 0 && !selectedShops.includes(product.shop_name)) {
      return false;
    }

    // Price range filter
    const price = parseFloat(product.price || product.current_price || 0);
    if (priceRange.min && price < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && price > parseFloat(priceRange.max)) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price || a.current_price || 0);
    const priceB = parseFloat(b.price || b.current_price || 0);

    switch (sortOrder) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  // Pagination
  const totalCount = sortedProducts.length;
  const totalPages = Math.ceil(totalCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Handle filter changes
  const handleShopToggle = (shopName) => {
    setSelectedShops(prev =>
      prev.includes(shopName)
        ? prev.filter(s => s !== shopName)
        : [...prev, shopName]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedShops([]);
    setPriceRange({ min: '', max: '' });
    setSortOrder('price-low');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedShops.length > 0 || priceRange.min || priceRange.max || sortOrder !== 'price-low';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-400">Price Comparison</span>
        </nav>

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {productQuery ? (
                  <>
                    Price Comparison for <span className="block mt-1 text-xl sm:text-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">&quot;{productQuery}&quot;</span>
                  </>
                ) : 'Price Comparison'}
              </h1>
              {!loading && totalCount > 0 && (
                <div className="flex items-center gap-3">
                  <p className="text-gray-400">
                    {totalCount.toLocaleString()} products from {availableShops.length} store{availableShops.length !== 1 ? 's' : ''}
                  </p>
                  {responseTime && (
                    <span className="text-xs bg-green-600/20 text-green-300 px-3 py-1 rounded-full border border-green-500/20">
                      {responseTime.toFixed(2)}s
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300">
            <p className="font-semibold mb-1">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!productQuery && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400/30">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Product Selected</h3>
            <p className="text-gray-400 mb-6">Search for a product from the home page to compare prices</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              Go to Home
            </Link>
          </div>
        )}

        {totalCount === 0 && !loading && !error && productQuery && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
            <p className="text-gray-400 mb-6">
              No products found for &quot;{productQuery}&quot;. Try searching for a different product.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              Search Again
            </Link>
          </div>
        )}

        {totalCount > 0 && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-1/5">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                
                {/* Sort Order */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Sort By Price
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        value="price-low"
                        checked={sortOrder === 'price-low'}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-4 h-4 text-emerald-500 bg-gray-600 border-gray-500"
                      />
                      <span className="ml-3 text-sm text-gray-300">Price: Low to High</span>
                    </label>
                    <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        value="price-high"
                        checked={sortOrder === 'price-high'}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-4 h-4 text-emerald-500 bg-gray-600 border-gray-500"
                      />
                      <span className="ml-3 text-sm text-gray-300">Price: High to Low</span>
                    </label>
                    <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        value="name-asc"
                        checked={sortOrder === 'name-asc'}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-4 h-4 text-emerald-500 bg-gray-600 border-gray-500"
                      />
                      <span className="ml-3 text-sm text-gray-300">Name: A to Z</span>
                    </label>
                    <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        value="name-desc"
                        checked={sortOrder === 'name-desc'}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-4 h-4 text-emerald-500 bg-gray-600 border-gray-500"
                      />
                      <span className="ml-3 text-sm text-gray-300">Name: Z to A</span>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Shop Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Shop {selectedShops.length > 0 && `(${selectedShops.length} selected)`}
                  </label>
                  <div className="space-y-2">
                    {availableShops.map((shopName) => (
                      <label 
                        key={shopName} 
                        className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedShops.includes(shopName)}
                          onChange={() => handleShopToggle(shopName)}
                          className="w-4 h-4 text-emerald-500 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm text-gray-300 flex-1">
                          {shopName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="pt-6 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-400">Active Filters</p>
                      <button
                        onClick={handleClearFilters}
                        className="text-xs text-emerald-500 hover:text-emerald-400"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2">
                      {sortOrder !== 'price-low' && (
                        <div className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                          <span>Sort: {sortOrder === 'price-high' ? 'High to Low' : sortOrder === 'name-asc' ? 'A to Z' : 'Z to A'}</span>
                          <button onClick={() => handleSortChange('price-low')} className="text-gray-400 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {(priceRange.min || priceRange.max) && (
                        <div className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                          <span>৳{priceRange.min || '0'} - ৳{priceRange.max || '∞'}</span>
                          <button onClick={() => setPriceRange({ min: '', max: '' })} className="text-gray-400 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {selectedShops.map(shopName => (
                        <div key={shopName} className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                          <span>{shopName}</span>
                          <button 
                            onClick={() => handleShopToggle(shopName)} 
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalProducts={totalCount}
                productsPerPage={productsPerPage}
              />

              <ProductGrid products={currentProducts} showModal={true} />

              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalProducts={totalCount}
                productsPerPage={productsPerPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PriceComparisonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductGridSkeleton />
        </div>
      </div>
    }>
      <PriceComparisonContent />
    </Suspense>
  );
}
