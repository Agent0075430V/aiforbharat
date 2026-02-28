import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../types/navigation.types';
import { onboardingStyles as styles } from './styles/Onboarding.styles';
import { QUIZ_QUESTIONS, QuizQuestion } from '../../constants/quiz.constants';
import { useQuiz, buildQuizAnswersFromMap } from '../../store/QuizContext';
import Button from '../../components/ui/Button';
import colors from '../../theme/colors';
import { motion } from '../../theme/animations';
import useHaptics from '../../hooks/useHaptics';

type QuizStepRouteProps = NativeStackScreenProps<OnboardingStackParamList, 'QuizStep'>['route'];
type QuizStepNavProps = NativeStackScreenProps<OnboardingStackParamList, 'QuizStep'>['navigation'];

export const QuizStep: React.FC = () => {
  const route = useRoute<QuizStepRouteProps>();
  const navigation = useNavigation<QuizStepNavProps>();
  const { answers: answersMap, setAnswer } = useQuiz();
  const stepIndex = route.params?.stepIndex ?? 0;
  const totalSteps = QUIZ_QUESTIONS.length;
  const [selected, setSelected] = useState<string[]>([]);
  const question = useMemo<QuizQuestion | undefined>(
    () => QUIZ_QUESTIONS[stepIndex],
    [stepIndex]
  );
  const haptics = useHaptics();
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: motion.durations.normal,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: motion.durations.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim, stepIndex]);

  if (!question) {
    return null;
  }

  const isMulti = question.type === 'multi';

  const toggle = (id: string) => {
    let next: string[];
    if (isMulti) {
      if (selected.includes(id)) {
        next = selected.filter((v) => v !== id);
      } else {
        next = [...selected, id];
      }
    } else {
      next = [id];
    }
    setSelected(next);
    haptics.light();
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      navigation.replace('QuizStep', { stepIndex: stepIndex - 1 });
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = () => {
    const values = selected
      .map((id) => question.options.find((o) => o.id === id)?.value)
      .filter((v): v is string => v != null);
    if (isMulti) {
      setAnswer(question.id, values);
    } else if (values[0] != null) {
      setAnswer(question.id, values[0]);
    }
    if (stepIndex + 1 >= totalSteps) {
      const fullMap = { ...answersMap, [question.id]: isMulti ? values : values[0] };
      const quizAnswers = buildQuizAnswersFromMap(fullMap) ?? {
        creatorType: (fullMap.q1_creatorType as string) || 'educator',
        audienceLocation: (fullMap.q2_audienceLocation as string) || 'global',
        platforms: (Array.isArray(fullMap.q3_platforms) ? fullMap.q3_platforms : fullMap.q3_platforms ? [fullMap.q3_platforms] : ['instagram']) as any,
        postingFrequency: (fullMap.q4_postingFrequency as any) || '1_2_per_week',
        biggestChallenge: (fullMap.q5_biggestChallenge as string) || '',
        tone: (fullMap.q6_tone as any) || 'informative_clear',
        contentFormats: (Array.isArray(fullMap.q7_contentFormats) ? fullMap.q7_contentFormats : fullMap.q7_contentFormats ? [fullMap.q7_contentFormats] : ['reel']) as any,
        primaryGoal: (fullMap.q8_primaryGoal as any) || 'community_building',
      };
      navigation.replace('QuizAnalyzing', { answers: quizAnswers });
    } else {
      navigation.replace('QuizStep', { stepIndex: stepIndex + 1 });
    }
  };

  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const canContinue = selected.length > 0;

  return (
    <View style={[styles.screen, styles.padded]}>
      <View style={styles.quizHeader}>
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          style={{ paddingRight: 12 }}
        >
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ fontSize: 16, color: colors.text.secondary }}
          >
            ←
          </Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.quizQuestionMeta}>
            Question {stepIndex + 1} of {totalSteps}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: colors.gold.pure,
                  borderRadius: 999,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Text style={styles.quizQuestionTitle}>{question.title}</Text>

          <View style={styles.optionGrid}>
            {question.options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => toggle(opt.id)}
                  style={({ pressed }) => [
                    styles.optionTile,
                    isSelected && styles.optionTileSelected,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  {opt.emoji ? (
                    <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  ) : null}
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  {opt.description ? (
                    <Text style={styles.optionDescription}>
                      {opt.description}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      <View style={styles.bottomBar}>
        <Button
          title="Continue →"
          onPress={handleContinue}
          disabled={!canContinue}
        />
      </View>
    </View>
  );
};

export default QuizStep;

