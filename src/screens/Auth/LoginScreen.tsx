import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { authStyles as styles } from './styles/Auth.styles';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/Input/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/AuthContext';
import { signIn as cognitoSignIn } from '../../services/aws/authService';
import { saveUser } from '../../services/aws/mediora.service';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation.types';


const PROFILE_KEY = 'influencer_profile';
type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  const googleWebClientId = extra?.googleWebClientId;

  // expo-auth-session/providers/google routing logic:
  //   expoClientId  → used in Expo Go on both iOS and Android (via auth.expo.io proxy)
  //   webClientId   → used when running in a web browser
  //   iosClientId   → used ONLY in standalone native iOS builds (NOT Expo Go)
  //   androidClientId → used ONLY in standalone native Android builds (NOT Expo Go)
  //
  // By setting expoClientId (= Web OAuth client ID) and NOT setting iosClientId,
  // expo-auth-session v7 (SDK 54) removed expoClientId and the auth.expo.io proxy.
  // Google provider now requires platform-specific client IDs:
  //   webClientId    → web browser
  //   iosClientId    → iOS (Expo Go bundle: host.exp.Exponent, standalone: your bundle)
  //   androidClientId → Android
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: googleWebClientId,
    iosClientId: extra?.googleIosClientId || undefined,
    androidClientId: extra?.googleAndroidClientId || undefined,
  });

  const navigateAfterAuth = async () => {
    const profileRaw = await AsyncStorage.getItem(PROFILE_KEY);
    const hasProfile = !!(profileRaw && profileRaw !== 'null');
    const root = navigation.getParent() as any;
    if (hasProfile) {
      root?.replace('App');
    } else {
      root?.replace('Onboarding');
    }
  };

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        // In a real app, exchange the Google token for a backend-issued JWT.
        const mockToken = 'google-' + Date.now();
        await login(mockToken);
        await navigateAfterAuth();
      } else if (response?.type === 'error') {
        Toast.show({
          type: 'error',
          text1: 'Google sign-in failed',
          text2: response.error?.message ?? 'Please try again.',
        });
      }
    };
    void handleGoogleResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      // Real Cognito sign-in
      const user = await cognitoSignIn({ email, password });
      // Store userId as the auth token so downstream services know who we are
      await login(user.userId);
      // Persist user record to DynamoDB
      try {
        await saveUser({ userId: user.userId, email: user.email, name: user.name });
      } catch (dbErr) {
        console.warn('[Mediora] DynamoDB saveUser failed (non-fatal):', dbErr);
      }
      await navigateAfterAuth();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: err?.message ?? 'Check your email and password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleWebClientId) {
      Toast.show({
        type: 'info',
        text1: 'Google not configured',
        text2: 'Add googleWebClientId to app.json to enable Google sign-in.',
      });
      return;
    }
    try {
      await promptAsync();
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Google sign-in failed',
        text2: 'Please try again.',
      });
    }
  };

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <View style={{ width: 40 }} />
        <View style={styles.brandCenter}>
          <Text style={styles.brandText}>mediora</Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Sign In</Text>

        <Input
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.forgotPasswordRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleSignIn}
            disabled={!email || !password}
            loading={loading}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Continue with Google"
          variant="secondary"
          onPress={handleGoogleSignIn}
          disabled={!request}
        />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={[styles.footerText, styles.footerLink]}
            onPress={() => navigation.navigate('Signup')}
          >
            Create one
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
