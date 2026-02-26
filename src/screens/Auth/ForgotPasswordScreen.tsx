import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { authStyles as styles } from './styles/Auth.styles';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation.types';

type Nav = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      Toast.show({ type: 'success', text1: 'Check your email', text2: 'We sent a reset link to ' + email });
    }, 1000);
  };

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <View style={{ width: 40 }} />
        <View style={styles.brandCenter}>
          <Text style={styles.brandText}>mediora</Text>
          <Text style={styles.subtitle}>Reset your password</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Forgot password</Text>

        <Input
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          helperText="We'll send you a reset link."
        />

        <View style={{ marginTop: 24 }}>
          <Button
            title={loading ? 'Sending...' : 'Send reset link'}
            onPress={handleSend}
            disabled={!email}
            loading={loading}
          />
        </View>

        {sent && (
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginTop: 16,
              textAlign: 'center',
              color: '#22C55E',
            }}
          >
            Check your inbox for a reset link.
          </Text>
        )}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText} onPress={() => navigation.goBack()}>
          Back to sign in
        </Text>
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

