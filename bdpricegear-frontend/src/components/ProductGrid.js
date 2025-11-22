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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover/card:opacity-20 transition duration-300"></div>
        <div className="relative">
          {/* Store Badge */}
          {productStore && (
            <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2 z-10">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-lg truncate max-w-20 sm:max-w-none">
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
          <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs sm:text-sm leading-tight line-clamp-2 group-hover/card:text-blue-300 transition-colors">
            {productName}
          </h4>
          
          {/* Category Badge */}
          {productCategory && (
            <span className="inline-block text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full mb-2">
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

    const className = "group/card relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl min-w-0 block cursor-pointer";

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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
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
            className="relative bg-gray-900 border border-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Image */}
                <div className="relative">
                  {(selectedProduct.image_url || selectedProduct.img) && (
                    <Image
                      src={selectedProduct.image_url || selectedProduct.img}
                      alt={selectedProduct.name}
                      width={600}
                      height={600}
                      className="w-full h-auto rounded-2xl"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  )}
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {selectedProduct.name}
                  </h2>

                  <div className="space-y-4 mb-6">
                    {(selectedProduct.shop_name || selectedProduct.storeName) && (
                      <div>
                        <span className="text-sm text-gray-400">Store:</span>
                        <p className="text-lg text-white font-medium">{selectedProduct.shop_name || selectedProduct.storeName}</p>
                      </div>
                    )}

                    {(selectedProduct.category_name || selectedProduct.category) && (
                      <div>
                        <span className="text-sm text-gray-400">Category:</span>
                        <p className="text-lg text-white">{selectedProduct.category_name || selectedProduct.category}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-gray-400">Price:</span>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
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
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      View on Store Website
                    </a>
                  )}

                  {!(selectedProduct.link || selectedProduct.product_url || selectedProduct.url) && (
                    <div className="block w-full bg-red-600/20 border border-red-500/30 text-red-300 px-6 py-3 rounded-xl text-center text-sm">
                      ⚠️ No store URL available for this product
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
