import axios from 'axios';
import {API_ENDPOINTS, API_CONFIG} from '../config/constants';

// Simple retry helper for network and server errors
const retryRequest = async (fn, retries = 2, delay = 1000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === retries;
      const shouldRetry = 
        error.code === 'ECONNABORTED' || // timeout
        error.code === 'ERR_NETWORK' || // network error
        !error.response || // no response
        (error.response?.status >= 500); // server error
      
      if (!shouldRetry || isLastAttempt) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Token management utilities
const TOKEN_STORAGE_KEY = 'authToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const USER_STORAGE_KEY = 'user';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }
  return null;
};

const setTokens = (accessToken, refreshToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
  }
};

const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

// create axios instance 
const apiClient = axios.create({
    timeout: 45000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false, //not necessary for public API
});

// add req interceptor 
apiClient.interceptors.request.use(
  (config) => {
    // Only add auth token to protected endpoints (auth-related routes)
    const protectedEndpoints = ['/auth/profile', '/auth/logout', '/auth/refresh'];
    const isProtectedEndpoint = protectedEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (isProtectedEndpoint) {
      const token = getAccessToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// add response interceptor 
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt token refresh for protected endpoints
    const protectedEndpoints = ['/auth/profile', '/auth/logout', '/auth/refresh'];
    const isProtectedEndpoint = protectedEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
    
    // Handle 401 errors and attempt token refresh ONLY for protected endpoints
    if (error.response?.status === 401 && !originalRequest._retry && isProtectedEndpoint) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        clearTokens();
        isRefreshing = false;
        // Trigger logout event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(API_ENDPOINTS.AUTH_REFRESH, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        setTokens(access, refreshToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        processQueue(null, access);
        isRefreshing = false;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        clearTokens();
        
        // Trigger logout event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);




// Authentication APIs
export const authAPI = {
  // Register new user
  signup: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_SIGNUP, userData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw new Error('Cannot connect to server. Please check your connection.');
      }
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          throw new Error(errorData.non_field_errors.join(', '));
        }
        
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
        
        if (typeof errorData === 'object') {
          const errors = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errors.push(...messages);
            } else if (typeof messages === 'string') {
              errors.push(messages);
            }
          }
          if (errors.length > 0) {
            throw new Error(errors.join('. '));
          }
        }
      }
      
      throw new Error('Signup failed. Please try again.');
    }
  },

  // Login and get JWT tokens
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
      const responseData = response.data;
      
      if (!responseData) {
        throw new Error('Server returned empty response');
      }
      
      // Flexible handling of different response formats
      const access = responseData.access || 
                     responseData.token || 
                     responseData.access_token || 
                     responseData.accessToken ||
                     responseData.jwt ||
                     responseData.auth_token;
                     
      const refresh = responseData.refresh || 
                      responseData.refresh_token || 
                      responseData.refreshToken;
                      
      const user = responseData.user || 
                   responseData.data || 
                   responseData.profile ||
                   { email: credentials.email };
      
      if (!access) {
        // If response is a string token
        if (typeof responseData === 'string') {
          setTokens(responseData, null);
          if (typeof window !== 'undefined') {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ email: credentials.email }));
          }
          return { access: responseData, refresh: null, user: { email: credentials.email } };
        }
        
        // Create fallback for non-standard responses
        const fallbackToken = 'logged-in-' + Date.now();
        setTokens(fallbackToken, null);
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ email: credentials.email, ...responseData }));
        }
        return { access: fallbackToken, refresh: null, user: { email: credentials.email, ...responseData } };
      }
      
      // Store tokens and user data
      setTokens(access, refresh);
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
      
      return { access, refresh, user };
    } catch (error) {
      if (!error.response) {
        if (error.request) {
          throw new Error('Cannot connect to server. Please check your connection.');
        }
        throw new Error('Request failed: ' + error.message);
      }
      
      if (error.response?.status === 401 || error.response?.status === 400) {
        throw new Error('Invalid email or password');
      }
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          throw new Error(errorData.non_field_errors.join(', '));
        }
        
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
        
        if (typeof errorData === 'object') {
          const errors = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errors.push(...messages);
            } else if (typeof messages === 'string') {
              errors.push(messages);
            }
          }
          if (errors.length > 0) {
            throw new Error(errors.join('. '));
          }
        }
      }
      
      throw new Error('Login failed. Please try again.');
    }
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_REFRESH, {
        refresh: refreshToken
      });
      const { access } = response.data;
      setTokens(access, refreshToken);
      return response.data;
    } catch (error) {
      clearTokens();
      throw new Error('Session expired. Please login again.');
    }
  },

  // Logout and blacklist token
  logout: async () => {
    const refreshToken = getRefreshToken();
    
    try {
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT, {
          refresh: refreshToken
        });
      }
    } catch (error) {
      // Continue with local logout even if API call fails
    } finally {
      clearTokens();
    }
  },

  // Get user profile (protected)
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_PROFILE);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        clearTokens();
        throw new Error('Unauthorized. Please login again.');
      }
      throw new Error('Failed to fetch profile. Please try again.');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAccessToken();
  },

  // Get stored user data
  getStoredUser: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },
};

