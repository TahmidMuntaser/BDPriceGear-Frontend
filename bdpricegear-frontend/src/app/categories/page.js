'use client';

import { useCategories } from '@/hooks/useCategories';
import Link from 'next/link';
import Image from 'next/image';
import { Package2, Layers, Grid3x3, Sparkles, TrendingUp, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const { categories, loading, error, clearError } = useCategories();

  // Debug logging
  console.log('Categories Page Debug:', {
    loading,
    error,
    categoriesLength: categories?.length,
    categories: categories
  });

  // PC Hardware category image mapping - same as home page
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

  // Color schemes for categories - same as home page
  const getColorScheme = (index) => {
    const schemes = [
      { from: 'from-emerald-500', to: 'to-teal-500', border: 'border-emerald-400/30', shadow: 'shadow-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/20' },
      { from: 'from-blue-500', to: 'to-cyan-500', border: 'border-blue-400/30', shadow: 'shadow-blue-500/20', text: 'text-blue-400', bg: 'bg-blue-500/20' },
      { from: 'from-purple-500', to: 'to-pink-500', border: 'border-purple-400/30', shadow: 'shadow-purple-500/20', text: 'text-purple-400', bg: 'bg-purple-500/20' },
      { from: 'from-orange-500', to: 'to-red-500', border: 'border-orange-400/30', shadow: 'shadow-orange-500/20', text: 'text-orange-400', bg: 'bg-orange-500/20' },
      { from: 'from-indigo-500', to: 'to-blue-500', border: 'border-indigo-400/30', shadow: 'shadow-indigo-500/20', text: 'text-indigo-400', bg: 'bg-indigo-500/20' },
      { from: 'from-pink-500', to: 'to-rose-500', border: 'border-pink-400/30', shadow: 'shadow-pink-500/20', text: 'text-pink-400', bg: 'bg-pink-500/20' },
      { from: 'from-teal-500', to: 'to-green-500', border: 'border-teal-400/30', shadow: 'shadow-teal-500/20', text: 'text-teal-400', bg: 'bg-teal-500/20' },
      { from: 'from-violet-500', to: 'to-purple-500', border: 'border-violet-400/30', shadow: 'shadow-violet-500/20', text: 'text-violet-400', bg: 'bg-violet-500/20' },
    ];
    return schemes[index % schemes.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black relative overflow-hidden">
      
      {/* Tech Background Pattern - Circuit Board Style */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px'
        }}></div>
      </div>

      {/* Hexagonal Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L93.3 25v50L50 100 6.7 75V25z' fill='none' stroke='%2310b981' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent h-32 animate-[scan_4s_ease-in-out_infinite]"></div>
      </div>

      {/* Animated Glow Effects with Tech Colors */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Corner Tech Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-emerald-500/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 border-r-2 border-t-2 border-cyan-500/20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 border-l-2 border-b-2 border-teal-500/20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-emerald-500/20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Enhanced Title with Tech Effect */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-emerald-400 to-emerald-400"></div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-400/30 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 text-xs font-mono uppercase tracking-wider">CATALOG</span>
              </div>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-emerald-400 to-emerald-400"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 relative">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent relative inline-block">
              All Categories
              {/* Scan line effect on text */}
              <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-1 animate-[scan-text_3s_ease-in-out_infinite]"></span>
            </span>
          </h1>
          
          {/* Binary code decoration */}
          <div className="flex items-center justify-center gap-1 mb-4 opacity-30">
            <span className="text-emerald-500 text-xs font-mono">01001000</span>
            <span className="text-cyan-500 text-xs font-mono">01000001</span>
            <span className="text-teal-500 text-xs font-mono">01010010</span>
          </div>
          
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 relative">
            <span className="relative inline-block">
              Explore our complete collection of PC hardware and components
              {/* Typing cursor effect */}
              <span className="inline-block w-0.5 h-5 bg-emerald-400 ml-1 animate-blink"></span>
            </span>
          </p>

          {/* Enhanced Stats Bar with Tech Design */}
          {!loading && categories.length > 0 && (
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border-2 border-emerald-500/30 rounded-full relative group hover:border-emerald-400/50 transition-all duration-300">
              {/* Corner accents */}
              <div className="absolute top-0 left-4 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent"></div>
              <div className="absolute bottom-0 right-4 w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
              
              <Layers className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="text-white font-bold font-mono tracking-wider">
                {categories.length} 
              </span>
              <span className="text-emerald-400 font-semibold text-sm">CATEGORIES</span>
              
              <span className="w-px h-6 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"></span>
              
              <Package2 className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-white font-bold font-mono tracking-wider">
                {categories.reduce((sum, cat) => sum + (cat.product_count || 0), 0)}
              </span>
              <span className="text-cyan-400 font-semibold text-sm">PRODUCTS</span>
              
              {/* Animated dots */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>
              </div>
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-300 font-bold text-lg mb-2">Error Loading Categories</h3>
                    <p className="text-red-200/80 mb-4">{error}</p>
                    <button
                      onClick={clearError}
                      className="px-5 py-2.5 bg-red-500/30 text-red-200 rounded-xl hover:bg-red-500/50 transition-all duration-300 text-sm font-semibold hover:scale-105"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State with Tech Design */}
        {loading && (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 w-24 h-24 border-4 border-emerald-500/20 rounded-full animate-spin-slow"></div>
                
                {/* Main spinner */}
                <div className="w-20 h-20 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                
                {/* Center pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
                
                {/* Corner indicators */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-emerald-400 animate-pulse"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-teal-400 animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-emerald-400 animate-pulse"></div>
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm uppercase tracking-wider">Loading</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </span>
              </div>
            </div>
            
            {/* Skeleton cards with tech design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse relative">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    {/* Scan line effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-full translate-y-0 animate-[scan_3s_ease-in-out_infinite]" style={{animationDelay: `${i * 0.2}s`}}></div>
                    
                    {/* Tech corners */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-emerald-400/30"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-emerald-400/30"></div>
                    
                    <div className="aspect-square bg-white/10 rounded-xl mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="h-4 bg-white/10 rounded mb-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="h-3 bg-white/10 rounded w-2/3 mx-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categories.length > 0 && (
          <div className="space-y-8">
            
            {/* Featured Categories Badge with Tech Style */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-400"></div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest font-mono">
                  &lt;All Categories/&gt;
                </span>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400"></div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((category, index) => {
                const colorScheme = getColorScheme(index);
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-xl p-3 sm:p-4 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl text-center overflow-hidden"
                  >
                    {/* Tech Corner Brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-emerald-400/0 group-hover:border-emerald-400/80 transition-all duration-300"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400/0 group-hover:border-cyan-400/80 transition-all duration-300"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-teal-400/0 group-hover:border-teal-400/80 transition-all duration-300"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-emerald-400/0 group-hover:border-emerald-400/80 transition-all duration-300"></div>

                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.from}/10 ${colorScheme.to}/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
                    
                    {/* Scan Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                      {/* Category Image with Tech Frame */}
                      <div className="relative mb-3 sm:mb-4">
                        {/* Hexagonal border hint */}
                        <div className={`absolute inset-0 border-2 ${colorScheme.border} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`}></div>
                        
                        <div className={`w-full aspect-square mx-auto bg-gradient-to-br ${colorScheme.from}/20 ${colorScheme.to}/20 border-2 ${colorScheme.border} rounded-xl overflow-hidden group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-lg ${colorScheme.shadow} relative`}>
                          <Image
                            src={getCategoryImage(category.name, category.slug)}
                            alt={category.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                          {/* Tech Overlay Effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Circuit pattern overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{
                            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                      </div>
                      
                      {/* Category Name with Glitch Effect */}
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-300 mb-3 line-clamp-2 min-h-[2.5rem] flex items-center justify-center relative">
                        {category.name}
                        {/* Data glitch effect */}
                        <span className="absolute inset-0 text-emerald-400 opacity-0 group-hover:opacity-50 blur-sm animate-glitch-1">{category.name}</span>
                      </h3>
                      
                      {/* Product Count Badge with Tech Design */}
                      {category.product_count !== undefined && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${colorScheme.from}/20 ${colorScheme.to}/20 border-2 ${colorScheme.border} backdrop-blur-sm mb-2 relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                          {/* Animated background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          
                          <Package2 className={`w-3.5 h-3.5 ${colorScheme.text} relative z-10`} />
                          <span className="text-xs font-bold text-white font-mono relative z-10">
                            {String(category.product_count).padStart(3, '0')}
                          </span>
                        </div>
                      )}
                      
                      {/* Description with tech styling */}
                      {category.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                          &gt; {category.description}
                        </p>
                      )}
                      
                      {/* Hover Arrow Indicator with pulse */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="relative">
                          <ArrowRight className={`w-4 h-4 ${colorScheme.text} animate-pulse`} />
                          <div className={`absolute inset-0 w-4 h-4 ${colorScheme.bg} rounded-full blur animate-ping`}></div>
                        </div>
                      </div>
                      
                      {/* Tech ID Badge */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                        <span className="text-[10px] font-mono text-emerald-400">#CAT-{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom CTA with Enhanced Tech Design */}
            <div className="mt-12 relative">
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              
              <div className="relative bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border-2 border-emerald-400/40 rounded-2xl p-8 text-center overflow-hidden">
                {/* Tech pattern background */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}></div>
                
                {/* Animated scan line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent h-32 animate-[scan_6s_ease-in-out_infinite]"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-block mb-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="text-emerald-400 text-xs font-mono uppercase tracking-wider">System Ready</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Can&apos;t find what you&apos;re <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">looking for?</span>
                  </h3>
                  <p className="text-gray-400 mb-6 font-mono text-sm">
                    &gt; Use our advanced search to find the best prices on any product
                  </p>
                  <Link 
                    href="/price-comparison"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 relative group"
                  >
                    {/* Button glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    
                    <span className="relative flex items-center gap-3">
                      <span className="font-mono uppercase tracking-wider">Start Price Comparison</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State with Tech Design */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              {/* Glowing border effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              
              <div className="relative w-32 h-32 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-2xl flex items-center justify-center">
                {/* Tech corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-emerald-400"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-teal-400"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-emerald-400"></div>
                
                <Package2 className="w-16 h-16 text-gray-400" />
              </div>
              
              <div className="absolute -top-2 -right-2">
                <AlertCircle className="w-10 h-10 text-yellow-500 animate-pulse" />
              </div>
            </div>
            
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-red-500/10 border border-red-400/30 rounded-full text-red-400 text-xs font-mono uppercase tracking-wider">
                Error 404
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                No Categories Found
              </span>
            </h3>
            <p className="text-gray-400 text-lg mb-6 font-mono">
              &gt; We couldn&apos;t find any categories at the moment
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-semibold hover:scale-105 shadow-lg hover:shadow-emerald-500/50 relative group"
            >
              {/* Button glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              <span className="relative flex items-center gap-2 font-mono uppercase tracking-wider">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Refresh System
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Custom Tech Animations */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
        }
        
        @keyframes scan-text {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); opacity: 0; }
          33% { transform: translate(-2px, 2px); opacity: 0.7; }
          66% { transform: translate(2px, -2px); opacity: 0.7; }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); opacity: 0; }
          33% { transform: translate(2px, -2px); opacity: 0.5; }
          66% { transform: translate(-2px, 2px); opacity: 0.5; }
        }
        
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-glitch-1 {
          animation: glitch-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          animation-delay: 0.15s;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
