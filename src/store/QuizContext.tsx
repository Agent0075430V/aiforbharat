import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { QuizAnswers, Platform, PostingFrequency, Tone, ContentFormat, ContentGoal } from '../types/profile.types';
import type { QuizQuestionId } from '../constants/quiz.constants';

type AnswersMap = Partial<Record<QuizQuestionId, string | string[]>>;

const QID_TO_KEY: Record<QuizQuestionId, keyof QuizAnswers> = {
  q1_creatorType: 'creatorType',
  q2_audienceLocation: 'audienceLocation',
  q3_platforms: 'platforms',
  q4_postingFrequency: 'postingFrequency',
  q5_biggestChallenge: 'biggestChallenge',
  q6_tone: 'tone',
  q7_contentFormats: 'contentFormats',
  q8_primaryGoal: 'primaryGoal',
};

/** Build QuizAnswers from a full answers map (e.g. current answers + current step). */
export function buildQuizAnswersFromMap(map: AnswersMap): QuizAnswers | null {
  const a = map;
  const creatorType = (a.q1_creatorType as string) || '';
  const audienceLocation = (a.q2_audienceLocation as string) || '';
  const platforms = toArray(a.q3_platforms) as Platform[];
  const postingFrequency = (a.q4_postingFrequency as PostingFrequency) || '1_2_per_week';
  const biggestChallenge = (a.q5_biggestChallenge as string) || '';
  const tone = (a.q6_tone as Tone) || 'informative_clear';
  const contentFormats = toArray(a.q7_contentFormats) as ContentFormat[];
  const primaryGoal = (a.q8_primaryGoal as ContentGoal) || 'community_building';
  if (!creatorType && !platforms.length) return null;
  return {
    creatorType,
    audienceLocation,
    platforms: platforms.length ? platforms : ['instagram'],
    postingFrequency,
    biggestChallenge,
    tone,
    contentFormats: contentFormats.length ? contentFormats : ['reel'],
    primaryGoal,
  };
}

interface QuizContextValue {
  answers: AnswersMap;
  setAnswer: (questionId: QuizQuestionId, value: string | string[]) => void;
  getQuizAnswers: () => QuizAnswers | null;
  clearAnswers: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

function toArray(v: string | string[]): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<AnswersMap>({});

  const setAnswer = useCallback((questionId: QuizQuestionId, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const getQuizAnswers = useCallback((): QuizAnswers | null => {
    return buildQuizAnswersFromMap(answers);
  }, [answers]);

  const clearAnswers = useCallback(() => setAnswers({}), []);

  const value = useMemo(
    () => ({ answers, setAnswer, getQuizAnswers, clearAnswers }),
    [answers, setAnswer, getQuizAnswers, clearAnswers]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
