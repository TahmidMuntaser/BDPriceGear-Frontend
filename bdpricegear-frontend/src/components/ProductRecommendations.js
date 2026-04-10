'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ProductRecommendations({
  recommendations = [],
  isLoading = false,
  error = '',
}) {
  const hasRecommendations = recommendations.length > 0;
  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    progress: 0,
  });

  const getDifferenceText = (priceDifference, priceLabel) => {
    if (priceLabel) return priceLabel;

    const numericDiff = Number(priceDifference);
    if (!Number.isFinite(numericDiff)) return 'Price updated';
    if (numericDiff < 0) return `Save ${Math.abs(numericDiff).toLocaleString('en-BD')} BDT`;
    if (numericDiff > 0) return `+${numericDiff.toLocaleString('en-BD')} BDT`;
    return 'Same price';
  };

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = Math.max(scrollWidth - clientWidth, 0);
    const progress = maxScroll === 0 ? 100 : Math.min((scrollLeft / maxScroll) * 100, 100);

    setScrollState({
      canScrollLeft: scrollLeft > 8,
      canScrollRight: scrollLeft < maxScroll - 8,
      progress,
    });
  };

  const scrollByCards = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const amount = Math.max(container.clientWidth * 0.75, 220);
    container.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    updateScrollState();
    const container = scrollContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [recommendations, isLoading]);


  return (
    <div className="mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.82),rgba(15,23,42,0.62))] p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-10 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" />
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
              Best Alternatives
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
            Ranked options close to this product.
          </p>
        </div>
        {hasRecommendations && !isLoading && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-100">
              {recommendations.length} options
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollByCards('prev')}
                disabled={!scrollState.canScrollLeft}
                className="w-7 h-7 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                aria-label="Scroll alternatives left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCards('next')}
                disabled={!scrollState.canScrollRight}
                className="w-7 h-7 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                aria-label="Scroll alternatives right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="no-scrollbar grid grid-flow-col auto-cols-[200px] sm:auto-cols-[240px] gap-3 overflow-x-auto pb-2 pr-2 snap-x snap-mandatory">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`recommendation-skeleton-${index}`}
              className="bg-white/[0.06] border border-white/10 rounded-xl p-3 animate-pulse"
            >
              <div className="h-28 sm:h-32 bg-white/10 rounded-lg mb-3" />
              <div className="h-3 bg-white/10 rounded mb-2" />
              <div className="h-3 bg-white/10 rounded w-4/5 mb-3" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && !hasRecommendations && (
        <div className="bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm">
          No alternatives available for this product yet.
        </div>
      )}

      {!isLoading && !error && hasRecommendations && (
        <div className="relative">
          {scrollState.canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-8 z-20 bg-gradient-to-r from-slate-950/90 to-transparent rounded-l-xl" />
          )}
          {scrollState.canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 z-20 bg-gradient-to-l from-slate-950/90 to-transparent rounded-r-xl" />
          )}

          <div
            ref={scrollContainerRef}
            onScroll={updateScrollState}
            className="no-scrollbar grid grid-flow-col auto-cols-[200px] sm:auto-cols-[240px] gap-3 overflow-x-auto pb-2 pr-2 snap-x snap-mandatory"
          >
            {recommendations.map((item, index) => {
            const isSaving =
              String(item.price_label || '').toLowerCase().includes('save') ||
              String(item.price_difference || '').startsWith('-');
            const differenceText = getDifferenceText(item.price_difference, item.price_label);

            return (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group snap-start relative overflow-hidden bg-white/[0.06] border border-white/10 hover:border-emerald-400/60 rounded-xl p-3 transition-all duration-300 hover:bg-white/[0.10] hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs text-slate-300">#{index + 1} Alternative</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    isSaving
                      ? 'text-emerald-200 border-emerald-500/40 bg-emerald-500/10'
                      : 'text-amber-200 border-amber-500/40 bg-amber-500/10'
                  }`}>
                    {isSaving ? 'Better price' : 'Slightly higher'}
                  </span>
                </div>

                {item.image && (
                  <div className="relative z-10 mb-2 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={240}
                      height={160}
                      className="w-full h-28 sm:h-32 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      unoptimized
                    />
                  </div>
                )}

                <h4 className="relative z-10 text-xs sm:text-sm text-white font-medium leading-[1.25rem] sm:leading-[1.35rem] line-clamp-2 h-[2.5rem] sm:h-[2.7rem]">
                  {item.name}
                </h4>

                {item.brand && (
                  <p className="relative z-10 text-[11px] text-gray-400 mt-1">{item.brand}</p>
                )}

                <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
                  <p className="text-sm sm:text-base font-semibold text-emerald-300">
                    BDT {Number(item.price || 0).toLocaleString('en-BD')}
                  </p>
                  <svg
                    className="w-4 h-4 text-cyan-300/70 group-hover:text-cyan-200 group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <span
                  className={`relative z-10 inline-flex items-center mt-2 text-[11px] px-2 py-1 rounded-full border ${
                    isSaving
                      ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
                      : 'text-amber-300 border-amber-500/40 bg-amber-500/10'
                  }`}
                >
                  {differenceText}
                </span>
              </Link>
            );
          })}
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-center text-[10px] sm:text-xs text-slate-300 mb-1.5">
              <span className="tabular-nums min-w-[3ch] text-center">{Math.round(scrollState.progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-[width] duration-200"
                style={{ width: `${Math.max(scrollState.progress, 8)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

      `}</style>
    </div>
  );
}
