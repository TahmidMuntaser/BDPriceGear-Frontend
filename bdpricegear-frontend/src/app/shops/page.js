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
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, #8b5cf6 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Partner Shops
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Browse products from our trusted retail partners
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-30"></div>
              <div className="relative bg-red-900/20 backdrop-blur-xl border border-red-800/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-300 font-semibold mb-2">Error Loading Shops</h3>
                    <p className="text-red-200/80">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-3 px-4 py-2 bg-red-600/30 text-red-200 rounded-lg hover:bg-red-600/50 transition-colors text-sm"
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
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-2xl h-48"></div>
              </div>
            ))}
          </div>
        )}

        {/* Shops Grid */}
        {!loading && !error && shops.length > 0 && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shops.map((shop) => (
                  <Link
                    href={`/shops/${shop.slug}`}
                    key={shop.id}
                    className="group/card relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover/card:opacity-20 transition duration-300"></div>
                    <div className="relative">
                      {/* Shop Logo */}
                      <div className="mb-4 flex items-center justify-center h-24">
                        {shop.logo_url ? (
                          <Image
                            src={shop.logo_url}
                            alt={shop.name}
                            width={200}
                            height={96}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl ${shop.logo_url ? 'hidden' : 'flex'}`}
                        >
                          🏪
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-white mb-2 text-lg text-center group-hover/card:text-blue-300 transition-colors">
                        {shop.name}
                      </h3>
                      
                      {shop.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3 text-center">
                          {shop.description}
                        </p>
                      )}
                      
                      {shop.product_count !== undefined && (
                        <div className="text-center">
                          <span className="inline-block text-xs bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full">
                            {shop.product_count} products
                          </span>
                        </div>
                      )}

                      {shop.website_url && (
                        <div className="mt-4 text-center">
                          <span className="text-xs text-gray-500">
                            {shop.website_url.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && shops.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏪</span>
            </div>
            <p className="text-gray-400 text-lg">No shops found</p>
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
