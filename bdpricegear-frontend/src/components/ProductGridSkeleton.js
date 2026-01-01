'use client';

export default function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="relative group">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 transition duration-500"></div>
      
      {/* Main container with glassmorphism */}
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
          {[...Array(count)].map((_, i) => (
            <div 
              key={i}
              className="group/card relative bg-white/5 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 min-w-0 overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
              
              <div className="relative">
                {/* Store Badge Skeleton */}
                <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2 z-10">
                  <div className="bg-white/10 backdrop-blur-sm h-5 w-16 sm:w-20 rounded-full animate-pulse border border-white/10"></div>
                </div>
                
                {/* Image Skeleton */}
                <div className="mb-3 md:mb-4 overflow-hidden rounded-xl border border-white/10">
                  <div className="w-full h-32 sm:h-40 md:h-48 bg-white/5 backdrop-blur-sm rounded-xl animate-pulse"></div>
                </div>
                
                {/* Title Skeleton */}
                <div className="mb-2 md:mb-3 space-y-2">
                  <div className="h-3 sm:h-4 bg-white/10 backdrop-blur-sm rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-white/10 backdrop-blur-sm rounded w-1/2 animate-pulse"></div>
                </div>
                
                {/* Category Badge Skeleton */}
                <div className="mb-2">
                  <div className="inline-block h-6 w-16 bg-emerald-500/10 backdrop-blur-sm rounded-full animate-pulse border border-emerald-400/10"></div>
                </div>
                
                {/* Price Skeleton */}
                <div className="flex items-center justify-between mt-3 md:mt-4">
                  <div className="h-6 sm:h-7 md:h-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded w-24 sm:w-28 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}