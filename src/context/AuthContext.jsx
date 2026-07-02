import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('mh_token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, rehydrate user from localStorage and verify token validity
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('mh_token');
      const storedUser = localStorage.getItem('mh_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify token is still valid in the background
          const res = await authApi.me();
          setUser(res.data.user);
          localStorage.setItem('mh_user', JSON.stringify(res.data.user));
        } catch {
          localStorage.removeItem('mh_token');
          localStorage.removeItem('mh_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem('mh_token', jwtToken);
    localStorage.setItem('mh_user', JSON.stringify(userData));
    setUser(userData);
    setToken(jwtToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mh_token');
    localStorage.removeItem('mh_user');
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem('mh_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
