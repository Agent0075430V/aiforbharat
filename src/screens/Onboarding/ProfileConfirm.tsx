import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onboardingStyles as styles } from './styles/Onboarding.styles';
import GoldBorderCard from '../../components/ui/Card/GoldBorderCard';
import Button from '../../components/ui/Button';
import { spacing } from '../../theme/spacing';
import colors from '../../theme/colors';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { useProfile } from '../../store/ProfileContext';
import { mockInfluencerProfile } from '../../constants/mockData.constants';

export const ProfileConfirm: React.FC = () => {
  const navigation = useNavigation();
  const { profile, setProfile } = useProfile();

  const goToApp = async () => {
    if (!profile) await setProfile(mockInfluencerProfile);
    const root = navigation.getParent() as any;
    root?.replace('App');
  };

  return (
    <View style={[styles.screen, styles.padded]}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          fontFamily: fontFamilies.display.semibold,
          fontSize: 32,
          color: colors.text.primary,
        }}
      >
        Your profile is ready.
      </Text>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: spacing.sm,
          fontFamily: fontFamilies.body.regular,
          fontSize: 15,
          color: colors.text.secondary,
        }}
      >
        This is how Mediora will think about your content. You can refine it
        anytime in Settings.
      </Text>

      <GoldBorderCard
        style={{
          marginTop: spacing.lg,
        }}
      >
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: colors.text.gold,
            marginBottom: spacing.sm,
          }}
        >
          {profile?.displayName ?? 'Creator'} · {profile?.archetype ? `The ${profile.archetype.charAt(0) + profile.archetype.slice(1).toLowerCase()}` : 'Creator'}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}
        >
          Platforms: {profile?.platforms?.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' · ') ?? 'Instagram'}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}
        >
          Tone: Informative & Clear
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}
        >
          Content formats: Reels · Carousels · Long videos
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
          }}
        >
          Primary goal: Thought leadership
        </Text>
      </GoldBorderCard>

      <View style={styles.bottomBar}>
        <Button title="Enter Mediora →" onPress={goToApp} />
      </View>
    </View>
  );
};

export default ProfileConfirm;

