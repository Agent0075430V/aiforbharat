import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../services/aws/authService';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_NAME_KEY = 'auth_user_name';

// All keys that belong to a specific user — wiped on logout & user-switch
export const ALL_USER_KEYS = [
  AUTH_TOKEN_KEY,
  AUTH_NAME_KEY,
  'last_user_id',
  'influencer_profile',   // ProfileContext
  'mediora_drafts',       // DraftsContext
];

interface AuthContextValue {
  token: string | null;
  userName: string | null;
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
  const [userName, setUserNameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Fetch real name + userId from Cognito and cache them.
   *  Also discards any stale profile belonging to a different account. */
  const refreshUserData = useCallback(async () => {
    try {
      const user = await getCurrentUser();  // returns { userId, email, name }
      const name = user.name ?? user.email ?? null;
      const cognitoId = user.userId;        // Cognito sub — the real primary key

      setUserNameState(name);
      if (name) await AsyncStorage.setItem(AUTH_NAME_KEY, name);
      if (cognitoId) await AsyncStorage.setItem('last_user_id', cognitoId);

      // If a profile is saved for a DIFFERENT userId, wipe it immediately
      const rawProfile = await AsyncStorage.getItem('influencer_profile');
      if (rawProfile) {
        try {
          const parsed = JSON.parse(rawProfile);
          if (parsed?.userId && parsed.userId !== cognitoId) {
            console.info('[AuthContext] Wiping stale profile for', parsed.userId);
            await AsyncStorage.removeItem('influencer_profile');
          }
        } catch { /* ignore parse errors */ }
      }
    } catch {
      // Not signed in yet — that's fine
    }
  }, []);

  const setToken = useCallback(async (value: string | null) => {
    if (value === null) {
      // Full wipe — clear ALL user-scoped data on logout
      await AsyncStorage.multiRemove(ALL_USER_KEYS);
      setTokenState(null);
      setUserNameState(null);
    } else {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, value);
      setTokenState(value);
      // Eagerly fetch Cognito name + userId when token is set
      await refreshUserData();
    }
  }, [refreshUserData]);

  const login = useCallback(async (authToken: string) => { await setToken(authToken); }, [setToken]);
  const signup = useCallback(async (authToken: string) => { await setToken(authToken); }, [setToken]);
  const logout = useCallback(async () => { await setToken(null); }, [setToken]);

  // Restore token + cached name from AsyncStorage on app start
  useEffect(() => {
    let mounted = true;
    Promise.all([
      AsyncStorage.getItem(AUTH_TOKEN_KEY),
      AsyncStorage.getItem(AUTH_NAME_KEY),
    ]).then(([storedToken, storedName]) => {
      if (!mounted) return;
      setTokenState(storedToken ?? null);
      setUserNameState(storedName ?? null);
      setIsLoading(false);
      // Refresh from Cognito in the background if a token exists
      if (storedToken) refreshUserData();
    });
    return () => { mounted = false; };
  }, [refreshUserData]);

  const value: AuthContextValue = {
    token,
    userName,
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
