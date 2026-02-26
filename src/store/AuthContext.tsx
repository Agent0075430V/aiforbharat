import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string | null) => Promise<void>;
  login: (token: string) => Promise<void>;
  signup: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback(async (value: string | null) => {
    if (value === null) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setTokenState(null);
    } else {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, value);
      setTokenState(value);
    }
  }, []);

  const login = useCallback(async (authToken: string) => {
    await setToken(authToken);
  }, [setToken]);

  const signup = useCallback(async (authToken: string) => {
    await setToken(authToken);
  }, [setToken]);

  const logout = useCallback(async () => {
    await setToken(null);
  }, [setToken]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(AUTH_TOKEN_KEY).then((stored) => {
      if (mounted) {
        setTokenState(stored ?? null);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const value: AuthContextValue = {
    token,
    isAuthenticated: !!token,
    isLoading,
    setToken,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
