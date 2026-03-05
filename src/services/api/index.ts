/**
 * src/services/api/index.ts
 *
 * AI Service Layer — ALL AI calls now go through AWS API Gateway → Lambda → Bedrock.
 * Groq and Gemini have been removed. Function signatures are preserved so no screen files need changing.
 *
 * Flow: UI screen → this file → mediora.service.ts → apiService.ts → API Gateway → Lambda → Bedrock
 */

import {
  generateCaption,
  generateWeeklyPlan as awsGenerateWeeklyPlan,
  transcribeVoiceNote,
  getUser,
} from '../aws/mediora.service';
import { parseJSONSafely } from './parser';
import {
  buildCaptionPrompt,
  buildQuizAnalysisPrompt,
  buildVoiceIntentPrompt,
  buildCalendarPrompt,
  buildHashtagPrompt,
  buildScriptPrompt,
} from './prompts';
import { post } from '../aws/apiService';
import type { InfluencerProfile, QuizAnswers, Platform } from '../../types/profile.types';
import type { CalendarPlanResponse } from './prompts/calendar.prompt';

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Extract userId from the profile (sub from Cognito) */
function getUserId(profile: InfluencerProfile): string {
  return (profile as any).userId ?? (profile as any).id ?? 'anonymous';
}

/** Call /generate with a specific action and return the full parsed result from Lambda */
async function callGenerate(userId: string, prompt: string, action = 'caption'): Promise<any> {
  return generateCaption({ userId, prompt, action } as any);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ▌ Public API (same signatures as before — screens unchanged)
// ═══════════════════════════════════════════════════════════════════════════════

/** Generates captions + hashtags + engagement score via Bedrock */
export const generateCaptions = async (
  topic: string,
  profile: InfluencerProfile,
  platform: Platform,
  language: string,
) => {
  const prompt = buildCaptionPrompt(topic, profile, platform, language);
  const result = await callGenerate(getUserId(profile), prompt, 'caption');
  if (result && typeof result === 'object') return result;
  return parseJSONSafely(result as unknown as string);
};

/** Generates a weekly content plan via Bedrock (7 parallel calls) */
export const generateWeeklyPlan = async (
  profile: InfluencerProfile,
  weekStartDate: string,
): Promise<CalendarPlanResponse> => {
  const userId = getUserId(profile);
  const result = await awsGenerateWeeklyPlan({ userId, weekStartDate, postsPerWeek: 7 });

  // Map to CalendarPlanResponse shape expected by the Calendar screen
  if (result?.week?.length) {
    return {
      days: result.week.map((day) => ({
        date: day.date,
        caption: day.caption_en,
        hashtags: day.hashtags,
        script: day.script,
        cta: day.cta,
      })),
    } as unknown as CalendarPlanResponse;
  }

  // Fallback: single Bedrock call with calendar prompt
  const prompt = buildCalendarPrompt(profile, weekStartDate);
  const rawResult = await callGenerate(userId, prompt);
  const raw = typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult);
  return parseJSONSafely<CalendarPlanResponse>(raw);
};

/** Generates hashtag groups for a topic via Bedrock */
export const generateHashtags = async (
  topic: string,
  profile: InfluencerProfile,
  platform: Platform,
) => {
  const prompt = buildHashtagPrompt(topic, profile, platform);
  const result = await callGenerate(getUserId(profile), prompt, 'hashtag');
  if (result && typeof result === 'object') return result;
  return parseJSONSafely(result as unknown as string);
};

/** Generates a content script via Bedrock */
export const generateScript = async (
  topic: string,
  profile: InfluencerProfile,
  format: 'reel' | 'short' | 'podcast' | 'long_video',
  platform: Platform,
) => {
  const prompt = buildScriptPrompt(topic, profile, format, platform);
  const result = await callGenerate(getUserId(profile), prompt, 'script');
  if (result && typeof result === 'object') return result;
  return parseJSONSafely(result as unknown as string);
};

/** Analyses quiz answers and returns archetype + profile hints via Bedrock */
export const analyzeQuizAnswers = async (answers: QuizAnswers) => {
  const prompt = buildQuizAnalysisPrompt(answers);
  const result = await callGenerate('quiz-analysis', prompt, 'quiz');
  if (result && typeof result === 'object') return result;
  return parseJSONSafely(result as unknown as string);
};

/** Parses a voice transcript into a structured command via Bedrock */
export const parseVoiceCommand = async (transcript: string) => {
  const prompt = buildVoiceIntentPrompt(transcript);
  const result = await callGenerate('voice-parser', prompt, 'voice');
  const raw = typeof result === 'string' ? result : JSON.stringify(result);
  return parseJSONSafely(raw);
};

/**
 * transcribeAudio
 * Uploads a local audio URI to S3 then transcribes it via Amazon Transcribe.
 *
 * @param audioUri  - file:// URI from expo-av
 * @param userId    - Cognito userId (required for S3 path scoping). Pass the
 *                    value from useAuth().token which stores the Cognito sub.
 */
export const transcribeAudio = async (audioUri: string, userId = 'anonymous'): Promise<string> => {
  // 1. Get a presigned S3 upload URL from Lambda
  const fileName = `recording_${Date.now()}.m4a`;
  const { data: uploadData } = await post<Record<string, string>, { presignedUrl: string; fileKey: string }>(
    '/upload',
    { userId, fileName, fileType: 'audio/m4a', uploadType: 'voice', operation: 'upload' },
  );

  // 2. PUT the audio file directly to S3 via the presigned URL
  const fileRes = await fetch(audioUri);
  const blob = await fileRes.blob();
  await fetch(uploadData.presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'audio/m4a' },
    body: blob,
  });

  // 3. Transcribe via Lambda → Amazon Transcribe
  const result = await transcribeVoiceNote({ userId, s3AudioKey: uploadData.fileKey });
  return result.transcript;
};
