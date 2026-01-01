'use client';

import { useShops } from '@/hooks/useShops';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopsPage() {
  const { shops, loading, error, clearError } = useShops();

  // Debug logging
  console.log('Shops Page Debug:', {
    loading,
    error,
    shopsLength: shops?.length,
    shops: shops
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Shopping Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Partner Shops
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl">
            Browse products from our trusted retail partners
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-300 font-semibold mb-1">Error Loading Shops</h3>
                  <p className="text-red-200/80 text-sm">{error}</p>
                  <button
                    onClick={clearError}
                    className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                  <div className="h-20 bg-white/5 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/5 rounded mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shops Grid */}
        {!loading && !error && shops.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {shops.map((shop) => (
              <Link
                href={`/shops/${shop.slug}`}
                key={shop.id}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-emerald-500/0 group-hover:border-emerald-500/30 rounded-tr-xl transition-all duration-300"></div>

                <div className="relative p-4 sm:p-6">
                  {/* Shop Logo */}
                  <div className="mb-3 sm:mb-4 flex items-center justify-center h-16 sm:h-20">
                    {shop.logo_url ? (
                      <Image
                        src={shop.logo_url}
                        alt={shop.name}
                        width={160}
                        height={80}
                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-2xl sm:text-3xl ${shop.logo_url ? 'hidden' : 'flex'}`}
                    >
                      🏪
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-2 text-center line-clamp-2 group-hover:text-emerald-300 transition-colors">
                    {shop.name}
                  </h3>
                  
                  {shop.product_count !== undefined && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-1 rounded-md font-mono">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {shop.product_count}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && shops.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl sm:text-4xl">🏪</span>
            </div>
            <p className="text-gray-400 text-base sm:text-lg">No shops found</p>
          </div>
        )}
      </div>

      <style jsx>{`
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
