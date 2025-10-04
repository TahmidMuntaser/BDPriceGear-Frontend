'use client';

export default function ProductGrid({ products }) {
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

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, productIndex) => (
            <div 
              key={`${product.storeName}-${product.id || productIndex}`}
              className="group/card relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl min-w-0"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover/card:opacity-20 transition duration-300"></div>
              <div className="relative">
                {/* Store Badge */}
                <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-lg truncate max-w-20 sm:max-w-none">
                    {product.storeName}
                  </span>
                </div>
                
                {product.img && (
                  <div className="mb-3 md:mb-4 overflow-hidden rounded-xl">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover transform transition-transform duration-500 group-hover/card:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs sm:text-sm leading-tight line-clamp-2 group-hover/card:text-blue-300 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ৳{product.price?.toLocaleString('en-BD') || 'N/A'}
                  </p>
                </div>
                {product.url && (
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    View Product
                  </a>
                )}
              </div>
            </div>
          ))}
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