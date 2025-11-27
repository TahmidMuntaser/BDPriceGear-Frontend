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
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
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

      {/* Modal with Glassmorphism */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl max-w-3xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl blur-2xl opacity-50"></div>
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-emerald-400/50 rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <svg className="w-5 h-5 text-white/80 group-hover:text-emerald-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Image */}
                <div className="relative">
                  {(selectedProduct.image_url || selectedProduct.img) && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition duration-300"></div>
                      <Image
                        src={selectedProduct.image_url || selectedProduct.img}
                        alt={selectedProduct.name}
                        width={600}
                        height={600}
                        className="relative w-full h-auto object-contain rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                    {selectedProduct.name}
                  </h2>

                  <div className="space-y-4 mb-6 flex-grow">
                    {(selectedProduct.shop_name || selectedProduct.storeName) && (
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
                        <span className="text-sm text-gray-300">Store</span>
                        <p className="text-lg text-white font-medium mt-1">{selectedProduct.shop_name || selectedProduct.storeName}</p>
                      </div>
                    )}

                    {(selectedProduct.category_name || selectedProduct.category) && (
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
                        <span className="text-sm text-gray-300">Category</span>
                        <p className="text-lg text-emerald-300 mt-1">{selectedProduct.category_name || selectedProduct.category}</p>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-md border border-emerald-400/30 rounded-lg p-5">
                      <span className="text-sm text-gray-300">Price</span>
                      <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-1 drop-shadow-lg">
                        ৳{(typeof (selectedProduct.current_price || selectedProduct.price) === 'string' 
                          ? parseFloat(selectedProduct.current_price || selectedProduct.price) 
                          : (selectedProduct.current_price || selectedProduct.price))?.toLocaleString('en-BD') || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {(selectedProduct.link || selectedProduct.product_url || selectedProduct.url) && (
                    <a
                      href={selectedProduct.link || selectedProduct.product_url || selectedProduct.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg text-center text-base font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-400/20"
                    >
                      View on Store Website
                    </a>
                  )}

                  {!(selectedProduct.link || selectedProduct.product_url || selectedProduct.url) && (
                    <div className="block w-full bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-lg text-center text-sm">
                      ⚠️ No store URL available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}