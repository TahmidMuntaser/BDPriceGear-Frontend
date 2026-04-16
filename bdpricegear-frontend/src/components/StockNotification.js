'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2, LogIn } from 'lucide-react';
import { stockNotificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STOCK_NOTIFICATION_CACHE_KEY = 'stockNotificationSubscriptions';

export const getProductStockInfo = (product) => {
  const rawStatus = (
    product?.stock_status ||
    product?.stock_message ||
    product?.availability ||
    product?.status ||
    ''
  )
    .toString()
    .trim();

  if (rawStatus) {
    const normalized = rawStatus.toLowerCase();
    const isOutOfStock =
      normalized.includes('out of stock') ||
      normalized.includes('out-of-stock') ||
      normalized.includes('out_of_stock') ||
      normalized.includes('not available') ||
      normalized.includes('unavailable') ||
      normalized.includes('sold out');

    return {
      isInStock: !isOutOfStock,
      label: isOutOfStock ? 'Out of Stock' : 'In Stock',
    };
  }

  if (typeof product?.in_stock === 'boolean') {
    return {
      isInStock: product.in_stock,
      label: product.in_stock ? 'In Stock' : 'Out of Stock',
    };
  }

  if (typeof product?.is_in_stock === 'boolean') {
    return {
      isInStock: product.is_in_stock,
      label: product.is_in_stock ? 'In Stock' : 'Out of Stock',
    };
  }

  const rawPrice = product?.current_price ?? product?.price;
  const parsedPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);

  if (Number.isFinite(parsedPrice) && parsedPrice > 0) {
    return {
      isInStock: true,
      label: 'In Stock',
    };
  }

  return {
    isInStock: false,
    label: 'Out of Stock',
  };
};

const getInitialSubscribedState = (product) => {
  return Boolean(
    product?.stock_notification_subscribed ||
    product?.is_stock_notification_subscribed ||
    product?.subscribed_to_stock_notification ||
    product?.stockNotificationSubscribed
  );
};

const getUserCacheKey = (user) => {
  return user?.id || user?.pk || user?.email || user?.username || null;
};

const getSubscriptionCacheStorageKey = (userKey) => {
  return userKey ? `${STOCK_NOTIFICATION_CACHE_KEY}:${String(userKey)}` : null;
};

const getCachedSubscriptions = (userKey) => {
  if (typeof window === 'undefined') {
    return {};
  }

  const storageKey = getSubscriptionCacheStorageKey(userKey);
  if (!storageKey) {
    return {};
  }

  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const getCachedSubscribedState = (userKey, productId) => {
  if (!userKey || !productId) {
    return null;
  }

  const cache = getCachedSubscriptions(userKey);
  const key = String(productId);

  if (Object.prototype.hasOwnProperty.call(cache, key)) {
    return Boolean(cache[key]);
  }

  return null;
};

const setCachedSubscribedState = (userKey, productId, subscribed) => {
  if (typeof window === 'undefined' || !userKey || !productId) {
    return;
  }

  try {
    const storageKey = getSubscriptionCacheStorageKey(userKey);
    if (!storageKey) {
      return;
    }

    const cache = getCachedSubscriptions(userKey);
    cache[String(productId)] = Boolean(subscribed);
    localStorage.setItem(storageKey, JSON.stringify(cache));
  } catch {
    // Ignore storage errors; UI state still updates in-memory.
  }
};

const isAlreadySubscribedError = (message = '') => {
  const normalized = message.toLowerCase();
  return normalized.includes('already') && normalized.includes('subscrib');
};

const isNotSubscribedError = (message = '') => {
  const normalized = message.toLowerCase();
  return (
    (normalized.includes('not') && normalized.includes('subscrib')) ||
    normalized.includes('does not exist')
  );
};

export default function StockNotification({ product, className = '' }) {
  const { isLoggedIn, openLoginModal, user } = useAuth();
  const userKey = getUserCacheKey(user);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    const cached = getCachedSubscribedState(userKey, product?.id);
    if (cached !== null) {
      return cached;
    }
    return getInitialSubscribedState(product);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const productId = product?.id;
  const stockInfo = getProductStockInfo(product);

  useEffect(() => {
    const cached = getCachedSubscribedState(userKey, product?.id);
    setIsSubscribed(cached !== null ? cached : getInitialSubscribedState(product));
    setIsSubmitting(false);
    setFeedback(null);
  }, [userKey, product?.id, product?.stock_notification_subscribed, product?.is_stock_notification_subscribed, product?.subscribed_to_stock_notification, product?.stockNotificationSubscribed]);

  if (!productId || stockInfo.isInStock) {
    return null;
  }

  const handleToggleSubscription = async () => {
    if (!isLoggedIn) {
      setFeedback({ type: 'error', message: 'Please log in to receive stock notifications.' });
      openLoginModal();
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (isSubscribed) {
        await stockNotificationAPI.unsubscribe(productId);
        setIsSubscribed(false);
        setCachedSubscribedState(userKey, productId, false);
        setFeedback({ type: 'success', message: 'You will no longer receive alerts for this product.' });
      } else {
        await stockNotificationAPI.subscribe(productId);
        setIsSubscribed(true);
        setCachedSubscribedState(userKey, productId, true);
        setFeedback({ type: 'success', message: 'You will be notified when this product is back in stock.' });
      }
    } catch (error) {
      const errorMessage = error.message || 'Stock notification update failed. Please try again.';
      const errorStatus = error?.status;

      if (!isSubscribed && (isAlreadySubscribedError(errorMessage) || errorStatus === 400)) {
        setIsSubscribed(true);
        setCachedSubscribedState(userKey, productId, true);
        setFeedback({ type: 'success', message: 'You are already subscribed for this product.' });
        return;
      }

      if (isSubscribed && (isNotSubscribedError(errorMessage) || errorStatus === 400)) {
        setIsSubscribed(false);
        setCachedSubscribedState(userKey, productId, false);
        setFeedback({ type: 'success', message: 'You are already unsubscribed for this product.' });
        return;
      }

      setFeedback({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel = isSubmitting
    ? (isSubscribed ? 'Unsubscribing...' : 'Subscribing...')
    : (isSubscribed ? 'Unsubscribe' : 'Notify me when back in stock');

  const buttonIcon = isSubmitting ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : isSubscribed ? (
    <BellOff className="h-4 w-4" />
  ) : (
    <Bell className="h-4 w-4" />
  );

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${
          isSubscribed
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
        }`}>
          {isSubscribed ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-white">
                {isSubscribed ? 'Stock alert enabled' : 'Notify me when back in stock'}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                We’ll send a notification when this product returns.
              </p>
            </div>

            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${
              isSubscribed
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
            }`}>
              {isSubscribed ? 'Subscribed' : 'Out of stock'}
            </span>
          </div>

          {!isLoggedIn ? (
            <div className="mt-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-300">Log in to get stock alerts for this product.</p>
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/20"
              >
                <LogIn className="h-4 w-4" />
                Log in to get notified
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleToggleSubscription}
                  disabled={isSubmitting}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${
                    isSubscribed
                      ? 'border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20'
                      : 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'
                  }`}
                >
                  {buttonIcon}
                  {buttonLabel}
                </button>
              </div>

              {feedback && (
                <p
                  className={`mt-3 text-sm ${
                    feedback.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                  aria-live="polite"
                >
                  {feedback.message}
                </p>
              )}

              {!feedback && isSubscribed && (
                <p className="mt-3 text-sm text-emerald-300" aria-live="polite">
                  You will be notified when this product is back in stock.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}