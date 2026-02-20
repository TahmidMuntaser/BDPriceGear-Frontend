export const API_CONFIG = {
    USE_PROXY: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
    // true -> use Next.js API routes as proxy (for CORS issues)
    // false -> call backend API directly
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
    // Real-time price comparison
    PRICE_COMPARISON: API_CONFIG.USE_PROXY 
        ? '/api/price-comparison'
        : `${BASE_URL}/price-comparison/`,
    
    // Product Catalog endpoints
    PRODUCTS: `${BASE_URL}/products/`,
    PRODUCT_DETAIL: (id) => `${BASE_URL}/products/${id}/`,
    
    // Categories endpoints
    CATEGORIES: `${BASE_URL}/categories/`,
    CATEGORY_DETAIL: (slug) => `${BASE_URL}/categories/${slug}/`,
    
    // Shops endpoints
    SHOPS: `${BASE_URL}/shops/`,
    SHOP_DETAIL: (slug) => `${BASE_URL}/shops/${slug}/`,
    
    // Authentication endpoints
    AUTH_SIGNUP: `${BASE_URL}/auth/signup/`,
    AUTH_LOGIN: `${BASE_URL}/auth/login/`,
    AUTH_REFRESH: `${BASE_URL}/auth/refresh/`,
    AUTH_LOGOUT: `${BASE_URL}/auth/logout/`,
    AUTH_PROFILE: `${BASE_URL}/auth/profile/`,
};