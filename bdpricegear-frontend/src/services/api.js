import axios from 'axios';
import {API_ENDPOINTS, API_CONFIG} from '../config/constants';

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
    // console.log('Axios Request:', {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   timeout: config.timeout,
    //   isDirect: !API_CONFIG?.USE_PROXY,
    // });
    return config;
  },

  (error) => {
    // console.error('Axios Request Error:', {
    //   message: error.message,
    //   code: error.code,
    //   stack: error.stack,
    // });
    return Promise.reject(error);
  }
);

// add response interceptor 
apiClient.interceptors.response.use(
  (response) => {
    // console.log('Axios Response Success:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   url: response.config.url,
    //   dataType: typeof response.data,
    //   dataKeys: response.data ? Object.keys(response.data) : [],
    //   hasShops: response.data?.shops ? true : false,
    //   shopsCount: Array.isArray(response.data?.shops) ? response.data.shops.length : 'Not an array',
    // });
    return response;
  },

  (error) => {
    // console.error('Axios Response Error Details:', {
    //   message: error.message || 'Unknown error',
    //   code: error.code || 'NO_CODE',
    //   name: error.name || 'Unknown error type',
    //   status: error.response?.status || 'No status',
    //   statusText: error.response?.statusText || 'No status text',
    //   responseData: error.response?.data || 'No response data',
    //   requestUrl: error.config?.url || 'Unknown URL',
    //   requestMethod: error.config?.method || 'Unknown method',
    //   timeout: error.config?.timeout || 'No timeout',
    //   isNetworkError: !error.response,
    //   isTimeoutError: error.code === 'ECONNABORTED',
    //   isCorsError: error.message?.includes('CORS') || error.message?.includes('Cross-Origin'),
    //   fullError: error, // Include full error object for debugging
    // });
    return Promise.reject(error);
  }
);

// Utility function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to retry API with exp backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // console.log(`Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      // console.warn(`Attempt ${attempt} failed:`, {
      //   message: error.message,
      //   code: error.code,
      //   status: error.response?.status,
      // });

      if (attempt === maxRetries) {
        // console.error('All retry attempts exhausted');
        throw error;
      }
      
      // Only retry on network errors, timeouts, or server errors (5xx)
      const shouldRetry = 
        error.code === 'ECONNABORTED' || // timeout
        error.code === 'ERR_NETWORK' || // network error
        error.code === 'ERR_CONNECTION_REFUSED' || // connection refused
        !error.response || // no response (network issue)
        (error.response?.status && error.response.status >= 500);
      
      if (!shouldRetry) {
        // console.warn('Error not retryable:', error.response?.status);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      // console.log(`⏱Waiting ${delay}ms before retry ${attempt + 1}...`);
      await sleep(delay);
    }
  }
};


export const priceComparisonAPI = {
  searchProducts: async (productName) => {
    // Build the URL
    const url = `${API_ENDPOINTS.PRICE_COMPARISON}?product=${encodeURIComponent(productName)}`;
    
    // console.log('Starting API Request:', {
    //   url,
    //   product: productName,
    //   useProxy: API_CONFIG?.USE_PROXY,
    //   endpoint: API_ENDPOINTS.PRICE_COMPARISON,
    // });
    
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
        
        // console.log('Axios Request Config:', requestConfig);

        const response = await apiClient(requestConfig);
        
        // console.log('API Success - Data received:', {
        //   status: response.status,
        //   hasData: !!response.data,
        //   dataStructure: response.data ? Object.keys(response.data) : [],
        //   shopsPresent: !!response.data?.shops,
        //   shopsCount: Array.isArray(response.data?.shops) ? response.data.shops.length : 'Not array or missing',
        // });
        
        return response.data;
      } 

      catch (error) {
        // console.error('API Request Failed:', {
        //   errorType: error.name,
        //   message: error.message,
        //   code: error.code,
        //   status: error.response?.status,
        //   statusText: error.response?.statusText,
        //   responseData: error.response?.data,
        //   isTimeout: error.code === 'ECONNABORTED',
        //   isNetwork: error.code === 'ERR_NETWORK',
        //   isCors: error.message?.includes('CORS'),
        //   requestUrl: url,
        // });
        
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
      // console.log('Starting request with retry logic...');
      return await retryWithBackoff(makeRequest, 3, 2000); // 3 retries with 2s, 4s, 8s delays
    } catch (error) {
      // console.error('Final error after all retries:', {
      //   message: error.message,
      //   originalError: error,
      // });
      
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
    
    console.log('🔍 API Request URL:', url);
    console.log('📦 Filters received:', JSON.stringify(filters));
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      console.log('✅ API Response:', {
        count: response.data.count,
        resultsLength: response.data.results?.length,
        hasNext: !!response.data.next,
        hasPrevious: !!response.data.previous
      });
      return response.data;
    };
    
    try {
      return await retryWithBackoff(makeRequest, 2, 1500);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    const url = API_ENDPOINTS.PRODUCT_DETAIL(id);
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    try {
      return await retryWithBackoff(makeRequest, 2, 1500);
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
      return await retryWithBackoff(makeRequest, 2, 1500);
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },

  // Get single category by slug with products
  getCategoryById: async (slug) => {
    const url = API_ENDPOINTS.CATEGORY_DETAIL(slug);
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    try {
      return await retryWithBackoff(makeRequest, 2, 1500);
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
      return await retryWithBackoff(makeRequest, 2, 1500);
    } catch (error) {
      throw new Error(`Failed to fetch shops: ${error.message}`);
    }
  },

  // Get single shop by slug with details
  getShopById: async (slug) => {
    const url = API_ENDPOINTS.SHOP_DETAIL(slug);
    
    const makeRequest = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    try {
      return await retryWithBackoff(makeRequest, 2, 1500);
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
