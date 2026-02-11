'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    setDisplayedProducts(allProducts.slice(0, visibleCount));
  }, [visibleCount, allProducts]);

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
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Popular <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Categories</span>
              </h2>
              <Link 
                href="/categories"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {category.name}
                    </h3>
                    {category.product_count !== undefined && (
                      <p className="text-xs text-gray-400 mt-1">{category.product_count} products</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Full <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Catalog</span>
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>{displayedProducts.length} of {allProducts.length} products</span>
            </div>
          </div>
          
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
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
                  >
                    Load More ({Math.min(24, allProducts.length - visibleCount)} more)
                  </button>
                  <button
                    onClick={showAll}
                    className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Show All ({allProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400">No products available in the catalog.</p>
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
