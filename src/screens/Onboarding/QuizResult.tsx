import React from 'react';
import { View, Text } from 'react-native';
import { onboardingStyles as styles } from './styles/Onboarding.styles';
import { ARCHETYPES } from '../../constants/quiz.constants';
import GoldBorderCard from '../../components/ui/Card/GoldBorderCard';
import Button from '../../components/ui/Button';
import { useProfile } from '../../store/ProfileContext';
import { spacing, radius } from '../../theme/spacing';
import colors from '../../theme/colors';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../types/navigation.types';
import type { CreatorArchetype } from '../../types/profile.types';

type Nav = StackNavigationProp<OnboardingStackParamList, 'QuizResult'>;

export const QuizResult: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { profile } = useProfile();
  const archetypeKey = (profile?.archetype ?? 'EDUCATOR') as CreatorArchetype;
  const archetype = ARCHETYPES[archetypeKey] ?? ARCHETYPES.EDUCATOR;

  return (
    <View style={[styles.screen, styles.padded]}>
      <View
        // confetti / celebratory aura approximation
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          position: 'absolute',
          top: -40,
          left: -40,
          right: -40,
          height: 260,
          backgroundColor: archetype.primaryColor + '22',
        }}
      />

      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.sm,
          letterSpacing: 2,
          color: colors.text.gold,
        }}
      >
        YOUR CREATOR ARCHETYPE
      </Text>

      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background.surface,
            borderWidth: 2,
            borderColor: archetype.primaryColor,
          }}
        >
          <Text style={{ fontSize: 40 }}>{archetype.icon}</Text>
        </View>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: spacing.md,
            fontFamily: fontFamilies.display.semibold,
            fontSize: 38,
            color: colors.text.primary,
          }}
        >
          {archetype.name.toUpperCase()}
        </Text>
      </View>

      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: spacing.md,
          fontFamily: fontFamilies.body.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.text.secondary,
        }}
      >
        {archetype.longDescription}
      </Text>

      <GoldBorderCard
        style={{
          marginTop: spacing.lg,
          borderRadius: radius.xl,
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
          How Mediora sees you
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
          Platform focus: Instagram · YouTube
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
          Primary tone: Informative & Clear
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
          Content focus: Educational · Carousels · Long Videos
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
          }}
        >
          Goal: Thought Leadership
        </Text>
      </GoldBorderCard>

      <View style={styles.bottomBar}>
        <Button
          title="Enter Mediora →"
          onPress={() => navigation.navigate('ProfileConfirm')}
        />
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: spacing.sm,
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
          }}
        >
          You can always update this in Settings.
        </Text>
      </View>
    </View>
  );
};

export default QuizResult;

