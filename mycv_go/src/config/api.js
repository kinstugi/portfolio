import axios from 'axios';

// API base URL - adjust this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 401 for login/register endpoints - let the component handle it
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                            error.config?.url?.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        // Handle unauthorized - clear token and redirect to login (only for protected routes)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on signin page
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

