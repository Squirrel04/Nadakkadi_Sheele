import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Mock a user to bypass login entirely
  const [user, setUser] = useState({
    id: 1,
    username: 'guest_user',
    email: 'guest@example.com',
    fullName: 'Guest Player',
    totalScore: 15420,
    level: 12
  });
  const [token, setToken] = useState('mock-token');

  // No loading state needed since we have mock data instantly
  const loading = false;

  const register = async () => {
    return { user, access_token: token };
  };

  const login = async () => {
    return { user, access_token: token };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
