'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useShops } from '@/hooks/useShops';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';


export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedShops, setSelectedShops] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState('all');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { categories } = useCategories();
  const { shops } = useShops();

  // Fetch products progressively - load first page immediately, then fetch rest in background
  useEffect(() => {
    const CACHE_KEY = 'bdpricegear_products_cache';
    const CACHE_TIMESTAMP_KEY = 'bdpricegear_products_timestamp';
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we have cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        
        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          if (age < CACHE_DURATION) {
            console.log('✅ Loading products from cache');
            const products = JSON.parse(cachedData);
            setAllProducts(products);
            setLoading(false);
            return;
          } else {
            console.log('⏰ Cache expired, fetching fresh data');
          }
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bdpricegear-backend.onrender.com/api';
        
        console.log('🔄 Fetching first page...');
        
        // Fetch first page immediately
        const firstResponse = await fetch(`${baseUrl}/products/?page=1&page_size=100`);
        if (!firstResponse.ok) {
          throw new Error(`HTTP error! status: ${firstResponse.status}`);
        }
        
        const firstData = await firstResponse.json();
        console.log(`✅ First page loaded: ${firstData.results.length} products`);
        setAllProducts(firstData.results);
        setLoading(false); // Show products immediately
        
        // Continue fetching remaining pages in background
        if (firstData.next) {
          setIsLoadingMore(true);
          const fetchedProducts = [...firstData.results];
          let page = 2;
          let hasMore = !!firstData.next;
          
          console.log('🔄 Loading remaining products in background...');
          
          while (hasMore) {
            const url = `${baseUrl}/products/?page=${page}&page_size=100`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
              if (response.status === 404) {
                console.log(`Page ${page} not found, stopping...`);
                hasMore = false;
                break;
              }
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              fetchedProducts.push(...data.results);
              setAllProducts([...fetchedProducts]); // Update products as we fetch
              console.log(`✅ Fetched page ${page}: ${data.results.length} products (Total: ${fetchedProducts.length})`);
              hasMore = !!data.next;
              page++;
            } else {
              hasMore = false;
            }
            
            // Safety limit
            if (page > 200) {
              console.warn('⚠️ Reached page limit of 200');
              hasMore = false;
            }
          }
          
          console.log(`✅ All products loaded: ${fetchedProducts.length}`);
          setIsLoadingMore(false);
          
          // Cache the complete product list
          localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedProducts));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          console.log('💾 Products cached to browser storage');
        } else {
          // Cache even if there's only one page
          localStorage.setItem(CACHE_KEY, JSON.stringify(firstData.results));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          console.log('💾 Products cached to browser storage');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
        setIsLoadingMore(false);
      }
    };
    
    fetchAllProducts();
  }, []);

  // Apply all filters and sorting on the frontend
  const getFilteredAndSortedProducts = () => {
    if (!allProducts || allProducts.length === 0) {
      return [];
    }
    
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory) {
      const selectedCategoryObj = categories.find(c => c.slug === selectedCategory);
      filtered = filtered.filter(product => {
        const categorySlug = product.category?.slug || product.category_slug;
        const categoryName = product.category?.name || product.category_name || product.category;
        const categoryId = product.category?.id || product.category_id || product.category;
        
        return categorySlug === selectedCategory || 
               categoryName === selectedCategoryObj?.name ||
               categoryId === selectedCategoryObj?.id ||
               String(product.category) === String(selectedCategoryObj?.id);
      });
    }

    // Filter by shop (multiple selection)
    if (selectedShops.length > 0) {
      filtered = filtered.filter(product => {
        return selectedShops.some(shopSlug => {
          const selectedShopObj = shops.find(s => s.slug === shopSlug);
          const productShopSlug = product.shop?.slug || product.shop_slug;
          const productShopName = product.shop?.name || product.shop_name || product.storeName;
          const productShopId = product.shop?.id || product.shop_id || product.shop;
          
          return productShopSlug === shopSlug || 
                 productShopName === selectedShopObj?.name ||
                 productShopId === selectedShopObj?.id ||
                 String(product.shop) === String(selectedShopObj?.id);
        });
      });
    }

    // Filter by price range
    if (priceRange.min !== '' || priceRange.max !== '') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.current_price) || 0;
        const min = priceRange.min !== '' ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;
        
        // Skip if price is invalid
        if (isNaN(price)) return false;
        
        return price >= min && price <= max;
      });
    }

    // Filter by availability
    if (availability !== 'all') {
      filtered = filtered.filter(product => {
        const isAvailable = product.is_available === true || product.is_available === 'true' || product.is_available === 1;
        
        if (availability === 'in-stock') {
          return isAvailable;
        } else if (availability === 'out-of-stock') {
          return !isAvailable;
        }
        return true;
      });
    }

    // Sort by price
    if (sortOrder === 'low-to-high') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.current_price) || 0;
        const priceB = parseFloat(b.current_price) || 0;
        return priceA - priceB;
      });
    } else if (sortOrder === 'high-to-low') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.current_price) || 0;
        const priceB = parseFloat(b.current_price) || 0;
        return priceB - priceA;
      });
    }

    return filtered;
  };

  const allFilteredProducts = getFilteredAndSortedProducts();
  
  // Calculate pagination from filtered products
  const totalCount = allFilteredProducts.length;
  const totalPages = Math.ceil(totalCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const products = allFilteredProducts.slice(startIndex, endIndex);

  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousPage = () => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedShops.length, priceRange.min, priceRange.max, availability, sortOrder]);

  const clearError = () => setError(null);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedShops([]);
    setPriceRange({ min: '', max: '' });
    setAvailability('all');
    setSortOrder('');
  };

  const handleRefreshCache = () => {
    localStorage.removeItem('bdpricegear_products_cache');
    localStorage.removeItem('bdpricegear_products_timestamp');
    window.location.reload();
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
          <div className="lg:w-1/4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-500" />
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
                      value=""
                      checked={sortOrder === ''}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500"
                    />
                    <span className="ml-3 text-sm text-gray-300">Default</span>
                  </label>
                  <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="sort"
                      value="low-to-high"
                      checked={sortOrder === 'low-to-high'}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500"
                    />
                    <span className="ml-3 text-sm text-gray-300">Price: Low to High</span>
                  </label>
                  <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="sort"
                      value="high-to-low"
                      checked={sortOrder === 'high-to-low'}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500"
                    />
                    <span className="ml-3 text-sm text-gray-300">Price: High to Low</span>
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
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availability === 'all'}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500"
                    />
                    <span className="ml-3 text-sm text-gray-300">All Products</span>
                  </label>
                  <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="availability"
                      value="in-stock"
                      checked={availability === 'in-stock'}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500"
                    />
                    <span className="ml-3 text-sm text-gray-300">In Stock</span>
                  </label>
                  <label className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="availability"
                      value="out-of-stock"
                      checked={availability === 'out-of-stock'}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500"
                    />
                    <span className="ml-3 text-sm text-gray-300">Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Shop {selectedShops.length > 0 && `(${selectedShops.length} selected)`}
                </label>
                <div className="space-y-2">
                  {shops.map((shop) => (
                    <label 
                      key={shop.id} 
                      className="flex items-center p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={shop.slug}
                        checked={selectedShops.includes(shop.slug)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedShops([...selectedShops, shop.slug]);
                          } else {
                            setSelectedShops(selectedShops.filter(s => s !== shop.slug));
                          }
                        }}
                        className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-300 flex-1">
                        {shop.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({shop.product_count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedCategory || selectedShops.length > 0 || priceRange.min || priceRange.max || availability !== 'all' || sortOrder) && (
                <div className="pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-400">Active Filters</p>
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-blue-500 hover:text-blue-400"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {sortOrder && (
                      <div className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                        <span>Sort: {sortOrder === 'low-to-high' ? 'Low to High' : 'High to Low'}</span>
                        <button onClick={() => setSortOrder('')} className="text-gray-400 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <div className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                        <span>₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}</span>
                        <button onClick={() => setPriceRange({ min: '', max: '' })} className="text-gray-400 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {availability !== 'all' && (
                      <div className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                        <span>{availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}</span>
                        <button onClick={() => setAvailability('all')} className="text-gray-400 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {selectedCategory && (
                      <div className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                        <span>{categories.find(c => c.slug === selectedCategory)?.name}</span>
                        <button onClick={() => setSelectedCategory('')} className="text-gray-400 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {selectedShops.map(shopSlug => {
                      const shop = shops.find(s => s.slug === shopSlug);
                      return shop ? (
                        <div key={shopSlug} className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded text-xs text-gray-300">
                          <span>{shop.name}</span>
                          <button 
                            onClick={() => setSelectedShops(selectedShops.filter(s => s !== shopSlug))} 
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
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
                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-blue-400">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading more products in background... ({allProducts.length} loaded)</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cache Info Banner */}
                {!loading && !isLoadingMore && allProducts.length > 0 && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-green-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Products cached for faster loading (30 min)</span>
                      </div>
                      <button
                        onClick={handleRefreshCache}
                        className="text-xs text-green-400 hover:text-green-300 underline"
                      >
                        Refresh Now
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Top Pagination */}
                {totalPages > 0 && (
                  <div className="mb-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={goToPage}
                      totalProducts={totalCount}
                      productsPerPage={productsPerPage}
                      hasNext={hasNext}
                      hasPrevious={hasPrevious}
                    />
                  </div>
                )}

                {/* Products Grid */}
                <ProductGrid products={products} />

                {/* Bottom Pagination */}
                {totalPages > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={goToPage}
                      totalProducts={totalCount}
                      productsPerPage={productsPerPage}
                      hasNext={hasNext}
                      hasPrevious={hasPrevious}
                    />
                  </div>
                )}
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
                  {(selectedCategory || selectedShops.length > 0 || priceRange.min || priceRange.max || availability !== 'all' || sortOrder) 
                    ? "No products match your filters. Try adjusting your selection."
                    : "No products available at the moment."
                  }
                </p>
                {(selectedCategory || selectedShops.length > 0 || priceRange.min || priceRange.max || availability !== 'all' || sortOrder) && (
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