export const priceComparisonAPI = {
  searchProducts: async (productName) => {
    // Build the URL - remove trailing slash if present before adding query params
    const endpoint = API_ENDPOINTS.PRICE_COMPARISON.replace(/\/$/, '');
    const url = `${endpoint}/?product=${encodeURIComponent(productName)}`;
    
    const makeRequest = async () => {
      try {
        const requestConfig = {
          method: 'GET',
          url: url,
          timeout: 65000, // 65 seconds for slow render.com
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BDPriceGear-Frontend/1.0',
          },
        };

        const response = await apiClient(requestConfig);
        
        return response.data;
      } 

      catch (error) {
        //diff types of errors
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. The backend server might be sleeping and taking longer to respond. Please try again.');
        }
        
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Network error occurred. Please check your internet connection and try again.');
        }
        
        if (error.code === 'ERR_CONNECTION_REFUSED') {
          throw new Error('Cannot connect to the server. The backend service might be temporarily unavailable.');
        }
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const errorData = error.response.data;
          
          if (status === 404) {
            throw new Error('API endpoint not found. Please check the backend service configuration.');
          } 
          else if (status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          } 
          else if (status >= 400 && status < 500) {
            throw new Error(`Request error (${status}): ${errorData?.message || error.response.statusText}. Please check your search term and try again.`);
          } 
          else if (status >= 500) {
            throw new Error(`Server error (${status}): The backend service is experiencing issues. Please try again later.`);
          }
        }
        
        // Generic error fallback
        throw new Error(`Unexpected error: ${error.message}. Please try again.`);
      }
    };
    
    try {
      return await makeRequest();
    } catch (error) {
      // Create a user-friendly error message
      let userMessage = 'Unable to fetch price comparison data. ';
      
      if (error.message.includes('timed out') || error.message.includes('timeout')) {
        userMessage += 'The request timed out. This often happens when the backend server is "sleeping" on free hosting services. Please try again in a few moments.';
      } 
      else if (error.message.includes('Network error') || error.message.includes('network')) {
        userMessage += 'There was a network connectivity issue. Please check your internet connection and try again.';
      } 
      else if (error.message.includes('Server error') || error.message.includes('server')) {
        userMessage += 'The backend server is experiencing issues. Please try again later.';
      } 
      else if (error.message.includes('Request error')) {
        userMessage += 'There was an issue with the request. Please try a different search term.';
      } 
      else {
        userMessage += error.message;
      }
      
      const friendlyError = new Error(userMessage);
      friendlyError.originalError = error;
      friendlyError.canRetry = true;
      throw friendlyError;

    }
  },
};

