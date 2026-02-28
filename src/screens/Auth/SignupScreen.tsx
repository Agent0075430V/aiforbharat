import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { authStyles as styles } from './styles/Auth.styles';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/Input/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../store/AuthContext';
import { signUp as cognitoSignUp, getCurrentUser } from '../../services/aws/authService';
import { saveUser } from '../../services/aws/mediora.service';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation.types';

type Nav = StackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit =
    !!fullName && !!email && !!password && password === confirmPassword;

  const handleSignup = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // Real Cognito sign-up
      await cognitoSignUp({ email, password, name: fullName });
      // After sign-up Cognito may need email verification.
      // For now sign them in immediately (works if auto-confirm is on, otherwise
      // you'd show a verification screen here).
      const user = await getCurrentUser();
      await signup(user.userId);
      // Persist to DynamoDB
      try {
        await saveUser({ userId: user.userId, email: user.email, name: fullName });
      } catch (dbErr) {
        console.warn('[Mediora] DynamoDB saveUser failed (non-fatal):', dbErr);
      }
      const root = navigation.getParent() as any;
      root?.replace('Onboarding');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
        text2: err?.message ?? 'Please try again.',
      });
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
          <Text style={styles.subtitle}>Let’s get you set up</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Create account</Text>

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
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

