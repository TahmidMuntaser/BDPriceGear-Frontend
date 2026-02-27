'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SearchForm from '../components/SearchForm';
import { useCategories } from '../hooks/useCategories';
import { useShops } from '../hooks/useShops';
import { catalogAPI } from '../services/api';
import { ArrowRight, Store, Package } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const router = useRouter();

  // Fetch data using hooks - with delay to avoid rate limiting
  const { categories, loading: categoriesLoading } = useCategories();
  const { shops, loading: shopsLoading } = useShops();

  // Fetch popular products on mount
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        
        const products = await catalogAPI.getPopularProducts();
        setPopularProducts(products);
      } catch (error) {
        setProductsError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);



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
      title: "Real-Time Comparison",
      description: "Get instant price updates from all major stores"
    },
    {
      title: "Best Deals",
      description: "Find the lowest prices across Bangladesh"
    },
    {
      title: "Trusted Stores",
      description: "Compare prices from verified retailers only"
    },
    {
      title: "Save Time",
      description: "No need to browse multiple websites"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Search Product",
      description: "Enter the product name you want to buy"
    },
    {
      step: "2",
      title: "Compare Prices",
      description: "View prices from all major stores instantly"
    },
    {
      step: "3",
      title: "Save Money",
      description: "Choose the best deal and shop smart"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black relative overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background — subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.8) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Soft ambient glow — no animation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-14 sm:mb-20">
          {/* Tagline chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Bangladesh&apos;s Price Intelligence
          </div>

          {/* Brand */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              BDPriceGear
            </span>
          </h1>

          {/* Headline */}
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 mb-3 tracking-tight">
            Compare prices. Save money. Shop smarter.
          </p>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Search any product and instantly see the best prices across Bangladesh&apos;s top tech retailers - all in one place.
          </p>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {features.map((feature, index) => {
            const accents = [
              'from-emerald-500 to-teal-500',
              'from-teal-500 to-cyan-500',
              'from-cyan-500 to-sky-500',
              'from-sky-500 to-indigo-500',
            ];
            const glows = [
              'group-hover:shadow-emerald-500/10',
              'group-hover:shadow-teal-500/10',
              'group-hover:shadow-cyan-500/10',
              'group-hover:shadow-sky-500/10',
            ];
            return (
              <div
                key={index}
                className={`group relative bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all duration-300 hover:shadow-xl ${glows[index]}`}
              >
                {/* Top accent bar */}
                <div className={`h-[2px] w-full bg-gradient-to-r ${accents[index]}`}></div>

                <div className="p-6">
                  {/* Index + status dot */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono text-white/20 tracking-[0.2em]">
                      SYS.{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${accents[index]}`}></span>
                      <span className="text-[10px] font-mono text-white/20 tracking-wider">ACTIVE</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight leading-snug">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner bracket bottom-right */}
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/[0.08]"></div>
              </div>
            );
          })}
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
        <div className="relative mb-16 overflow-hidden rounded-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>

          {/* Circuit grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hiw-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#34d399" strokeWidth="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hiw-grid)"/>
          </svg>

          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border border-emerald-500/15"></div>

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400/50 rounded-tl"></div>
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400/50 rounded-tr"></div>
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400/50 rounded-bl"></div>
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400/50 rounded-br"></div>

          <div className="relative px-6 sm:px-10 pt-8 pb-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">PROTOCOL_SEQUENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                How It <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-gray-500 text-sm font-mono">
                <span className="text-emerald-400/60">&gt;</span> Execute price comparison in <span className="text-emerald-300">3 steps</span>
              </p>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Connecting pipeline line (desktop only) */}
              <div className="hidden md:block absolute top-[3.25rem] left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px z-10">
                <div className="relative w-full h-full bg-gradient-to-r from-emerald-400/40 via-teal-400/40 to-emerald-400/40">
                  <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)] animate-[data-flow_3s_linear_infinite]"></div>
                </div>
              </div>

              {howItWorks.map((item, index) => {
                const stepColors = [
                  { border: 'border-emerald-400/30', bg: 'bg-emerald-400/10', text: 'text-emerald-300' },
                  { border: 'border-teal-400/30',    bg: 'bg-teal-400/10',    text: 'text-teal-300'    },
                  { border: 'border-cyan-400/30',    bg: 'bg-cyan-400/10',    text: 'text-cyan-300'    },
                ];
                const c = stepColors[index];

                return (
                  <div key={index} className="group relative">
                    <div className={`relative bg-black/40 border ${c.border} rounded-xl p-6 h-full flex flex-col gap-5 hover:border-opacity-70 transition-colors duration-200`}>
                      {/* Corner brackets on card */}
                      <div className={`absolute top-2 left-2 w-3 h-3 border-t border-l ${c.border} opacity-60`}></div>
                      <div className={`absolute top-2 right-2 w-3 h-3 border-t border-r ${c.border} opacity-60`}></div>
                      <div className={`absolute bottom-2 left-2 w-3 h-3 border-b border-l ${c.border} opacity-60`}></div>
                      <div className={`absolute bottom-2 right-2 w-3 h-3 border-b border-r ${c.border} opacity-60`}></div>

                      {/* Step number + icon row */}
                      <div className="flex items-center gap-4">
                        {/* Step badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
                          <span className={`text-xl font-black font-mono ${c.text}`}>0{item.step}</span>
                        </div>

                        {/* Step label */}
                        <div className="ml-auto">
                          <span className={`text-[9px] font-mono ${c.text} opacity-50`}>STEP.{item.step}</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`}></div>

                      {/* Content */}
                      <div>
                        <h3 className={`text-lg font-bold text-white mb-2`}>
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-mono">
                          <span className={`${c.text} opacity-60`}>//</span> {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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

        {/* Popular Products Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Popular <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Products</span>
              </h2>
              <p className="text-gray-400 text-sm">Handpicked tech essentials from top categories</p>
            </div>
            
            <Link 
              href="/products"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group font-semibold"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Popular Products Grid */}
          {productsLoading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-lg">Loading popular products...</p>
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
          ) : popularProducts.length > 0 ? (
            <>
              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                {popularProducts.slice(0, 6).map((product, index) => (
                    <Link
                      key={product.id || index}
                      href={`/products/${product.id}`}
                      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-400/50"
                    >
                      {/* Glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        {/* Product Image */}
                        {product.image_url && (
                          <div className="mb-3 overflow-hidden rounded-xl bg-white/5 aspect-square">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        <div className="mb-2">
                          <span className="inline-block text-[10px] sm:text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md font-semibold uppercase">
                            {product.category_name || 'Product'}
                          </span>
                        </div>
                        
                        {/* Product Name */}
                        <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-300 transition-colors">
                          {product.name}
                        </h4>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            ৳{parseFloat(product.current_price || product.price || 0).toLocaleString('en-BD')}
                          </p>
                          <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              
              {/* View All Button */}
              <div className="mt-8 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
                >
                  Explore All Products
                  <Package className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm">Check back later for amazing deals</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="relative mb-16 overflow-hidden rounded-2xl">
          {/* Circuit board background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stats-circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 30 20 M 30 40 L 30 60 M 0 30 L 20 30 M 40 30 L 60 30" stroke="#34d399" strokeWidth="0.8" fill="none"/>
                <circle cx="30" cy="30" r="3" fill="none" stroke="#34d399" strokeWidth="0.8"/>
                <circle cx="0" cy="0" r="1.5" fill="#34d399"/>
                <circle cx="60" cy="0" r="1.5" fill="#34d399"/>
                <circle cx="0" cy="60" r="1.5" fill="#34d399"/>
                <circle cx="60" cy="60" r="1.5" fill="#34d399"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-circuit)"/>
          </svg>

          {/* Scan line sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-[scan_4s_linear_infinite]"></div>
          </div>

          {/* Glow orbs */}
          <div className="absolute -top-10 left-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>

          {/* Border glow */}
          <div className="absolute inset-0 rounded-2xl border border-emerald-500/20"></div>
          <div className="absolute inset-px rounded-2xl border border-white/5"></div>

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400/60 rounded-tl"></div>
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400/60 rounded-tr"></div>
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400/60 rounded-bl"></div>
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400/60 rounded-br"></div>

          {/* Header bar */}
          <div className="relative flex items-center gap-3 px-6 sm:px-10 pt-6 pb-4 border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" style={{animationDelay:'0.3s'}}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay:'0.6s'}}></span>
            </div>
            <span className="text-xs font-mono text-emerald-400/70 tracking-widest uppercase">SYSTEM_STATUS &gt; LIVE</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] font-mono text-emerald-400/50">ONLINE</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 p-6 sm:p-10">
            {/* Dividers */}
            <div className="hidden sm:block absolute left-1/3 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent"></div>
            <div className="hidden sm:block absolute left-2/3 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent"></div>

            {/* Stat 1 */}
            <div className="group relative flex flex-col items-center justify-center py-6 px-4 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 rounded-xl transition-all duration-500"></div>
              <div className="relative">
                <p className="text-[10px] font-mono text-emerald-400/50 tracking-widest mb-3 uppercase">// products_tracked</p>
                <div className="text-5xl sm:text-6xl font-black font-mono bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  10K<span className="text-emerald-400">+</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-emerald-300 font-medium">Products Tracked</span>
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group relative flex flex-col items-center justify-center py-6 px-4 text-center border-t sm:border-t-0 border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-500"></div>
              <div className="relative">
                <p className="text-[10px] font-mono text-cyan-400/50 tracking-widest mb-3 uppercase">// partner_stores</p>
                <div className="text-5xl sm:text-6xl font-black font-mono bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {shops?.length || '7'}<span className="text-cyan-400">+</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay:'0.4s'}}></span>
                  <span className="text-xs text-cyan-300 font-medium">Trusted Stores</span>
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group relative flex flex-col items-center justify-center py-6 px-4 text-center border-t sm:border-t-0 border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-500"></div>
              <div className="relative">
                <p className="text-[10px] font-mono text-purple-400/50 tracking-widest mb-3 uppercase">// uptime_status</p>
                <div className="text-5xl sm:text-6xl font-black font-mono bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  24<span className="text-purple-400">/</span>7
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{animationDelay:'0.8s'}}></span>
                  <span className="text-xs text-purple-300 font-medium">Price Monitoring</span>
                </div>
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
