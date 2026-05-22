import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { disconnectSocket } from '../services/socket';
import { demoUser } from '../utils/demoData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('collabsphere_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('collabsphere_token'));
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('collabsphere_demo') === 'true');
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('collabsphere_token')));

  useEffect(() => {
    const hydrate = async () => {
      if (!token || demoMode) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('collabsphere_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('collabsphere_token');
        localStorage.removeItem('collabsphere_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, [token, demoMode]);

  const persist = (nextUser, nextToken, isDemo = false) => {
    setUser(nextUser);
    setToken(nextToken);
    setDemoMode(isDemo);
    localStorage.setItem('collabsphere_user', JSON.stringify(nextUser));
    localStorage.setItem('collabsphere_token', nextToken);
    localStorage.setItem('collabsphere_demo', String(isDemo));
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persist(data.user, data.token, false);
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  };

  const launchDemo = () => {
    persist(demoUser, 'demo-token', true);
  };

  const logout = async () => {
    if (token && !demoMode) {
      try {
        await api.post('/auth/logout');
      } catch {
        // The local session is cleared even if the API is unavailable.
      }
    }
    disconnectSocket();
    localStorage.removeItem('collabsphere_token');
    localStorage.removeItem('collabsphere_user');
    localStorage.removeItem('collabsphere_demo');
    setToken(null);
    setUser(null);
    setDemoMode(false);
  };

  const value = useMemo(
    () => ({ user, token, demoMode, loading, login, signup, launchDemo, logout, setUser }),
    [user, token, demoMode, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
