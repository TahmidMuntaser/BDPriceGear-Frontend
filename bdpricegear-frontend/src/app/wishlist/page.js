'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

const getItemProduct = (item) => item?.product || item;
const getItemProductId = (item) => item?.product?.id ?? item?.product_id ?? item?.id ?? item?.product;

export default function WishlistPage() {
  const router = useRouter();
  const { isLoggedIn, openLoginModal, isLoading: authLoading } = useAuth();
  const { items, loading, isMutating, removeItem, refresh } = useWishlist({ enabled: isLoggedIn });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      openLoginModal();
      router.push('/');
    }
  }, [authLoading, isLoggedIn, openLoginModal, router]);

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success('Removed from wishlist.');
    } catch (error) {
      toast.error(error.message || 'Failed to remove wishlist item.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(16, 185, 129, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 2px, transparent 2px)',
              backgroundSize: '60px 60px',
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 animate-pulse space-y-5">
          <div className="h-6 w-44 bg-gray-800 rounded" />
          <div className="h-36 rounded-3xl bg-white/5 border border-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 border border-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black pt-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16, 185, 129, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 2px, transparent 2px)',
            backgroundSize: '60px 60px',
          }}
        ></div>
      </div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', icon: 'home' },
            { label: 'Wishlist' },
          ]}
        />

        <section className="mt-5 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10"></div>
          <div className="relative p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">Wishlist</h1>
                <p className="mt-2 text-gray-300 text-sm sm:text-base">
                  {items.length} product{items.length === 1 ? '' : 's'} saved for later.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/15 text-gray-200 hover:bg-white/5 transition-colors"
                >
                  Browse More
                </Link>
                <button
                  onClick={() => refresh().catch(() => {})}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium transition-all shadow-lg shadow-emerald-500/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Heart className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="mt-4 text-2xl text-white font-semibold">No saved products yet</h2>
            <p className="mt-2 text-gray-400">Start adding products from catalog cards or product modal.</p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            >
              Browse Products
            </Link>
          </section>
        ) : (
          <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 items-stretch">
            {items.map((item) => {
              const product = getItemProduct(item);
              const productId = getItemProductId(item);
              const price = typeof product?.current_price === 'string'
                ? parseFloat(product.current_price)
                : Number(product?.current_price);

              return (
                <article
                  key={`${productId}-${item?.id || 'item'}`}
                  className="group relative h-full w-full max-w-[260px] justify-self-center flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-emerald-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all"></div>

                  <Link href={`/products/${productId}`} className="relative block p-3 flex-1">
                    <div className="flex h-full flex-col">
                      <div className="relative h-36 rounded-lg border border-white/10 bg-gray-900/60 overflow-hidden">
                        {product?.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product?.name || 'Wishlist Product'}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">📦</div>
                        )}

                        {product?.shop_name && (
                          <span className="absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full border border-emerald-400/30 bg-black/50 text-emerald-200 backdrop-blur-sm max-w-[70%] truncate">
                            {product.shop_name}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-white font-semibold leading-tight line-clamp-2 min-h-[2.8rem] group-hover:text-emerald-300 transition-colors">
                        {product?.name || 'Unnamed product'}
                      </h3>

                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                          ৳{Number.isFinite(price) ? price.toLocaleString('en-BD') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="relative px-3 pb-3">
                    <button
                      onClick={() => handleRemove(productId)}
                      disabled={isMutating}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
