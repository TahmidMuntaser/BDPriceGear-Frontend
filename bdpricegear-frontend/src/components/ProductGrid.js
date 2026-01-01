'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductGrid({ products, showModal = false }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
          <span className="text-2xl">😔</span>
        </div>
        <p className="text-gray-300">No products available</p>
      </div>
    );
  }

  const handleProductClick = (e, product) => {
    if (showModal) {
      e.preventDefault();
      setSelectedProduct(product);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const renderProduct = (product, productIndex) => {
    // Support both catalog API format and search API format
    const productId = product.id;
    const productName = product.name;
    const productImage = product.image_url || product.img;
    const productPrice = product.current_price || product.price;
    const productStore = product.shop_name || product.storeName;
    const productUrl = product.link || product.product_url || product.url;
    const productCategory = product.category_name || product.category;
    
    const content = (
      <>
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-md opacity-0 group-hover/card:opacity-30 transition duration-500"></div>
        
        <div className="relative">
          {/* Store Badge */}
          {productStore && (
            <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2 z-10">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-lg backdrop-blur-sm truncate max-w-20 sm:max-w-none border border-white/20">
                {productStore}
              </span>
            </div>
          )}
          
          {productImage && (
            <div className="mb-3 md:mb-4 overflow-hidden rounded-xl border border-white/10">
              <Image
                src={productImage}
                alt={productName}
                width={400}
                height={300}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transform transition-transform duration-500 group-hover/card:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs sm:text-sm leading-tight line-clamp-2 group-hover/card:text-emerald-300 transition-colors drop-shadow-sm">
            {productName}
          </h4>
          
          {/* Category Badge */}
          {productCategory && (
            <span className="inline-block text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full mb-2 backdrop-blur-sm border border-emerald-400/20">
              {productCategory}
            </span>
          )}
          
          <div className="flex items-center justify-between mt-3 md:mt-4">
            <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
              ৳{(typeof productPrice === 'string' ? parseFloat(productPrice) : productPrice)?.toLocaleString('en-BD') || 'N/A'}
            </p>
          </div>
        </div>
      </>
    );

    const className = "group/card relative bg-white/5 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 min-w-0 block cursor-pointer";

    if (showModal || !productId) {
      return (
        <div
          key={`${productStore}-${productId || productIndex}`}
          className={className}
          onClick={(e) => handleProductClick(e, product)}
        >
          {content}
        </div>
      );
    } else {
      return (
        <Link
          href={`/products/${productId}`}
          key={`${productStore}-${productId || productIndex}`}
          className={className}
        >
          {content}
        </Link>
      );
    }
  };

  return (
    <>
      <div className="relative group">
        {/* Outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
        
        {/* Main container with glassmorphism */}
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {products.map(renderProduct)}
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

      {/* Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2"
          onClick={closeModal}
        >
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 border border-emerald-500/30 rounded-lg sm:rounded-xl md:rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
            
            {/* Tech grid background */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-9 sm:h-9 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg flex items-center justify-center transition-all duration-200 group backdrop-blur-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative p-3 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
                {/* Image Section */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6 relative overflow-hidden">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 border-t-2 border-l-2 border-emerald-500/40 rounded-tl-lg sm:rounded-tl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 border-b-2 border-r-2 border-emerald-500/40 rounded-br-lg sm:rounded-br-xl"></div>
                    
                    {(selectedProduct.image_url || selectedProduct.img) && (
                      <div className="relative z-10">
                        <Image
                          src={selectedProduct.image_url || selectedProduct.img}
                          alt={selectedProduct.name}
                          width={600}
                          height={600}
                          className="w-full h-auto object-contain rounded-lg"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-between space-y-3 sm:space-y-5">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                      <div className="h-0.5 sm:h-1 w-6 sm:w-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-400 uppercase tracking-wider">Product Info</span>
                    </div>
                    
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight pr-8 sm:pr-10">
                      {selectedProduct.name}
                    </h2>

                    {(selectedProduct.category_name || selectedProduct.category) && (
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-sm font-medium text-emerald-300">{selectedProduct.category_name || selectedProduct.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {/* Price Card */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-4 md:p-5">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-[10px] sm:text-xs font-mono text-emerald-400/80 uppercase tracking-wider">Current Price</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse delay-75"></div>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse delay-150"></div>
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                          ৳{(typeof (selectedProduct.current_price || selectedProduct.price) === 'string' 
                            ? parseFloat(selectedProduct.current_price || selectedProduct.price) 
                            : (selectedProduct.current_price || selectedProduct.price))?.toLocaleString('en-BD') || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Store Card */}
                    {(selectedProduct.shop_name || selectedProduct.storeName) && (
                      <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 hover:border-emerald-500/30 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase tracking-wider">Available at</p>
                            <p className="text-xs sm:text-sm font-semibold text-white break-words">{selectedProduct.shop_name || selectedProduct.storeName}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div>
                    {(selectedProduct.link || selectedProduct.product_url || selectedProduct.url) ? (
                      <a
                        href={selectedProduct.link || selectedProduct.product_url || selectedProduct.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-full overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-100 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                        <div className="relative px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-center gap-2 rounded-lg sm:rounded-xl border border-emerald-400/50">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-xs sm:text-sm font-semibold text-white">View on Store</span>
                          <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </a>
                    ) : (
                      <div className="w-full bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl text-center font-medium flex items-center justify-center gap-2 text-xs sm:text-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Link Unavailable</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}