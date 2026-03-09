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
import { useAuth } from '../../store/AuthContext';
import { analyzeQuizAnswers } from '../../services/api';
import { saveUser } from '../../services/aws/mediora.service';
import { scoreQuizAnswersLocally } from '../../constants/quiz.constants';
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
  quizAnswers: { creatorType: string; audienceLocation: string; platforms: any[]; postingFrequency: any; biggestChallenge: string; tone: any; contentFormats: any[]; primaryGoal: any },
  localArchetype: CreatorArchetype,
): InfluencerProfile {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  // Validate the API-returned archetype; if absent/invalid fall back to locally scored one
  const VALID_ARCHETYPES = ['VISIONARY', 'EDUCATOR', 'ENTERTAINER', 'STORYTELLER', 'STRATEGIST', 'ARTIST', 'ADVOCATE', 'CONNECTOR'];
  const apiArchetype = typeof o.archetype === 'string' && VALID_ARCHETYPES.includes(o.archetype)
    ? (o.archetype as CreatorArchetype)
    : null;
  const archetype = apiArchetype ?? localArchetype;
  const niche = (typeof o.niche === 'string' ? o.niche : 'general') as Niche;
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
  const { token: cognitoUserId } = useAuth(); // real Cognito sub stored after login/signup
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
        // Step 1: Score locally — this always works, no network needed.
        // This is the guaranteed archetype; the API can only improve upon it.
        const { primaryArchetype: localArchetype } = scoreQuizAnswersLocally(answers);
        const resolvedUserId = cognitoUserId ?? `quiz-${Date.now()}`;

        // Step 2: Try to get richer profile data from the AI API.
        let raw: unknown = null;
        try {
          raw = await analyzeQuizAnswers(answers);
        } catch (apiErr) {
          console.warn('[Mediora] Quiz AI analysis failed (using local scoring):', apiErr);
        }

        if (cancelled) return;

        // Step 3: Build the profile — uses AI archetype if valid, otherwise local score.
        const profile = buildProfileFromAnalysis(raw, answers, localArchetype);
        const profileWithId: InfluencerProfile = { ...profile, userId: resolvedUserId };

        // Step 4: Persist locally (always succeeds).
        await setProfile(profileWithId);

        // Step 5: Sync to DynamoDB (non-fatal if offline).
        try {
          await saveUser({
            userId: resolvedUserId,
            niche: profileWithId.niche,
            tone: profileWithId.tone,
            language: profileWithId.language,
          });
        } catch (dbErr) {
          console.warn('[Mediora] DynamoDB saveUser failed (non-fatal):', dbErr);
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