// Product Catalog APIs
export const catalogAPI = {
  // Get popular products (one from each category)
  getPopularProducts: async () => {
    const url = API_ENDPOINTS.POPULAR_PRODUCTS;
    
    const makeRequest = async () => {
      const response = await apiClient.get(url, { timeout: 10000 });
      return response.data;
    };
    
    try {
      return await retryRequest(makeRequest, 2, 1000);
    } catch (error) {
      throw new Error(`Failed to fetch popular products: ${error.message}`);
    }
  },

  // Get ALL products at once (full catalog)
  getAllProducts: async (filters = {}) => {
    let url = `${API_ENDPOINTS.PRODUCTS}?page_size=all`;
    
    // Add filter parameters - only if they have actual values
    if (filters.category && filters.category.trim() !== '') {
      url += `&category=${encodeURIComponent(filters.category)}`;
    }
    if (filters.shop && filters.shop.trim() !== '') {
      url += `&shop=${encodeURIComponent(filters.shop)}`;
    }
    
    const makeRequest = async () => {
      const response = await apiClient.get(url, { timeout: 90000 }); // 90 seconds for large dataset
      // Handle both paginated and non-paginated response formats
      if (response.data.results) {
        return response.data.results;
      }
      return response.data;
    };
    
    try {
      return await retryRequest(makeRequest, 2, 2000);
    } catch (error) {
      throw new Error(`Failed to fetch all products: ${error.message}`);
    }
  },

  // Get all products with pagination and filters
  getProducts: async (page = 1, pageSize = 50, filters = {}) => {
    let url = `${API_ENDPOINTS.PRODUCTS}?page=${page}&page_size=${pageSize}`;
    
    // Add filter parameters - only if they have actual values
    if (filters.category && filters.category.trim() !== '') {
      url += `&category=${encodeURIComponent(filters.category)}`;
    }
    if (filters.shop && filters.shop.trim() !== '') {
      url += `&shop=${encodeURIComponent(filters.shop)}`;
    }
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    try {
      return await retryRequest(makeRequest, 2, 1500);
    } catch (error) {
      // Handle 404 specifically - return empty results instead of throwing
      if (error.response?.status === 404 || error.message?.includes('404')) {
        return {
          results: [],
          count: 0,
          next: null,
          previous: null
        };
      }
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    const url = API_ENDPOINTS.PRODUCT_DETAIL(id);
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product details: ${error.message}`);
    }
  },

  // Get all categories
  getCategories: async () => {
    const url = API_ENDPOINTS.CATEGORIES;
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    try {
      return await retryRequest(makeRequest, 2, 1500);
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },

  // Get single category by slug with products
  getCategoryById: async (slug) => {
    const url = API_ENDPOINTS.CATEGORY_DETAIL(slug);
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(`Failed to fetch category details: ${error.message}`);
    }
  },

  // Get all shops
  getShops: async () => {
    const url = API_ENDPOINTS.SHOPS;
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    try {
      return await retryRequest(makeRequest, 2, 1500);
    } catch (error) {
      throw new Error(`Failed to fetch shops: ${error.message}`);
    }
  },

  // Get single shop by slug with details
  getShopById: async (slug) => {
    const url = API_ENDPOINTS.SHOP_DETAIL(slug);
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Shop not found');
      }
      throw new Error(`Failed to fetch shop details: ${error.message}`);
    }
  },
};

// Export the configured API client for other uses if needed
export { apiClient };

// Export token management utilities for advanced use cases
export { getAccessToken, getRefreshToken, setTokens, clearTokens };

// Legacy func
export const getPriceComparison = async (product) => {
  return priceComparisonAPI.searchProducts(product);
};

// Legacy apiRequest func
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await apiClient({
      url,
      method: options.method || 'GET',
      data: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.data;
  } 
  
  catch (error) {
    if (error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }

};
