'use client';

import { useState, useEffect } from 'react';
import { catalogAPI } from '../services/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching categories from API...');
      const data = await catalogAPI.getCategories();
      console.log('Categories API Response:', data);
      // Handle paginated response - extract results array
      const categoriesArray = data.results || data;
      console.log('Extracted categories array:', categoriesArray);
      console.log('Is Array?', Array.isArray(categoriesArray));
      setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
    } catch (err) {
      console.error('Categories fetch error:', err);
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refresh = () => {
    fetchCategories();
  };

  const clearError = () => setError(null);

  return {
    categories,
    loading,
    error,
    refresh,
    clearError,
  };
}

export function useCategoryDetail(slug) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);

      try {
        const data = await catalogAPI.getCategoryById(slug);
        setCategory(data);
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch category details');
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [slug]);

  const refresh = () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);

    catalogAPI.getCategoryById(slug)
      .then(data => {
        setCategory(data);
        setProducts(data.products || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch category details');
        setCategory(null);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearError = () => setError(null);

  return {
    category,
    products,
    loading,
    error,
    refresh,
    clearError,
  };
}
