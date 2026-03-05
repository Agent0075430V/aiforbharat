import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { authStyles as styles } from './styles/Auth.styles';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/Input/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/AuthContext';
import {
  signUp as cognitoSignUp,
  confirmSignUp as cognitoConfirmSignUp,
  resendConfirmationCode,
  signIn as cognitoSignIn,
} from '../../services/aws/authService';
import { saveUser } from '../../services/aws/mediora.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation.types';

type Nav = StackNavigationProp<AuthStackParamList, 'Signup'>;
type Step = 'form' | 'otp';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { signup } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const canSubmit = !!fullName && !!email && !!password && password === confirmPassword;

  // ── Step 1: Register ──────────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await cognitoSignUp({ email, password, name: fullName });
      setStep('otp');
    } catch (err: any) {
      const errCode = err?.name ?? err?.code ?? '';

      if (errCode === 'UsernameExistsException') {
        // Account exists — try to resend code for unconfirmed users
        try {
          await resendConfirmationCode(email);
          Toast.show({
            type: 'info',
            text1: 'Code resent',
            text2: 'A new verification code has been sent to your email.',
          });
          setStep('otp');
        } catch (resendErr: any) {
          const resendCode = resendErr?.name ?? resendErr?.code ?? '';
          // InvalidParameterException = user is ALREADY confirmed
          // LimitExceededException = too many resend attempts
          if (
            resendCode === 'InvalidParameterException' ||
            resendErr?.message?.includes('CONFIRMED')
          ) {
            Toast.show({
              type: 'info',
              text1: 'Account already exists',
              text2: 'An account with this email is already verified. Redirecting to sign in...',
            });
            setTimeout(() => navigation.navigate('Login'), 1500);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Account already exists',
              text2: 'Try signing in instead.',
            });
            setTimeout(() => navigation.navigate('Login'), 1500);
          }
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign up failed',
          text2: err?.message ?? 'Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Confirm OTP ───────────────────────────────────────────────────────
  const handleConfirmOtp = async () => {
    const code = otp.trim();
    if (!code) {
      Toast.show({ type: 'error', text1: 'Enter the 6-digit code from your email' });
      return;
    }
    setLoading(true);
    try {
      await cognitoConfirmSignUp(email, code);
      await signInAndNavigate();
    } catch (err: any) {
      const errCode = err?.name ?? err?.code ?? '';
      const errMsg: string = err?.message ?? '';

      if (
        errCode === 'NotAuthorizedException' &&
        (errMsg.includes('CONFIRMED') || errMsg.includes('already confirmed'))
      ) {
        // User is already confirmed — just try to sign in directly
        Toast.show({ type: 'info', text1: 'Already verified', text2: 'Signing you in...' });
        await signInAndNavigate();
      } else if (errCode === 'CodeMismatchException') {
        Toast.show({
          type: 'error',
          text1: 'Wrong code',
          text2: 'That code is incorrect. Check your email and try again.',
        });
      } else if (errCode === 'ExpiredCodeException' || errCode === 'LimitExceededException') {
        // Code was invalidated (too many wrong attempts or timed out)
        // Auto-resend so user can immediately enter fresh code
        try {
          await resendConfirmationCode(email);
          setOtp('');
          Toast.show({
            type: 'info',
            text1: 'New code sent',
            text2: 'Your previous code expired. A fresh code has been sent to your email.',
          });
        } catch {
          Toast.show({
            type: 'error',
            text1: 'Code expired',
            text2: 'Tap "Resend code" to get a new one.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification failed',
          text2: errMsg || 'Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Internal: sign in after confirmation ──────────────────────────────────────
  const signInAndNavigate = async () => {
    try {
      // authService.signIn handles UserAlreadyAuthenticatedException internally
      const user = await cognitoSignIn({ email, password });
      await signup(user.userId);
      await AsyncStorage.setItem('last_user_id', user.userId);
      saveUser({ userId: user.userId, email: user.email, name: fullName }).catch((e) =>
        console.warn('[Mediora] saveUser non-fatal:', e)
      );
      const root = navigation.getParent() as any;
      root?.replace('Onboarding');
    } catch (signInErr: any) {
      console.error('[Mediora] signInAndNavigate error:', signInErr?.name, signInErr?.message);
      // Account IS verified — just redirect to Login so user can sign in fresh
      Toast.show({
        type: 'success',
        text1: '✅ Account verified!',
        text2: 'Please sign in to continue.',
      });
      setTimeout(() => navigation.navigate('Login'), 1500);
    }
  };

  // ── Resend code ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendConfirmationCode(email);
      Toast.show({ type: 'success', text1: 'Code resent', text2: 'Check your inbox.' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Could not resend', text2: err?.message });
    } finally {
      setResendLoading(false);
    }
  };

  // ── OTP Step ──────────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <View style={styles.brandCenter}>
            <Text style={styles.brandText}>mediora</Text>
            <Text style={styles.subtitle}>Check your email</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Verify your account</Text>
          <Text style={[styles.footerText, { marginBottom: 16, textAlign: 'center' }]}>
            We sent a 6-digit code to {email}.{'\n'}Enter it below to confirm your account.
          </Text>

          <Input
            label="6-Digit Code"
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <View style={{ marginTop: 24 }}>
            <Button
              title={loading ? 'Verifying...' : 'Verify & Continue'}
              onPress={handleConfirmOtp}
              disabled={otp.trim().length < 6 || loading}
              loading={loading}
            />
          </View>

          <TouchableOpacity
            onPress={handleResend}
            disabled={resendLoading}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={[styles.forgotPasswordText]}>
              {resendLoading ? 'Resending...' : "Didn't receive it? Resend code"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            Wrong email?{' '}
            <Text
              style={[styles.footerText, styles.footerLink]}
              onPress={() => { setStep('form'); setOtp(''); }}
            >
              Go back
            </Text>
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ── Signup Form ───────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <View style={{ width: 40 }} />
        <View style={styles.brandCenter}>
          <Text style={styles.brandText}>mediora</Text>
          <Text style={styles.subtitle}>Let&apos;s get you set up</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Create account</Text>

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
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
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={{ marginTop: 24 }}>
          <Button
            title={loading ? 'Creating account...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={!canSubmit}
            loading={loading}
          />
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={[styles.footerText, styles.footerLink]}
            onPress={() => navigation.navigate('Login')}
          >
            Sign in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
