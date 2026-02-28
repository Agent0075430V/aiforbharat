import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { onboardingStyles as styles } from './styles/Onboarding.styles';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { OnboardingStackParamList } from '../../types/navigation.types';
import { useQuiz } from '../../store/QuizContext';
import { useProfile } from '../../store/ProfileContext';
import { analyzeQuizAnswers } from '../../services/api';
import { saveUser } from '../../services/aws/mediora.service';
import type { InfluencerProfile, CreatorArchetype, Niche, Tone, Language } from '../../types/profile.types';

type Nav = StackNavigationProp<OnboardingStackParamList, 'QuizAnalyzing'>;

const messages = [
  'Analysing your creator persona...',
  'Building your voice profile...',
  'Calculating content strategy...',
  'Mapping your audience insights...',
  'Setting up your AI engine...',
];

function buildProfileFromAnalysis(
  raw: unknown,
  quizAnswers: { creatorType: string; audienceLocation: string; platforms: any[]; postingFrequency: any; biggestChallenge: string; tone: any; contentFormats: any[]; primaryGoal: any }
): InfluencerProfile {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const archetype = (typeof o.archetype === 'string' ? o.archetype : 'EDUCATOR') as CreatorArchetype;
  const niche = (typeof o.niche === 'string' ? o.niche : 'education') as Niche;
  const tone = (typeof o.primaryTone === 'string' ? o.primaryTone : quizAnswers.tone) as Tone;
  const language = (typeof o.suggestedLanguage === 'string' ? o.suggestedLanguage : 'English') as Language;
  const platforms = Array.isArray(quizAnswers.platforms) && quizAnswers.platforms.length
    ? quizAnswers.platforms
    : ['instagram'];
  const now = new Date().toISOString();
  return {
    userId: `quiz-${Date.now()}`,
    displayName: 'Creator',
    bio: (typeof o.archetypeDescription === 'string' ? o.archetypeDescription : undefined) || (typeof o.contentStrategy === 'string' ? o.contentStrategy : undefined),
    archetype,
    niche,
    tone,
    language,
    platforms,
    primaryPlatform: platforms[0],
    contentFormats: Array.isArray(quizAnswers.contentFormats) && quizAnswers.contentFormats.length ? quizAnswers.contentFormats : ['reel'],
    postingFrequency: quizAnswers.postingFrequency,
    primaryGoal: quizAnswers.primaryGoal,
    audienceLocation: quizAnswers.audienceLocation,
    quizAnswers,
    followerCounts: {},
    socialHandles: {},
    completedAt: now,
  };
}

type QuizAnalyzingRoute = RouteProp<OnboardingStackParamList, 'QuizAnalyzing'>;

export const QuizAnalyzing: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<QuizAnalyzingRoute>();
  const { getQuizAnswers } = useQuiz();
  const { setProfile } = useProfile();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    let cancelled = false;
    const run = async () => {
      const answers = route.params?.answers ?? getQuizAnswers();
      if (answers) {
        try {
          const raw = await analyzeQuizAnswers(answers);
          if (cancelled) return;
          const profile = buildProfileFromAnalysis(raw, answers);
          // 1. Save locally to AsyncStorage
          await setProfile(profile);
          // 2. Save to DynamoDB via Lambda
          try {
            await saveUser({
              userId: profile.userId,
              niche: profile.niche,
              tone: profile.tone,
              language: profile.language,
            });
          } catch (dbErr) {
            console.warn('[Mediora] DynamoDB saveUser failed (non-fatal):', dbErr);
          }
        } catch {
          // keep default / mock profile from next screen or leave unset
        }
      }
      if (!cancelled) {
        navigation.replace('QuizResult');
      }
    };
    const t = setTimeout(run, 3200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [getQuizAnswers, setProfile, navigation, progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const currentMessage = messages[0];

  return (
    <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: 220,
          height: 220,
          borderRadius: 110,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.gold.pure,
        }}
      >
        <LottieView
          source={require('../../../assets/lottie/ai-thinking.json')}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
      </View>

      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: spacing.lg,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.md,
          color: colors.text.primary,
        }}
      >
        {currentMessage}
      </Text>

      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: spacing.lg,
          width: 240,
          height: 6,
          borderRadius: radius.full,
          backgroundColor: colors.border.hair,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: widthInterpolated,
            height: '100%',
            borderRadius: radius.full,
            backgroundColor: colors.gold.pure,
          }}
        />
      </View>
    </View>
  );
};

export default QuizAnalyzing;

