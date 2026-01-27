'use client';

import { useParams, useRouter } from 'next/navigation';
import { useShopDetail } from '@/hooks/useShops';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const { shop, loading, error } = useShopDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.15) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.15) 2px, transparent 2px)',
            backgroundSize: '60px 60px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5"></div>
        </div>

        {/* Glow effects */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gradient-to-r from-white/10 to-white/5 rounded-lg w-48"></div>
            <div className="h-56 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-2xl"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-72 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 2px, transparent 2px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="text-center p-6 relative">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/20">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-400 rounded-bl-lg"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Error Loading Shop</h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-md">{error}</p>
          
          <button
            onClick={() => router.push('/shops')}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-105"
          >
            <span className="relative z-10">Back to Shops</span>
          </button>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 2px, transparent 2px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="text-center p-6 relative">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-teal-400 rounded-bl-lg"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Shop Not Found</h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-md">The shop you&apos;re looking for doesn&apos;t exist</p>
          
          <button
            onClick={() => router.push('/shops')}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-105"
          >
            <span className="relative z-10">Browse All Shops</span>
          </button>
        </div>
      </div>
    );
  }

  const products = shop.products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.15) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.15) 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5"></div>
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[
          { label: 'Shops', href: '/shops', icon: 'shops' },
          { label: shop.name }
        ]} />

        {/* Enhanced Shop Header */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 sm:p-10 mb-10 sm:mb-14 shadow-2xl shadow-emerald-500/10 overflow-hidden group">
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 border-t-4 border-l-4 border-emerald-400/60 rounded-tl-2xl group-hover:border-emerald-400 transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 border-b-4 border-r-4 border-teal-400/60 rounded-br-2xl group-hover:border-teal-400 transition-colors"></div>
          
          {/* Floating accent elements */}
          <div className="absolute top-1/2 left-0 w-1 h-12 bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent"></div>
          <div className="absolute top-1/2 right-0 w-1 h-12 bg-gradient-to-b from-transparent via-teal-400/50 to-transparent"></div>

          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-center gap-8 sm:gap-10">
            {/* Enhanced Shop Logo */}
            <div className="flex-shrink-0 relative group/logo">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover/logo:blur-2xl transition-all"></div>
              {shop.logo_url ? (
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-4 shadow-xl flex items-center justify-center overflow-hidden group-hover/logo:border-emerald-400/40 transition-all">
                  <Image
                    src={shop.logo_url}
                    alt={shop.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-contain transform group-hover/logo:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="hidden w-full h-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-xl items-center justify-center text-6xl"
                  >
                    🏪
                  </div>
                </div>
              ) : (
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-2 border-emerald-400/40 rounded-2xl flex items-center justify-center text-6xl sm:text-7xl shadow-xl group-hover/logo:scale-105 transition-transform">
                  🏪
                </div>
              )}
            </div>

            {/* Enhanced Shop Info */}
            <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="h-1 w-10 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Official Store</span>
                <div className="h-1 w-10 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight drop-shadow-2xl">
                {shop.name}
              </h1>
              
              {shop.description && (
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto md:mx-0">
                  {shop.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start pt-2">
                {shop.website_url && (
                  <a
                    href={shop.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative px-5 py-2.5 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-emerald-400/50 text-emerald-400 rounded-lg transition-all duration-300 hover:scale-105 font-medium text-sm shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>Visit Website</span>
                    <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Products Section */}
        {products.length > 0 ? (
          <>
            <div className="relative mb-8 sm:mb-10">
              <div className="flex items-center gap-4 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm border-l-4 border-emerald-500 pl-6 py-3 rounded-r-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center border border-emerald-400/30">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Available Products
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">Explore our collection</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-md border-2 border-white/20 hover:border-emerald-400/50 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-emerald-500/20"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400/0 group-hover:border-emerald-400/60 rounded-tl-xl transition-colors"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-teal-400/0 group-hover:border-teal-400/60 rounded-br-xl transition-colors"></div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500"></div>

                  <div className="relative">
                    {product.image_url && (
                      <div className="aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="relative z-10 w-full h-full object-contain p-4 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <h3 className="font-bold text-white text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-emerald-300 transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      {product.category_name && (
                        <span className="inline-block text-[10px] sm:text-xs bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40 text-teal-300 px-2.5 py-1 rounded-lg font-semibold shadow-sm">
                          {product.category_name}
                        </span>
                      )}
                      
                      <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="text-xs text-gray-400 font-medium">৳</span>
                        <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                          {parseFloat(product.current_price)?.toLocaleString('en-BD') || 'N/A'}
                        </p>
                      </div>

                      {/* View button on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                          <span>View Details</span>
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 sm:py-28">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-5xl sm:text-6xl">📦</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-teal-400 rounded-bl-lg"></div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400 text-sm sm:text-base">This shop hasn&apos;t listed any products at the moment</p>
          </div>
        )}

        {/* Enhanced Back Button */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10">
          <button
            onClick={() => router.push('/shops')}
            className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/20 hover:border-emerald-400/50 text-emerald-400 hover:text-emerald-300 rounded-xl transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-emerald-500/20"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to All Shops</span>
          </button>
        </div>
      </div>
    </div>
  );
}
