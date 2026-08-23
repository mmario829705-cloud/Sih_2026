import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aarogya_token');
    const cachedMember = localStorage.getItem('aarogya_member');

    if (!token) {
      setLoading(false);
      return;
    }

    if (cachedMember) {
      try { setMember(JSON.parse(cachedMember)); } catch { /* ignore */ }
    }

    authService.me()
      .then((data) => {
        setMember(data.member);
        localStorage.setItem('aarogya_member', JSON.stringify(data.member));
      })
      .catch(() => {
        localStorage.removeItem('aarogya_token');
        localStorage.removeItem('aarogya_member');
        setMember(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('aarogya_token', data.token);
    localStorage.setItem('aarogya_member', JSON.stringify(data.member));
    setMember(data.member);
    return data.member;
  }, []);

  const register = useCallback(async (payload) => {
    await authService.register(payload);
    return login(payload.email, payload.password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('aarogya_token');
    localStorage.removeItem('aarogya_member');
    setMember(null);
  }, []);

  const value = {
    member,
    isAuthenticated: !!member,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
