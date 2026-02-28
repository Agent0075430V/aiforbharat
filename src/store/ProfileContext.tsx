import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InfluencerProfile } from '../types/profile.types';

const PROFILE_KEY = 'influencer_profile';

interface ProfileContextValue {
  profile: InfluencerProfile | null;
  hasProfile: boolean;
  setProfile: (profile: InfluencerProfile | null) => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<InfluencerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setProfile = useCallback(async (value: InfluencerProfile | null) => {
    if (value === null) {
      await AsyncStorage.removeItem(PROFILE_KEY);
      setProfileState(null);
    } else {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(value));
      setProfileState(value);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (!mounted) return;
      try {
        const parsed = raw ? (JSON.parse(raw) as InfluencerProfile) : null;
        setProfileState(parsed);
      } catch {
        setProfileState(null);
      }
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const value: ProfileContextValue = {
    profile,
    hasProfile: !!profile,
    setProfile,
    isLoading,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export default ProfileContext;
