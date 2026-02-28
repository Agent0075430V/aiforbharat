import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../types/navigation.types';
import Avatar from '../../components/ui/Avatar';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { useProfile } from '../../store/ProfileContext';
import { mockInfluencerProfile } from '../../constants/mockData.constants';

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

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const GreetingHeader: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile: savedProfile } = useProfile();
  const profile = savedProfile ?? mockInfluencerProfile;
  const archetypeLabel = ARCHETYPE_LABELS[profile.archetype] ?? profile.archetype;

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
          initials={profile.displayName.charAt(0)}
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
            Good morning, {profile.displayName.split(' ')[0]}
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

