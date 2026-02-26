'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SearchForm from '../components/SearchForm';
import ProductGrid from '../components/ProductGrid';
import { useCategories } from '../hooks/useCategories';
import { useShops } from '../hooks/useShops';
import { catalogAPI } from '../services/api';
import { TrendingUp, Zap, Shield, Clock, ArrowRight, Search, Tag, Store, ShoppingBag, Package } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24); // Show 24 products initially
  const [sortBy, setSortBy] = useState('default'); // default, price-low, price-high, name
  const [filterCategory, setFilterCategory] = useState('all');
  const router = useRouter();

  // Fetch data using hooks - with delay to avoid rate limiting
  const { categories, loading: categoriesLoading } = useCategories();
  const { shops, loading: shopsLoading } = useShops();

  // Fetch all products on mount with a delay to stagger API calls
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        
        // Add a 300ms delay to stagger API calls and avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const products = await catalogAPI.getAllProducts();
        setAllProducts(products);
        setDisplayedProducts(products.slice(0, 24)); // Initially show 24
      } catch (error) {
        console.error('Failed to fetch all products:', error);
        setProductsError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Update displayed products when visibleCount changes
  useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category_name === filterCategory || product.category_slug === filterCategory
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => {
          const priceA = parseFloat(a.current_price || a.price || 0);
          const priceB = parseFloat(b.current_price || b.price || 0);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => {
          const priceA = parseFloat(a.current_price || a.price || 0);
          const priceB = parseFloat(b.current_price || b.price || 0);
          return priceB - priceA;
        });
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep default order
        break;
    }
    
    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  }, [visibleCount, allProducts, sortBy, filterCategory]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 24, allProducts.length));
  };

  const showAll = () => {
    setVisibleCount(allProducts.length);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push(`/price-comparison?product=${encodeURIComponent(searchTerm.trim())}`);
      }, 300);
    }
  };

  // PC Hardware category image mapping
  const getCategoryImage = (categoryName, categorySlug) => {
    const searchStr = `${categoryName} ${categorySlug}`.toLowerCase();
    
    // PC Hardware categories mapping
    const imageMap = {
      'cabinet': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=500&fit=crop&q=80',
      'cpu cooler': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn5ESHqPW1EjY_EYyQKXCdlMjFIx0LROgWqg&s',
      'cooler': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn5ESHqPW1EjY_EYyQKXCdlMjFIx0LROgWqg&s',
      'gpu': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&q=80',
      'hdd': 'https://media.istockphoto.com/id/1297963606/photo/computer-hard-disk-drives-hdd-ssd-on-circuit-board-motherboard-background-close-up-with-red.jpg?s=612x612&w=0&k=20&c=FDu0fVrhGKDKTWW__Kucv8fK9yB_L8V6VtsFjsfXeq8=',
      'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop&q=80',
      'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop&q=80',
      'motherboard': 'https://cdn.mos.cms.futurecdn.net/XCwtat9MquwrydqmLo9TYh.jpg',
      'mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80',
      'power supply': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwQS9H7_dt40ut38s-xSb-iKFGy-QtRzb_0w&s',
      'power': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwQS9H7_dt40ut38s-xSb-iKFGy-QtRzb_0w&s',
      'processor': 'https://www.wepc.com/wp-content/uploads/2023/10/best-cpu-for-gaming.jpg',
      'ram': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIhnRKQtiSyBc8sLSf4F9pdyDcyW1D4LFGyg&s',
      'ssd': 'https://assets.micron.com/adobe/assets/urn:aaid:aem:2715df69-3ebd-4f14-a81f-49f94647f405/as/product-5400-group-01-right-black.jpg?width=1500&preferwebp=true',
    };
    
    // Match category
    for (const [keyword, imageUrl] of Object.entries(imageMap)) {
      if (searchStr.includes(keyword)) {
        return imageUrl;
      }
    }
    
    // Default PC component image
    return 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=500&fit=crop&q=80';
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Comparison",
      description: "Get instant price updates from all major stores"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Best Deals",
      description: "Find the lowest prices across Bangladesh"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Stores",
      description: "Compare prices from verified retailers only"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "No need to browse multiple websites"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Search Product",
      description: "Enter the product name you want to buy",
      icon: <Search className="w-8 h-8" />
    },
    {
      step: "2",
      title: "Compare Prices",
      description: "View prices from all major stores instantly",
      icon: <Tag className="w-8 h-8" />
    },
    {
      step: "3",
      title: "Save Money",
      description: "Choose the best deal and shop smart",
      icon: <ShoppingBag className="w-8 h-8" />
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black relative overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                BDPriceGear
              </span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
            Compare <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Save</span> ShopSmart
          </p>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-12">
            Find the best prices across Bangladesh&apos;s top e-commerce stores in seconds. Save money on every purchase.
          </p>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <SearchForm 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              loading={isTransitioning}
              redirectToResults={false}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Categories Section */}
        {!categoriesLoading && categories && categories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Popular <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Categories</span>
                </h2>
                <p className="text-gray-400 text-sm">Browse products by category</p>
              </div>
              <Link 
                href="/categories"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group font-semibold"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Enhanced Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {categories.slice(0, 6).map((category, index) => {
                // Category-specific color schemes
                const colorSchemes = [
                  { from: 'from-emerald-500', to: 'to-teal-500', border: 'border-emerald-400/30', shadow: 'shadow-emerald-500/20' },
                  { from: 'from-blue-500', to: 'to-cyan-500', border: 'border-blue-400/30', shadow: 'shadow-blue-500/20' },
                  { from: 'from-purple-500', to: 'to-pink-500', border: 'border-purple-400/30', shadow: 'shadow-purple-500/20' },
                  { from: 'from-orange-500', to: 'to-red-500', border: 'border-orange-400/30', shadow: 'shadow-orange-500/20' },
                  { from: 'from-indigo-500', to: 'to-blue-500', border: 'border-indigo-400/30', shadow: 'shadow-indigo-500/20' },
                  { from: 'from-pink-500', to: 'to-rose-500', border: 'border-pink-400/30', shadow: 'shadow-pink-500/20' }
                ];
                const colorScheme = colorSchemes[index % colorSchemes.length];
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl text-center overflow-hidden"
                  >
                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.from}/10 ${colorScheme.to}/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
                    
                    <div className="relative z-10">
                      {/* Category Image with Animation */}
                      <div className={`w-full aspect-square mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${colorScheme.from}/20 ${colorScheme.to}/20 border ${colorScheme.border} rounded-xl overflow-hidden group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-lg ${colorScheme.shadow}`}>
                        <Image
                          src={getCategoryImage(category.name, category.slug)}
                          alt={category.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                        {/* Overlay gradient for better text visibility */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      </div>
                      
                      {/* Category Name */}
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-emerald-300 transition-all duration-300 mb-2 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                        {category.name}
                      </h3>
                      
                      {/* Product Count Badge */}
                      {category.product_count !== undefined && (
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r ${colorScheme.from}/20 ${colorScheme.to}/20 border ${colorScheme.border} backdrop-blur-sm`}>
                          <span className="text-xs font-semibold text-white">
                            {category.product_count}
                          </span>
                        </div>
                      )}
                      
                      {/* Hover Arrow Indicator */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Quick Category Stats */}
            {categories.length > 6 && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  + {categories.length - 6} more categories available
                </p>
              </div>
            )}
          </div>
        )}

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get the best prices in three simple steps
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorks.map((item, index) => (
                <div 
                  key={index}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-emerald-400/50 transition-all duration-300 h-full flex flex-col">
                    {/* Icon Container */}
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-2xl blur-2xl"></div>
                      <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/30 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {item.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Arrow Indicator (except last item) */}
                    {index < howItWorks.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-9 lg:-right-11 -translate-y-1/2 z-20">
                        <span className="text-4xl font-bold text-emerald-400/60 inline-block animate-[pulse_1.5s_ease-in-out_infinite] hover:animate-none">
                          <span className="inline-block animate-[bounce-x_1s_ease-in-out_infinite]">&gt;</span>
                          <span className="inline-block animate-[bounce-x_1s_ease-in-out_infinite] [animation-delay:0.15s]">&gt;</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Stores Section */}
        {!shopsLoading && shops && shops.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
              Partner <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Stores</span>
            </h2>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {shops.slice(0, 7).map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/shops/${shop.slug}`}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="w-16 h-16 mb-3 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Store className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-sm text-white text-center group-hover:text-emerald-300 transition-colors truncate w-full">
                      {shop.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full Product Catalog Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Full <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Catalog</span>
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Package className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">
                  Showing {displayedProducts.length} of {allProducts.length} products
                </span>
              </div>
            </div>
            
            {/* Filter and Sort Controls */}
            {!productsLoading && allProducts.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setVisibleCount(24); // Reset to initial count when filtering
                  }}
                  className="px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400/50 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <option value="all" className="bg-gray-900">All Categories</option>
                  {categories && categories.map((category) => (
                    <option key={category.id} value={category.slug} className="bg-gray-900">
                      {category.name}
                    </option>
                  ))}
                </select>
                
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400/50 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <option value="default" className="bg-gray-900">Default Order</option>
                  <option value="price-low" className="bg-gray-900">Price: Low to High</option>
                  <option value="price-high" className="bg-gray-900">Price: High to Low</option>
                  <option value="name" className="bg-gray-900">Name: A to Z</option>
                </select>
                
                {/* Reset Filters */}
                {(filterCategory !== 'all' || sortBy !== 'default') && (
                  <button
                    onClick={() => {
                      setFilterCategory('all');
                      setSortBy('default');
                      setVisibleCount(24);
                    }}
                    className="px-4 py-2.5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Featured Products Banner */}
          {!productsLoading && allProducts.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Featured Products</h3>
                    <p className="text-sm text-gray-400">Handpicked deals for you</p>
                  </div>
                </div>
              </div>
              
              {/* Featured Products Grid - Show first 4 products */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {allProducts.slice(0, 4).map((product, index) => (
                  <Link
                    key={product.id || index}
                    href={`/products/${product.id}`}
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-emerald-400/50"
                  >
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                        Featured
                      </span>
                    </div>
                    {product.image_url && (
                      <div className="mb-3 overflow-hidden rounded-lg">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-24 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h4>
                    <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      ৳{parseFloat(product.current_price || product.price || 0).toLocaleString('en-BD')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          {productsLoading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-lg">Loading full catalog...</p>
              </div>
            </div>
          ) : productsError ? (
            <div className="bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center">
              <p className="text-red-400 mb-4">{productsError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <ProductGrid products={displayedProducts} />
              
              {/* Load More / Show All Buttons */}
              {visibleCount < allProducts.length && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <button
                    onClick={loadMore}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Load More
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      +{Math.min(24, allProducts.length - visibleCount)}
                    </span>
                  </button>
                  <button
                    onClick={showAll}
                    className="w-full sm:w-auto px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Show All
                    <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-xs">
                      {allProducts.length - visibleCount} more
                    </span>
                  </button>
                </div>
              )}
              
              {/* All Products Loaded Message */}
              {visibleCount >= allProducts.length && (
                <div className="text-center mt-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-emerald-300">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">You&apos;ve viewed all products!</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or check back later</p>
              <button
                onClick={() => {
                  setFilterCategory('all');
                  setSortBy('default');
                }}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  {allProducts.length > 0 ? allProducts.length.toLocaleString() + '+' : '10,000+'}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Products Tracked</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  {shops?.length || '7'}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Trusted Stores</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Price Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of smart shoppers who save money every day with BD Price Gear
          </p>
          <Link 
            href="/price-comparison"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
          >
            Start Comparing Prices
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
