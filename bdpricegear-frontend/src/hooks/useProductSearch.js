'use client';

import { useState } from 'react';
import axios from 'axios';

export function useProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [responseTime, setResponseTime] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name to search');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    
    const startTime = performance.now();

    try {
      // Use the catalog API endpoint
      const response = await axios.get(`/api/products/?product=${encodeURIComponent(searchTerm)}`);
      const data = response.data;
      
      // Handle the products response from catalog
      let productsData = [];
      if (Array.isArray(data)) {
        productsData = data;
      } else if (data?.results && Array.isArray(data.results)) {
        productsData = data.results;
      } else if (data?.products && Array.isArray(data.products)) {
        productsData = data.products;
      }

      setResults(productsData);
      setCurrentPage(1); // Reset to first page on new search
      
      if (productsData.length === 0) {
        setError('No products found for your search. Try a different search term.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products. Please try again.');
    } finally {
      const endTime = performance.now();
      const timeTaken = (endTime - startTime) / 1000; // Convert ms to seconds
      setResponseTime(timeTaken);
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Products are now directly in results array
  const allProducts = results;

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
    clearError,
    
    // Response metrics
    responseTime
  };
}
