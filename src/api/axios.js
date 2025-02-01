import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://stock-pro-backend.onrender.com/api',  // Note: explicit /api prefix
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // Add timeout
  // Add retry logic
  retry: 3,
  retryDelay: 1000
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.code === 'ERR_NETWORK') {
      console.log('Network error - attempting to reconnect...');
      // You could implement retry logic here
    }
    const { config } = error;
    
    // If config does not exist or retry option is not set, reject
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(error);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1000);
    });

    // Return the promise in which recalls axios to retry the request
    await backoff;
    return api(config);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 