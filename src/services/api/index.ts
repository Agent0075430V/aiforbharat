import {
  groqGenerateCaptions,
  groqGenerateWeeklyPlan,
  groqGenerateHashtags,
  groqGenerateScript,
  groqAnalyzeQuiz,
  groqParseVoiceIntent,
  groqTranscribeAudio,
} from './groq.service';
import {
  geminiGenerateCaptions,
  geminiGenerateWeeklyPlan,
  geminiGenerateHashtags,
  geminiGenerateScript,
  geminiAnalyzeQuiz,
  geminiParseVoiceIntent,
} from './gemini.service';
import { parseJSONSafely } from './parser';
import {
  buildCaptionPrompt,
  buildQuizAnalysisPrompt,
  buildVoiceIntentPrompt,
  buildCalendarPrompt,
  buildHashtagPrompt,
  buildScriptPrompt,
} from './prompts';
import type {
  InfluencerProfile,
  QuizAnswers,
  Platform,
} from '../../types/profile.types';
import type { CalendarPlanResponse } from './prompts/calendar.prompt';

async function withFallback(
  primary: () => Promise<string>,
  fallback: () => Promise<string>
): Promise<string> {
  try {
    return await primary();
  } catch {
    return await fallback();
  }
}

// Generates captions + hashtags + best time in one call
export const generateCaptions = async (
  topic: string,
  profile: InfluencerProfile,
  platform: Platform,
  language: string
) => {
  const prompt = buildCaptionPrompt(topic, profile, platform, language);
  const raw = await withFallback(
    () => groqGenerateCaptions(prompt),
    () => geminiGenerateCaptions(prompt)
  );
  return parseJSONSafely(raw);
};

// Generates a weekly content plan
export const generateWeeklyPlan = async (
  profile: InfluencerProfile,
  weekStartDate: string
): Promise<CalendarPlanResponse> => {
  const prompt = buildCalendarPrompt(profile, weekStartDate);
  const raw = await withFallback(
    () => groqGenerateWeeklyPlan(prompt),
    () => geminiGenerateWeeklyPlan(prompt)
  );
  return parseJSONSafely<CalendarPlanResponse>(raw);
};

// Generates hashtag groups for a topic
export const generateHashtags = async (
  topic: string,
  profile: InfluencerProfile,
  platform: Platform
) => {
  const prompt = buildHashtagPrompt(topic, profile, platform);
  const raw = await withFallback(
    () => groqGenerateHashtags(prompt),
    () => geminiGenerateHashtags(prompt)
  );
  return parseJSONSafely(raw);
};

// Generates a content script
export const generateScript = async (
  topic: string,
  profile: InfluencerProfile,
  format: 'reel' | 'short' | 'podcast' | 'long_video',
  platform: Platform
) => {
  const prompt = buildScriptPrompt(topic, profile, format, platform);
  const raw = await withFallback(
    () => groqGenerateScript(prompt),
    () => geminiGenerateScript(prompt)
  );
  return parseJSONSafely(raw);
};

// Analyses quiz answers and returns archetype + profile hints
export const analyzeQuizAnswers = async (answers: QuizAnswers) => {
  const prompt = buildQuizAnalysisPrompt(answers);
  const raw = await withFallback(
    () => groqAnalyzeQuiz(prompt),
    () => geminiAnalyzeQuiz(prompt)
  );
  return parseJSONSafely(raw);
};

// Parses voice transcript into structured command
export const parseVoiceCommand = async (transcript: string) => {
  const prompt = buildVoiceIntentPrompt(transcript);
  const raw = await withFallback(
    () => groqParseVoiceIntent(prompt),
    () => geminiParseVoiceIntent(prompt)
  );
  return parseJSONSafely(raw);
};

// Transcribes audio file to text using Groq Whisper (FREE)
export const transcribeAudio = groqTranscribeAudio;

