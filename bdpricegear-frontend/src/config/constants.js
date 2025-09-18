export const API_CONFIG = {
    USE_PROXY: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
    // true -> use Next.js API routes as proxy (for CORS issues)
    // false -> call backend API directly
};

export const API_ENDPOINTS = {
    PRICE_COMPARISON: API_CONFIG.USE_PROXY 
    ? '/api/price-comparison'
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/price-comparison/`,
};