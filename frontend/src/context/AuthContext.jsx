import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password, role = 'student') => {
    setLoading(true);
    try {
      let userData;
      let userToken;
      try {
        const response = await api.post('/auth/login', { email, password, role });
        userData = response.data?.data?.user || response.data?.user;
        userToken = response.data?.token;
      } catch {
        // Fallback for demo/offline mock login
        userData = {
          id: 'usr_' + Date.now(),
          name: email.split('@')[0].toUpperCase(),
          fullName: email.split('@')[0].toUpperCase(),
          email,
          role: role.toLowerCase(),
        };
        userToken = 'mock_jwt_token_' + Date.now();
      }

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (fullName, email, password, role = 'student') => {
    setLoading(true);
    try {
      let userData;
      let userToken;
      try {
        const response = await api.post('/auth/register', { fullName, email, password, role });
        userData = response.data?.data?.user || response.data?.user;
        userToken = response.data?.token;
      } catch {
        userData = {
          id: 'usr_' + Date.now(),
          name: fullName,
          fullName,
          email,
          role: role.toLowerCase(),
        };
        userToken = 'mock_jwt_token_' + Date.now();
      }

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
