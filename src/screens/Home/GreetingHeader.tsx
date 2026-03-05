import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../types/navigation.types';
import Avatar from '../../components/ui/Avatar';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { useProfile } from '../../store/ProfileContext';
import { useAuth } from '../../store/AuthContext';

const ARCHETYPE_LABELS: Record<string, string> = {
  EDUCATOR: 'The Educator',
  VISIONARY: 'The Visionary',
  ENTERTAINER: 'The Entertainer',
  STORYTELLER: 'The Storyteller',
  STRATEGIST: 'The Strategist',
  ARTIST: 'The Artist',
  ADVOCATE: 'The Advocate',
  CONNECTOR: 'The Connector',
};

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const GreetingHeader: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile: savedProfile } = useProfile();
  const { userName } = useAuth();

  // Priority: onboarding profile name → Cognito name → "Creator"
  const displayName =
    savedProfile?.displayName ??
    userName ??
    'Creator';

  const firstName = displayName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  const archetypeLabel = savedProfile?.archetype
    ? (ARCHETYPE_LABELS[savedProfile.archetype] ?? savedProfile.archetype)
    : 'Content Creator';

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
      }}
    >
      <Pressable
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => navigation.navigate('Settings')}
      >
        <Avatar
          size={50}
          initials={initial}
          ringColor={colors.teal.pure}
        />
        <View style={{ marginLeft: spacing.sm }}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: 16,
              color: colors.text.primary,
            }}
          >
            {getTimeGreeting()}, {firstName} 👋
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginTop: 2,
              fontFamily: fontFamilies.body.regular,
              fontSize: 12,
              color: colors.text.secondary,
            }}
          >
            {archetypeLabel} ⚡
          </Text>
        </View>
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginRight: spacing.md,
            fontSize: 18,
            color: colors.text.secondary,
          }}
        >
          🔔
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 18,
            color: colors.text.secondary,
          }}
        >
          🔍
        </Text>
      </View>
    </View>
  );
};

export default GreetingHeader;
