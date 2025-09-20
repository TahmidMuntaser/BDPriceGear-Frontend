'use client';

import { useState } from 'react';
import { priceComparisonAPI } from '../services/api';

export function useProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name to search');
      return;
    }

    // console.log('Starting search for:', searchTerm);
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // console.log('Calling priceComparisonAPI.searchProducts...');
      const data = await priceComparisonAPI.searchProducts(searchTerm);
      
      // console.log('Search completed successfully:', {
      //   dataReceived: !!data,
      //   dataType: typeof data,
      //   isArray: Array.isArray(data),
      //   dataLength: Array.isArray(data) ? data.length : 'Not an array',
      //   dataKeys: data ? Object.keys(data) : [],
      //   hasShops: !!data?.shops,
      // });

      // Handle different response formats
      let shopsData = [];
      if (Array.isArray(data)) {
        // directly an array of shops
        shopsData = data;
      } else if (data?.shops && Array.isArray(data.shops)) {
        // a shops property
        shopsData = data.shops;
      } else if (data) {
        //  a single shop object
        shopsData = [data];
      }

      // console.log('🏪 Processed shops data:', {
      //   shopsCount: shopsData.length,
      //   shops: shopsData.map(shop => ({
      //     name: shop.name,
      //     productCount: shop.products?.length || 0
      //   }))
      // });

      setResults(shopsData);
      setCurrentPage(1); // Reset to first page on new search
      
      if (shopsData.length === 0) {
        setError('No products found for your search. Try a different search term.');
      }
    } catch (err) {
      // console.error(' Search failed:', err);
      setError(err.message || 'Failed to fetch price data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Get all products from all stores with pagination
  const allProducts = results.flatMap(shop => 
    shop.products?.map(product => ({
      ...product,
      storeName: shop.name
    })) || []
  );

  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  return {
    // State
    searchTerm,
    results,
    loading,
    error,
    currentPage,
    productsPerPage,
    
    // Computed values
    allProducts,
    currentProducts,
    totalProducts,
    totalPages,
    
    // Actions
    setSearchTerm,
    setCurrentPage,
    handleSearch,
    clearError
  };
}
