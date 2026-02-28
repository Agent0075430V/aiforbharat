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

/** Call /generate with a pre-built prompt string and parse the JSON response */
async function callGenerate(userId: string, prompt: string): Promise<string> {
  const result = await generateCaption({ userId, prompt });
  // Return a JSON string of the full result so parseJSONSafely can decode it
  return JSON.stringify({
    caption: result.caption_en,
    caption_en: result.caption_en,
    caption_hi: result.caption_hi,
    caption_ta: result.caption_ta,
    caption_mr: result.caption_mr,
    caption_bn: result.caption_bn,
    hashtags: result.hashtags,
    script: result.script,
    cta: result.cta,
    engagementScore: result.engagementScore,
    draftId: result.draftId,
  });
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
  const raw = await callGenerate(getUserId(profile), prompt);
  return parseJSONSafely(raw);
};

/** Generates a weekly content plan via Bedrock (7 parallel calls) */
export const generateWeeklyPlan = async (
  profile: InfluencerProfile,
  weekStartDate: string,
): Promise<CalendarPlanResponse> => {
  const userId = getUserId(profile);
  const result = await awsGenerateWeeklyPlan({ userId, weekStartDate, postsPerWeek: 7 });

  // Map to CalendarPlanResponse shape expected by the Calendar screen
  const prompt = buildCalendarPrompt(profile, weekStartDate);
  // Attempt to build a compatible shape; fall back to a raw Bedrock call if needed
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
  const raw = await callGenerate(userId, prompt);
  return parseJSONSafely<CalendarPlanResponse>(raw);
};

/** Generates hashtag groups for a topic via Bedrock */
export const generateHashtags = async (
  topic: string,
  profile: InfluencerProfile,
  platform: Platform,
) => {
  const prompt = buildHashtagPrompt(topic, profile, platform);
  const raw = await callGenerate(getUserId(profile), prompt);
  return parseJSONSafely(raw);
};

/** Generates a content script via Bedrock */
export const generateScript = async (
  topic: string,
  profile: InfluencerProfile,
  format: 'reel' | 'short' | 'podcast' | 'long_video',
  platform: Platform,
) => {
  const prompt = buildScriptPrompt(topic, profile, format, platform);
  const raw = await callGenerate(getUserId(profile), prompt);
  return parseJSONSafely(raw);
};

/** Analyses quiz answers and returns archetype + profile hints via Bedrock */
export const analyzeQuizAnswers = async (answers: QuizAnswers) => {
  const prompt = buildQuizAnalysisPrompt(answers);
  // Quiz analysis doesn't need a real userId — use a placeholder
  const raw = await callGenerate('quiz-analysis', prompt);
  return parseJSONSafely(raw);
};

/** Parses a voice transcript into a structured command via Bedrock */
export const parseVoiceCommand = async (transcript: string) => {
  const prompt = buildVoiceIntentPrompt(transcript);
  const raw = await callGenerate('voice-parser', prompt);
  return parseJSONSafely(raw);
};

/**
 * transcribeAudio
 * Uploads a local audio URI to S3 then transcribes it via Amazon Transcribe.
 * Replaces the old groqTranscribeAudio (Groq Whisper) implementation.
 *
 * @param audioUri  - file:// URI from expo-av
 * @param userId    - Cognito userId (required for S3 path scoping)
 */
export const transcribeAudio = async (audioUri: string, userId = 'anonymous'): Promise<string> => {
  // 1. Upload audio to S3 via Lambda presigned URL
  const fileName = `recording_${Date.now()}.m4a`;
  const { data: uploadData } = await post<Record<string, string>, { presignedUrl: string; fileKey: string }>(
    '/upload',
    { userId, fileName, fileType: 'audio/m4a', uploadType: 'voice', operation: 'upload' },
  );

  // 2. PUT the file to S3 directly
  const fileRes = await fetch(audioUri);
  const blob = await fileRes.blob();
  await fetch(uploadData.presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'audio/m4a' },
    body: blob,
  });

  // 3. Transcribe via Lambda
  const result = await transcribeVoiceNote({ userId, s3AudioKey: uploadData.fileKey });
  return result.transcript;
};
