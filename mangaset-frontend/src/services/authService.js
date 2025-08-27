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