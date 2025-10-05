'0use client';

export default function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(count)].map((_, i) => (
            <div 
              key={i}
              className="group/card relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700/30 min-w-0 animate-pulse"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0"></div>
              <div className="relative">
                {/* Store Badge Skeleton */}
                <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2 z-10">
                  <div className="bg-gray-700 h-5 w-16 sm:w-20 rounded-full"></div>
                </div>
                
                {/* Image Skeleton */}
                <div className="mb-3 md:mb-4 overflow-hidden rounded-xl">
                  <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-700 rounded-xl"></div>
                </div>
                
                {/* Title Skeleton */}
                <div className="mb-2 md:mb-3 space-y-1">
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
                
                {/* Price Skeleton */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="h-5 sm:h-6 md:h-8 bg-gray-700 rounded w-20 sm:w-24"></div>
                </div>
                
                {/* Button Skeleton */}
                <div className="w-full h-8 sm:h-10 bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}