'use client';

import { useState, useEffect } from 'react';
import { catalogAPI } from '../services/api';

export function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await catalogAPI.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch product details');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const refresh = () => {
    fetchProduct();
  };

  const clearError = () => setError(null);

  return {
    product,
    loading,
    error,
    refresh,
    clearError,
  };
}
