'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCategoryDetail } from '@/hooks/useCategories';
import Link from 'next/link';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const { category, products, loading, error, clearError } = useCategoryDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4">
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Category</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/categories')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Category Not Found</h2>
          <button
            onClick={() => router.push('/categories')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

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
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link href="/categories" className="text-blue-400 hover:text-blue-300 transition-colors">
            Categories
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          {products.length > 0 && (
            <p className="text-gray-400 mt-4">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="group/card relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover/card:opacity-20 transition duration-300"></div>
                    <div className="relative">
                      {product.image_url && (
                        <div className="mb-4 overflow-hidden rounded-xl">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-48 object-cover transform transition-transform duration-500 group-hover/card:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-white mb-3 text-sm leading-tight line-clamp-2 group-hover/card:text-blue-300 transition-colors">
                        {product.name}
                      </h3>
                      {product.shop_name && (
                        <span className="inline-block text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full mb-2">
                          {product.shop_name}
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          ৳{parseFloat(product.current_price)?.toLocaleString('en-BD') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-gray-400 text-lg">No products found in this category</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/categories')}
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Categories</span>
          </button>
        </div>
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
