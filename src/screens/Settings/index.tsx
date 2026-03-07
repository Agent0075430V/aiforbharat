import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext';
import { useProfile } from '../../store/ProfileContext';
import { signOut as cognitoSignOut } from '../../services/aws/authService';
import { ProfileSection } from './ProfileSection';
import { PlatformConnections } from './PlatformConnections';
import colors from '../../theme/colors';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type SettingsTab = 'profile' | 'social' | 'app';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout, userName } = useAuth();
  const { profile, setProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Name to display: onboarding profile > Cognito name > fallback
  const displayName = profile?.displayName ?? userName ?? 'Creator';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await cognitoSignOut();
    } catch (e) {
      console.warn('[Settings] Cognito signOut error (continuing):', e);
    }
    // Clear in-memory profile + all AsyncStorage user data
    await setProfile(null);
    await logout();
    // Navigate to Auth screen — reset the entire navigation stack
    const root = navigation.getParent()?.getParent() as any;
    if (root?.replace) {
      root.replace('Auth');
    } else {
      (navigation as any).reset({ index: 0, routes: [{ name: 'Auth' }] });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <Text style={{
            fontFamily: fontFamilies.display.semibold,
            fontSize: 24,
            color: colors.text.primary,
          }}>
            Settings
          </Text>
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: colors.gold?.glow ?? '#3D3520',
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.gold?.pure ?? '#D4AF37',
          }}>
            <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.lg, color: colors.gold?.pure ?? '#D4AF37' }}>
              {initial}
            </Text>
          </View>
        </View>

        {/* Tab selector */}
        <View style={{
          flexDirection: 'row',
          borderRadius: radius.lg,
          backgroundColor: colors.background.surface,
          padding: 4,
          marginBottom: spacing.xl,
        }}>
          {(['profile', 'social', 'app'] as SettingsTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                alignItems: 'center',
                backgroundColor: activeTab === tab ? colors.background.base : 'transparent',
              }}
            >
              <Text style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: activeTab === tab ? colors.text.primary : colors.text.muted,
                textTransform: 'capitalize',
              }}>
                {tab === 'profile' ? '👤 Profile' : tab === 'social' ? '🔗 Social' : '⚙️ App'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Tab */}
        {activeTab === 'profile' && <ProfileSection />}

        {/* Social Accounts Tab */}
        {activeTab === 'social' && <PlatformConnections />}

        {/* App Tab */}
        {activeTab === 'app' && (
          <View style={{ gap: spacing.md }}>
            {/* App info section */}
            <View style={{
              padding: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}>
              <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.xs, color: colors.text.muted, marginBottom: spacing.sm, letterSpacing: 0.8 }}>
                APP INFO
              </Text>
              <InfoRow label="Version" value="1.0.0" />
              <InfoRow label="AI Model" value="Claude 3.5 Sonnet v2" />
              <InfoRow label="Region" value="Asia Pacific (Mumbai)" />
            </View>

            {/* Account section */}
            <View style={{
              padding: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}>
              <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.xs, color: colors.text.muted, marginBottom: spacing.sm, letterSpacing: 0.8 }}>
                ACCOUNT
              </Text>
              {profile?.userId && (
                <InfoRow label="User ID" value={profile.userId.slice(0, 16) + '...'} />
              )}
              <InfoRow label="Name" value={displayName} />
              <InfoRow label="Archetype" value={profile?.archetype ?? '—'} />
            </View>

            {/* Sign out */}
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                marginTop: spacing.md,
                padding: spacing.md,
                borderRadius: radius.lg,
                backgroundColor: `${colors.semantic?.error ?? '#FF6B6B'}10`,
                borderWidth: 1,
                borderColor: `${colors.semantic?.error ?? '#FF6B6B'}40`,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.md,
                color: colors.semantic?.error ?? '#FF6B6B',
              }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Helper component ─────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
    <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
      {label}
    </Text>
    <Text style={{ fontFamily: fontFamilies.mono.medium, fontSize: fontSizes.sm, color: colors.text.secondary }}>
      {value}
    </Text>
  </View>
);

export default SettingsScreen;
