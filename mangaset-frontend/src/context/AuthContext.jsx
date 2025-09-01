// src/context/AuthContext.jsx - FIXED FOR VITE
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Configuration - FIXED for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Debug log for development
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment Variables:', import.meta.env);
}

// Create axios instance with interceptors
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug log for development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
authAPI.interceptors.response.use(
  (response) => {
    // Debug log for development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config?.method?.toUpperCase()} ${response.config?.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Debug log for development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return authAPI(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        // Verify token is still valid by fetching user profile
        try {
          const response = await authAPI.get('/auth/profile/');
          const userData = response.data;
          
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          // Token invalid, clear storage
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Login function with real backend integration
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // First try the main login endpoint
      let response;
      try {
        response = await authAPI.post('/auth/login/', {
          username: credentials.username,
          password: credentials.password,
        });
      } catch (loginError) {
        // If login endpoint fails, try JWT token endpoint
        response = await authAPI.post('/auth/token/', {
          username: credentials.username,
          password: credentials.password,
        });
      }

      const responseData = response.data;
      
      // Handle different response formats
      let access, refresh, userData;
      
      if (responseData.tokens) {
        // Format: { user: {...}, tokens: { access: "...", refresh: "..." } }
        access = responseData.tokens.access;
        refresh = responseData.tokens.refresh;
        userData = responseData.user;
      } else if (responseData.access && responseData.refresh) {
        // Format: { access: "...", refresh: "...", user: {...} }
        access = responseData.access;
        refresh = responseData.refresh;
        userData = responseData.user;
      } else {
        // Fallback format
        access = responseData.access;
        refresh = responseData.refresh;
        userData = responseData.user || { username: credentials.username };
      }
      
      // Store tokens and user data
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        user: userData, 
        message: 'Login successful' 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please wait and try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Login timeout. Please check your connection.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authAPI.post('/auth/register/', userData);
      const responseData = response.data;
      
      // Handle different response formats
      let access, refresh, newUser;
      
      if (responseData.tokens) {
        access = responseData.tokens.access;
        refresh = responseData.tokens.refresh;
        newUser = responseData.user;
      } else {
        access = responseData.access;
        refresh = responseData.refresh;
        newUser = responseData.user;
      }
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        user: newUser, 
        message: 'Registration successful' 
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.status === 400) {
        const data = error.response.data;
        if (data.details) {
          // Handle validation errors
          const errors = data.details;
          if (errors.username) {
            errorMessage = Array.isArray(errors.username) ? errors.username[0] : errors.username;
          } else if (errors.email) {
            errorMessage = Array.isArray(errors.email) ? errors.email[0] : errors.email;
          } else if (errors.password) {
            errorMessage = Array.isArray(errors.password) ? errors.password[0] : errors.password;
          } else if (errors.non_field_errors) {
            errorMessage = Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors;
          }
          
          // Return full error object for form handling
          throw { message: errorMessage, details: errors };
        } else if (data.error) {
          errorMessage = data.error;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Try to blacklist the token on server
        try {
          await authAPI.post('/auth/logout/', {
            refresh: refreshToken
          });
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      toast.success('Logged out successfully');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.put('/auth/profile/', profileData);
      const updatedUser = response.data.user || response.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { 
        success: true, 
        user: updatedUser, 
        message: 'Profile updated successfully' 
      };
      
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(
        error.response?.data?.message || 'Profile update failed'
      );
    }
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    
    // Utilities
    getAuthHeaders,
    hasRole,
    hasPermission,
    
    // API instance (for other components to use)
    api: authAPI
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for advanced usage
export default AuthContext;

// Additional API service functions
export const authService = {
  // Check if backend is available
  checkBackendHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/health/`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  // Password reset request
  requestPasswordReset: async (email) => {
    try {
      const response = await authAPI.post('/auth/password/reset/', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },
  
  // Confirm password reset
  confirmPasswordReset: async (token, password) => {
    try {
      const response = await authAPI.post('/auth/password/reset/confirm/', {
        token,
        password
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset confirmation failed');
    }
  }
};