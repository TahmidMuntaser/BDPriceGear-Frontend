'use client';

import { useState, useEffect } from 'react';
import { catalogAPI } from '../services/api';

export function useShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShops = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching shops from API...');
      const data = await catalogAPI.getShops();
      console.log('Shops API Response:', data);
      // Handle paginated response - extract results array
      const shopsArray = data.results || data;
      console.log('Extracted shops array:', shopsArray);
      console.log('Is Array?', Array.isArray(shopsArray));
      setShops(Array.isArray(shopsArray) ? shopsArray : []);
    } catch (err) {
      console.error('Shops fetch error:', err);
      setError(err.message || 'Failed to fetch shops');
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const refresh = () => {
    fetchShops();
  };

  const clearError = () => setError(null);

  return {
    shops,
    loading,
    error,
    refresh,
    clearError,
  };
}

export function useShopDetail(slug) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopDetail = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);

      try {
        const data = await catalogAPI.getShopById(slug);
        setShop(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch shop details');
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetail();
  }, [slug]);

  const refresh = () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);

    catalogAPI.getShopById(slug)
      .then(data => {
        setShop(data);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch shop details');
        setShop(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearError = () => setError(null);

  return {
    shop,
    loading,
    error,
    refresh,
    clearError,
  };
}
