import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Keep only one /api prefix
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // Add timeout
  withCredentials: true,
  // Add retry logic
  retry: 3,
  retryDelay: 1000
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

export default api; 