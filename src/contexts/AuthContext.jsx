
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock user data - in a real app, this would come from an API
const MOCK_USER = {
  email: 'admin@loyolamotors.com',
  name: 'Admin User',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user state from localStorage on component mount
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (isAuth === 'true') {
      setUser(MOCK_USER);
    }
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email === 'admin@loyolamotors.com' && password === 'admin123') {
          setUser(MOCK_USER);
          // In a real app, you might store a token in localStorage
          localStorage.setItem('isAuthenticated', 'true');
          resolve(MOCK_USER);
        } else {
          reject(new Error('Credenciales incorrectas'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
  };

  // A simple check for page reloads
  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  };


  const value = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
