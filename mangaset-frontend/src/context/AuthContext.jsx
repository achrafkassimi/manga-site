// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authService } from '../services/authService';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       if (authService.isAuthenticated()) {
//         const userData = await authService.getCurrentUser();
//         setUser(userData);
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       authService.logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (username, password) => {
//     try {
//       const response = await authService.login(username, password);
//       const userData = await authService.getCurrentUser();
//       setUser(userData);
//       setIsAuthenticated(true);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     authService.logout();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//     checkAuthStatus
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




// src/context/AuthContext.jsx - Version basique pour test
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simuler une vérification d'auth pour les tests
    setLoading(false);
    
    // Pour tester avec un utilisateur connecté, décommentez les lignes suivantes :
    // setUser({ username: 'testuser', email: 'test@example.com' });
    // setIsAuthenticated(true);
  }, []);

  const login = async (username, password) => {
    try {
      // Simulation d'une connexion pour les tests
      console.log('Test login:', username, password);
      setUser({ username, email: `${username}@example.com` });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = () => {
    // Fonction de vérification pour les tests
    console.log('Checking auth status...');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

