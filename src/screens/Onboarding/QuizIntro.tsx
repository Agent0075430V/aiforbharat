import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { onboardingStyles as styles } from './styles/Onboarding.styles';
import Button from '../../components/ui/Button';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../types/navigation.types';

type Nav = StackNavigationProp<OnboardingStackParamList, 'QuizIntro'>;

export const QuizIntro: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={[styles.screen, styles.padded]}>
      <View
        // Background editorial gradient orbs
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      >
        {/* subtle dust / glow approximation */}
        <View
          style={{
            position: 'absolute',
            top: -80,
            right: -120,
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: colors.gold.glowStrong,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: colors.teal.glow,
          }}
        />
      </View>

      <View style={styles.chip}>
        <Text style={styles.chipLabel}>CREATOR PROFILE SETUP</Text>
      </View>

      <Text style={styles.introHeading}>
        Let&apos;s discover{'\n'}your creator DNA
      </Text>

      <Text style={styles.introBody}>
        We&apos;ll ask you 8 questions that help us understand your unique
        voice, audience, and content style. The more honest you are, the better
        Mediora performs for you.
      </Text>

      <View style={styles.platformsCollage}>
        <View
          style={[
            styles.platformBadge,
            { backgroundColor: colors.platform.instagram + '22' },
          ]}
        >
          <Text style={styles.platformText}>Instagram</Text>
        </View>
        <View
          style={[
            styles.platformBadge,
            { backgroundColor: colors.platform.youtube + '22' },
          ]}
        >
          <Text style={styles.platformText}>YouTube</Text>
        </View>
        <View
          style={[
            styles.platformBadge,
            { backgroundColor: colors.platform.tiktok + '22' },
          ]}
        >
          <Text style={styles.platformText}>TikTok</Text>
        </View>
        <View
          style={[
            styles.platformBadge,
            { backgroundColor: colors.platform.linkedin + '22' },
          ]}
        >
          <Text style={styles.platformText}>LinkedIn</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Questions</Text>
          <Text style={styles.statValue}>8</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>~2 minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Personalization</Text>
          <Text style={styles.statValue}>100%</Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Button
          title="Start My Profile →"
          onPress={() => navigation.navigate('QuizStep', { stepIndex: 0 })}
        />
      </View>
    </View>
  );
};

export default QuizIntro;

