'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { authAPI, wishlistAPI } from '../services/api';

const extractWishlistProductId = (item) => {
  return (
    item?.product?.id ??
    item?.product_id ??
    item?.id ??
    item?.product
  );
};

export function useWishlist({ enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      return [];
    }

    if (!authAPI.isAuthenticated()) {
      setItems([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await wishlistAPI.getWishlist();
      setItems(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load wishlist');
      setItems([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const addItem = useCallback(async (productId) => {
    if (!authAPI.isAuthenticated()) {
      throw new Error('Please login to add products to wishlist.');
    }

    setIsMutating(true);
    setError(null);

    try {
      await wishlistAPI.addToWishlist(productId);
      await refresh();
    } catch (err) {
      setError(err.message || 'Failed to add item to wishlist');
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, [refresh]);

  const removeItem = useCallback(async (productId) => {
    if (!authAPI.isAuthenticated()) {
      throw new Error('Please login to remove products from wishlist.');
    }

    setIsMutating(true);
    setError(null);

    try {
      await wishlistAPI.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => String(extractWishlistProductId(item)) !== String(productId)));
    } catch (err) {
      setError(err.message || 'Failed to remove item from wishlist');
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const count = useMemo(() => items.length, [items]);

  const hasProduct = useCallback((productId) => {
    return items.some((item) => String(extractWishlistProductId(item)) === String(productId));
  }, [items]);

  return {
    items,
    count,
    loading,
    isMutating,
    error,
    refresh,
    addItem,
    removeItem,
    hasProduct,
  };
}
