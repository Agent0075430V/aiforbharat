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

    Promise.all([
      AsyncStorage.getItem(PROFILE_KEY),
      AsyncStorage.getItem('last_user_id'),
    ]).then(async ([raw, loggedInUserId]) => {
      if (!mounted) return;

      try {
        const parsed = raw ? (JSON.parse(raw) as InfluencerProfile) : null;

        if (parsed) {
          const profileBelongsToCurrentUser =
            !loggedInUserId ||                          // no user logged in yet — trust it
            !parsed.userId ||                          // profile has no userId — trust it
            parsed.userId === loggedInUserId;          // userId matches — trust it

          if (profileBelongsToCurrentUser) {
            setProfileState(parsed);
          } else {
            // Stale profile from a different account (e.g. Manali from testing)
            // Discard it so the current user starts fresh
            console.info(
              `[ProfileContext] Discarding stale profile (userId=${parsed.userId}) — logged-in user is ${loggedInUserId}`
            );
            await AsyncStorage.removeItem(PROFILE_KEY);
            setProfileState(null);
          }
        } else {
          setProfileState(null);
        }
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
