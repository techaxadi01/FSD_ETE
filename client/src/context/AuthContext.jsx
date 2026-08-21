import { useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('campus_inno_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('campus_inno_token');
    setToken(null);
    setUser(null);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('campus_inno_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem('campus_inno_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const getVoterIdentifier = () => {
    if (user && user.id) return user.id;
    return localStorage.getItem('campus_anon_voter_id') || 'anon_guest';
  };

  // Initialize or fetch current user on token load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const data = await getMe();
          setUser(data.user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      } else {
        // Create or read anonymous voter identifier fallback
        let anonId = localStorage.getItem('campus_anon_voter_id');
        if (!anonId) {
          anonId = 'anon_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
          localStorage.setItem('campus_anon_voter_id', anonId);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        getVoterIdentifier
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
