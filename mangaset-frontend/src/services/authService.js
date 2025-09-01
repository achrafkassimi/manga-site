// src/services/authService.js
import axios from 'axios';

const AUTH_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/auth/login/`, {
        username,
        password
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/user/profile/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import ApiService from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       // Verify token and get user profile
//       ApiService.request('/auth/profile/')
//         .then(userData => {
//           setUser(userData);
//         })
//         .catch(() => {
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (credentials) => {
//     const response = await ApiService.login(credentials);
//     setUser(response.user);
//     return response;
//   };

//   const logout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };