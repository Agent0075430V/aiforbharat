import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { authStyles as styles } from './styles/Auth.styles';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/Input/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/AuthContext';
import { signIn as cognitoSignIn } from '../../services/aws/authService';
import { saveUser, getFullProfile } from '../../services/aws/mediora.service';
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

  // Google Sign-In placeholder — shown until OAuth credentials are configured
  const handleGoogleSignIn = () => {
    Toast.show({
      type: 'info',
      text1: 'Google Sign-In coming soon',
      text2: 'Use email & password for now.',
    });
  };

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const user = await cognitoSignIn({ email, password });
      await login(user.userId);
      saveUser({ userId: user.userId, email: user.email, name: user.name }).catch((dbErr) => {
        console.warn('[Mediora] DynamoDB saveUser failed (non-fatal):', dbErr);
      });
      await AsyncStorage.setItem('last_user_id', user.userId);

      // Restore the user's full profile from DynamoDB so they don't redo onboarding
      try {
        const savedProfile = await getFullProfile(user.userId);
        if (savedProfile) {
          // Stamp the correct userId in case it drifted, then write to AsyncStorage
          const restoredProfile = { ...savedProfile, userId: user.userId };
          await AsyncStorage.setItem('influencer_profile', JSON.stringify(restoredProfile));
        }
      } catch (profileErr) {
        console.warn('[Login] Could not restore profile from DynamoDB (non-fatal):', profileErr);
      }

      await navigateAfterAuth();
    } catch (err: any) {
      const errCode = err?.name ?? err?.code ?? '';

      if (errCode === 'UserNotConfirmedException') {
        // Account exists but email not verified — send them to complete signup
        Toast.show({
          type: 'info',
          text1: 'Email not verified',
          text2: 'Redirecting you to verify your account...',
        });
        // Small delay so the toast is visible
        setTimeout(() => navigation.navigate('Signup'), 1200);
      } else if (errCode === 'NotAuthorizedException') {
        Toast.show({
          type: 'error',
          text1: 'Wrong password',
          text2: 'Check your password and try again.',
        });
      } else if (errCode === 'UserNotFoundException') {
        Toast.show({
          type: 'error',
          text1: 'Account not found',
          text2: 'No account with this email. Sign up instead.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign in failed',
          text2: err?.message ?? 'Check your email and password.',
        });
      }
    } finally {
      setLoading(false);
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
