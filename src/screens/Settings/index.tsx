import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext';
import colors from '../../theme/colors';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    const root = navigation.getParent()?.getParent() as any;
    root?.replace('Auth');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: spacing.lg }}
      >
        <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: 16, color: colors.text.primary }}>
          ← Back
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: fontFamilies.display.semibold,
          fontSize: 24,
          color: colors.text.primary,
          marginBottom: spacing.xl,
        }}
      >
        Settings
      </Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={{ marginTop: spacing.xl }}
      >
        <Text
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: 16,
            color: colors.semantic.error,
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;
