import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('medsecure_user');
    const storedToken = localStorage.getItem('medsecure_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('medsecure_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        qrToken: data.qrToken,
      }));
      localStorage.setItem('medsecure_token', data.token);

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        qrToken: data.qrToken,
      });
      setToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register handler
  const register = async (name, email, phone, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('medsecure_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        qrToken: data.qrToken,
      }));
      localStorage.setItem('medsecure_token', data.token);

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        qrToken: data.qrToken,
      });
      setToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('medsecure_user');
    localStorage.removeItem('medsecure_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
