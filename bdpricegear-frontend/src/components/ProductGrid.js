'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductGrid({ products, showModal = false }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">😔</span>
        </div>
        <p className="text-gray-400">No products available</p>
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
    const productUrl = product.link || product.product_url || product.url; // Handle link, product_url, and url
    const productCategory = product.category_name || product.category;
    
    const content = (
      <>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-0 group-hover/card:opacity-20 transition duration-300"></div>
        <div className="relative">
          {/* Store Badge */}
          {productStore && (
            <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2 z-10">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-lg truncate max-w-20 sm:max-w-none">
                {productStore}
              </span>
            </div>
          )}
          
          {productImage && (
            <div className="mb-3 md:mb-4 overflow-hidden rounded-xl">
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
          <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs sm:text-sm leading-tight line-clamp-2 group-hover/card:text-emerald-300 transition-colors">
            {productName}
          </h4>
          
          {/* Category Badge */}
          {productCategory && (
            <span className="inline-block text-xs bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded-full mb-2">
              {productCategory}
            </span>
          )}
          
          <div className="flex items-center justify-between mt-3 md:mt-4">
            <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ৳{(typeof productPrice === 'string' ? parseFloat(productPrice) : productPrice)?.toLocaleString('en-BD') || 'N/A'}
            </p>
          </div>
        </div>
      </>
    );

    const className = "group/card relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/30 hover:border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl min-w-0 block cursor-pointer";

    if (showModal || !productId) {
      // For search results (no product ID), show modal or external link
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
      // For catalog products (has product ID), link to detail page
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
        <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {products.map(renderProduct)}
          </div>
        </div>
        
        <style jsx>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp-2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative bg-gray-900 border border-emerald-500/20 rounded-2xl max-w-3xl w-full shadow-2xl shadow-emerald-950/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-20"></div>
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-800/80 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500/50 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-5 h-5 text-gray-300 hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative">
                  {(selectedProduct.image_url || selectedProduct.img) && (
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <Image
                        src={selectedProduct.image_url || selectedProduct.img}
                        alt={selectedProduct.name}
                        width={600}
                        height={600}
                        className="relative w-full h-auto object-contain rounded-xl border border-gray-700/50 bg-gray-800/30"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
                    {selectedProduct.name}
                  </h2>

                  <div className="space-y-4 mb-6 flex-grow">
                    {(selectedProduct.shop_name || selectedProduct.storeName) && (
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                        <span className="text-sm text-gray-400">Store</span>
                        <p className="text-lg text-white font-medium mt-1">{selectedProduct.shop_name || selectedProduct.storeName}</p>
                      </div>
                    )}

                    {(selectedProduct.category_name || selectedProduct.category) && (
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                        <span className="text-sm text-gray-400">Category</span>
                        <p className="text-lg text-emerald-300 mt-1">{selectedProduct.category_name || selectedProduct.category}</p>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-5">
                      <span className="text-sm text-gray-400">Price</span>
                      <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-1">
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
                      className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg text-center text-base font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-900/50"
                    >
                      View on Store Website
                    </a>
                  )}

                  {!(selectedProduct.link || selectedProduct.product_url || selectedProduct.url) && (
                    <div className="block w-full bg-red-600/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center text-sm">
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
