// src/context/AuthContext.jsx - Mock Version for Local Testing
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user database (localStorage simulation)
const MOCK_USERS_KEY = 'mock_users_db';
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

// Helper functions for mock database
const getMockUsers = () => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUsers = (users) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const generateMockToken = () => {
  return 'mock_token_' + Math.random().toString(36).substr(2, 16);
};

const createMockUser = (userData) => {
  return {
    id: Date.now(),
    username: userData.username,
    email: userData.email,
    bio: '',
    avatar: null,
    created_at: new Date().toISOString(),
    preferences: {
      readingMode: 'single',
      theme: 'light',
      language: 'fr',
      notifications: {
        newChapters: true,
        favorites: true,
        recommendations: false
      }
    },
    stats: {
      favoritesCount: 0,
      readingCount: 0,
      chaptersRead: 0
    },
    roles: ['user'],
    permissions: ['read', 'comment', 'rate']
  };
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize auth from localStorage
  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUser) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Mock login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getMockUsers();
      
      // Find user by email
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Aucun compte trouvé avec cet email');
      }
      
      // In a real app, you'd verify the password hash here
      // For mock, we'll accept any password for existing users
      
      const mockToken = generateMockToken();
      
      // Store auth data
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      
      setToken(mockToken);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Bienvenue, ${user.username}!`);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const users = getMockUsers();
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Check if username already exists
      const existingUsername = users.find(u => u.username === userData.username);
      if (existingUsername) {
        throw new Error('Ce nom d\'utilisateur est déjà pris');
      }
      
      // Create new user
      const newUser = createMockUser(userData);
      users.push(newUser);
      saveMockUsers(users);
      
      // Auto-login after registration
      const mockToken = generateMockToken();
      
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      
      setToken(mockToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast.success('Compte créé avec succès!');
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success('Déconnexion réussie');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getMockUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Check if email is taken by another user
      if (profileData.email !== user.email) {
        const emailExists = users.find(u => u.email === profileData.email && u.id !== user.id);
        if (emailExists) {
          throw new Error('Cet email est déjà utilisé');
        }
      }
      
      // Check if username is taken by another user
      if (profileData.username !== user.username) {
        const usernameExists = users.find(u => u.username === profileData.username && u.id !== user.id);
        if (usernameExists) {
          throw new Error('Ce nom d\'utilisateur est déjà pris');
        }
      }
      
      // Update user data
      const updatedUser = {
        ...users[userIndex],
        username: profileData.username || users[userIndex].username,
        email: profileData.email || users[userIndex].email,
        bio: profileData.bio !== undefined ? profileData.bio : users[userIndex].bio,
        avatar: profileData.avatar !== undefined ? profileData.avatar : users[userIndex].avatar,
        preferences: profileData.preferences || users[userIndex].preferences
      };
      
      users[userIndex] = updatedUser;
      saveMockUsers(users);
      
      // Update local storage and state
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profil mis à jour avec succès!');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd verify the current password here
      // For mock, we'll just validate the format
      
      if (passwordData.newPassword.length < 8) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas');
      }
      
      // In a real app, you'd update the password hash in the database
      toast.success('Mot de passe modifié avec succès!');
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getMockUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Aucun compte trouvé avec cet email');
      }
      
      // In a real app, you'd send a reset email here
      toast.success('Email de réinitialisation envoyé! (Mock - pas d\'email réel envoyé)');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (resetData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd verify the reset token here
      // For mock, we'll just validate the password format
      
      if (resetData.password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }
      
      toast.success('Mot de passe réinitialisé avec succès!');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify token (mock)
  const verifyToken = async (tokenToVerify) => {
    try {
      // In a real app, you'd verify with the server
      // For mock, we'll just check if it's in the correct format
      if (!tokenToVerify || !tokenToVerify.startsWith('mock_token_')) {
        throw new Error('Invalid token');
      }
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      return false;
    }
  };

  // Get auth headers for API requests
  const getAuthHeaders = () => {
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  // Check if user has specific role/permission
  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role);
  };

  const hasPermission = (permission) => {
    return user && user.permissions && user.permissions.includes(permission);
  };

  // Demo data creation
  const createDemoUsers = () => {
    const existingUsers = getMockUsers();
    
    // Only create demo users if database is empty
    if (existingUsers.length === 0) {
      const demoUsers = [
        {
          id: 1,
          username: 'demo_user',
          email: 'demo@mangaset.com',
          bio: 'Utilisateur de démonstration',
          avatar: null,
          created_at: new Date().toISOString(),
          preferences: {
            readingMode: 'single',
            theme: 'light',
            language: 'fr',
            notifications: {
              newChapters: true,
              favorites: true,
              recommendations: true
            }
          },
          stats: {
            favoritesCount: 25,
            readingCount: 8,
            chaptersRead: 1247
          },
          roles: ['user'],
          permissions: ['read', 'comment', 'rate']
        },
        {
          id: 2,
          username: 'admin_demo',
          email: 'admin@mangaset.com',
          bio: 'Administrateur de démonstration',
          avatar: null,
          created_at: new Date().toISOString(),
          preferences: {
            readingMode: 'double',
            theme: 'dark',
            language: 'fr',
            notifications: {
              newChapters: true,
              favorites: true,
              recommendations: true
            }
          },
          stats: {
            favoritesCount: 156,
            readingCount: 45,
            chaptersRead: 5673
          },
          roles: ['user', 'admin'],
          permissions: ['read', 'comment', 'rate', 'manage_users', 'manage_content']
        }
      ];
      
      saveMockUsers(demoUsers);
      console.log('Demo users created:', demoUsers);
    }
  };

  // Create demo users on first load
  useEffect(() => {
    createDemoUsers();
  }, []);

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    token,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    
    // Utilities
    getAuthHeaders,
    hasRole,
    hasPermission,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};