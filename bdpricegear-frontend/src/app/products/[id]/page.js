'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { catalogAPI } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await catalogAPI.getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4">
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-800 rounded-3xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-800 rounded"></div>
                <div className="h-6 bg-gray-800 rounded w-2/3"></div>
                <div className="h-32 bg-gray-800 rounded"></div>
                <div className="h-16 bg-gray-800 rounded"></div>
              </div>
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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Product</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-900/50"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-900/50"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

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
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Products', href: '/products', icon: 'products' },
          { label: product.name }
        ]} />

        {/* Product Detail */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Image Section */}
              <div className="relative">
                {product.image_url ? (
                  <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-6 sm:p-8">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gray-800/50 p-8 h-96 flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-white mb-3 leading-tight">
                    {product.name}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2">
                    {product.category_name && (
                      <Link 
                        href={`/categories/${product.category_slug}`}
                        className="inline-block text-xs bg-emerald-600/20 text-emerald-300 px-2.5 py-1 rounded-md hover:bg-emerald-600/30 transition-colors"
                      >
                        📁 {product.category_name}
                      </Link>
                    )}
                    {product.stock_status && (
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-md ${
                        product.stock_status === 'in_stock' 
                          ? 'bg-green-600/20 text-green-300' 
                          : 'bg-red-600/20 text-red-300'
                      }`}>
                        {product.stock_status === 'in_stock' ? '✅ In Stock' : '❌ Out of Stock'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-3xl font-bold text-green-400 mb-1">
                    ৳{parseFloat(product.current_price)?.toLocaleString('en-BD') || 'N/A'}
                  </p>
                  {product.currency && (
                    <p className="text-gray-500 text-xs">Currency: {product.currency}</p>
                  )}
                </div>

                {product.shop_name && (
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Available at</h3>
                    <Link 
                      href={`/shops/${product.shop_slug || product.shop_name.toLowerCase()}`}
                      className="inline-flex items-center space-x-2 bg-gray-800/70 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700/50"
                    >
                      {product.shop_logo && (
                        <Image src={product.shop_logo} alt={product.shop_name} width={80} height={20} className="h-5 w-auto" onError={(e) => e.target.style.display = 'none'} />
                      )}
                      <span className="text-emerald-400 text-sm font-medium">{product.shop_name}</span>
                    </Link>
                  </div>
                )}

                {product.description && (
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Additional Product Info */}
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    {product.slug && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Product ID:</span>
                        <span className="text-gray-300 font-mono">{product.slug}</span>
                      </div>
                    )}
                    {product.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Listed:</span>
                        <span className="text-gray-300">{new Date(product.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {product.updated_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Updated:</span>
                        <span className="text-gray-300">{new Date(product.updated_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {product.product_url && (
                  <div className="pt-4">
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 text-center shadow-lg shadow-emerald-900/50"
                    >
                      Buy Now on {product.shop_name} →
                    </a>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    onClick={() => router.push('/products')}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-2"
                  >
                    <span>←</span>
                    <span>Back to Products</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
