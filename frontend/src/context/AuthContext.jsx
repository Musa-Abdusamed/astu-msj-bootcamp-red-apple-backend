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

  const login = async (userId, password, role = 'student') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { userId, password, role });
      const rawUser = response.data?.data?.user || response.data?.user;
      const mustChangeCredentials =
        response.data?.mustChangeCredentials ?? rawUser?.mustChangeCredentials ?? false;
      const userData = { ...rawUser, mustChangeCredentials };
      const userToken = response.data?.token;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setLoading(false);
      return { success: true, user: userData, mustChangeCredentials };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const register = async (fullName, email, password, role = 'student') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { fullName, email, password, role });
      const rawUser = response.data?.data?.user || response.data?.user;
      const mustChangeCredentials =
        response.data?.mustChangeCredentials ?? rawUser?.mustChangeCredentials ?? true;
      const userData = { ...rawUser, mustChangeCredentials };
      const userToken = response.data?.token;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setLoading(false);
      return { success: true, user: userData, mustChangeCredentials };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
