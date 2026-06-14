import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set the Authorization header globally whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch profile once on mount if a token exists (lifecycle init — runs exactly once)
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/profile`);
      setUser(res.data);
    } catch {
      // Token is invalid or expired — clean up
      logout();
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
    // Cleanup: remove global header on unmount
    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
  };

  const register = async (username, email, password) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { username, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/profile`);
      setUser(res.data);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
