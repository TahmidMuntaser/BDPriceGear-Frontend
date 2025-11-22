'use client';

import { useState, useEffect } from 'react';
import { catalogAPI } from '../services/api';

export function useProducts(initialPage = 1, initialPageSize = 21, filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchProducts = async (page = currentPage, size = pageSize, currentFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      // Backend returns max 20 items, so we need to fetch multiple pages if size > 20
      const backendPageSize = 20;
      const needsMultiplePages = size > backendPageSize;
      
      if (needsMultiplePages) {
        // Calculate which backend pages we need
        // For frontend page 1 with size 21: fetch backend pages 1 & 2
        // For frontend page 2 with size 21: fetch backend pages 3 & 4, etc.
        const itemsPerFrontendPage = size;
        const startItem = (page - 1) * itemsPerFrontendPage;
        const endItem = startItem + itemsPerFrontendPage;
        
        const startBackendPage = Math.floor(startItem / backendPageSize) + 1;
        const endBackendPage = Math.ceil(endItem / backendPageSize);
        
        // Fetch all needed backend pages
        const promises = [];
        for (let i = startBackendPage; i <= endBackendPage; i++) {
          console.log(`Fetching backend page ${i} with filters:`, currentFilters);
          promises.push(
            catalogAPI.getProducts(i, backendPageSize, currentFilters).catch(err => {
              // Handle 404 for pages that don't exist (not enough products)
              if (err.message && err.message.includes('404')) {
                console.log(`Page ${i} doesn't exist (not enough products)`);
                return { results: [], count: 0 };
              }
              throw err;
            })
          );
        }
        
        const results = await Promise.all(promises);
        console.log(`Fetched ${results.length} backend pages, total products:`, results.reduce((sum, r) => sum + (r.results?.length || 0), 0));
        
        // Combine all results
        let allProducts = [];
        let totalCountFromApi = 0;
        
        results.forEach(data => {
          if (data.results) {
            allProducts = allProducts.concat(data.results);
            totalCountFromApi = data.count || totalCountFromApi;
          }
        });
        
        // Slice to get exactly the items we need for this frontend page
        const startIndex = startItem % backendPageSize;
        const slicedProducts = allProducts.slice(startIndex, startIndex + itemsPerFrontendPage);
        
        setProducts(slicedProducts);
        setTotalCount(totalCountFromApi);
        const calculatedTotalPages = Math.ceil(totalCountFromApi / size);
        setTotalPages(calculatedTotalPages);
        setHasNext(page < calculatedTotalPages);
        setHasPrevious(page > 1);
        
      } else {
        // Standard single page fetch
        const data = await catalogAPI.getProducts(page, size, currentFilters);
        
        // Handle paginated response
        if (data.results) {
          setProducts(data.results);
          setTotalCount(data.count || 0);
          setHasNext(!!data.next);
          setHasPrevious(!!data.previous);
          setTotalPages(Math.ceil((data.count || 0) / size));
        } else if (Array.isArray(data)) {
          // Fallback for non-paginated response
          setProducts(data);
          setTotalCount(data.length);
          setTotalPages(1);
          setHasNext(false);
          setHasPrevious(false);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching products with:', { currentPage, pageSize, filters });
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters.category, filters.shop]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.shop]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const refresh = () => {
    fetchProducts(currentPage, pageSize);
  };

  const clearError = () => setError(null);

  return {
    products,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNext,
    hasPrevious,
    setPageSize,
    goToPage,
    nextPage,
    previousPage,
    refresh,
    clearError,
  };
}
