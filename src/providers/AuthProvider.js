import React, { createContext, useContext, useState } from 'react';

// Creating a context to manage the authentication state
const AuthContext = createContext();

// Custom hook to access the authentication state
export const useAuth = () => useContext(AuthContext);

// Provider component to manage the authentication state
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};