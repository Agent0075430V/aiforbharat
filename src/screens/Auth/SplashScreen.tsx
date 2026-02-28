import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { splashStyles as styles } from './styles/Splash.styles';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation.types';

const AUTH_TOKEN_KEY = 'auth_token';
const PROFILE_KEY = 'influencer_profile';

type Nav = StackNavigationProp<AuthStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const mOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkTranslate = useRef(new Animated.Value(10)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // While splash plays, check AsyncStorage for auth_token and influencer_profile
    const storagePromise = Promise.all([
      AsyncStorage.getItem(AUTH_TOKEN_KEY),
      AsyncStorage.getItem(PROFILE_KEY),
    ]).then(([token, profileRaw]) => ({
      hasToken: !!token,
      hasProfile: !!(profileRaw && profileRaw !== 'null'),
    }));

    // Monogram fade / "fill" approximation
    Animated.timing(mOpacity, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Wordmark fade + drift
    Animated.timing(wordmarkOpacity, {
      toValue: 1,
      duration: 600,
      delay: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    Animated.timing(wordmarkTranslate, {
      toValue: 0,
      duration: 600,
      delay: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Tagline fade
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 600,
      delay: 1400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // After 2.2s + animation: route by PATH A / B / C
    Animated.sequence([
      Animated.delay(2200),
      Animated.parallel([
        Animated.timing(containerScale, {
          toValue: 1.02,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      storagePromise.then(({ hasToken, hasProfile }) => {
        const root = navigation.getParent() as any;
        if (!hasToken) {
          // PATH A: Brand new user → Welcome
          navigation.replace('Welcome');
        } else if (!hasProfile) {
          // PATH B: Logged in, no profile → Quiz
          root?.replace('Onboarding');
        } else {
          // PATH C: Returning user → Home
          root?.replace('App');
        }
      });
    });
  }, [
    containerOpacity,
    containerScale,
    mOpacity,
    navigation,
    taglineOpacity,
    wordmarkOpacity,
    wordmarkTranslate,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
        },
      ]}
    >
      <View style={styles.glow} />
      <Animated.Text style={[styles.monogram, { opacity: mOpacity }]}>
        M
      </Animated.Text>
      <Animated.Text
        style={[
          styles.wordmark,
          {
            opacity: wordmarkOpacity,
            transform: [{ translateY: wordmarkTranslate }],
          },
        ]}
      >
        mediora
      </Animated.Text>
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineOpacity,
          },
        ]}
      >
        your intelligent content partner
      </Animated.Text>
    </Animated.View>
  );
};

export default SplashScreen;

