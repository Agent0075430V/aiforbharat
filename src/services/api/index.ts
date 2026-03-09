/**
 * src/services/api/index.ts
 *
 * AI Service Layer — Two-tier strategy:
 *   1. Primary:  AWS API Gateway → Lambda → Bedrock (when active)
 *   2. Fallback: Groq (Llama 3.3 70B) direct API — FREE tier available
 *
 * Flow: UI screen → this file → tries Bedrock → if fails, tries Groq
 * Set EXPO_PUBLIC_GROQ_API_KEY in .env to enable the Groq fallback.
 * Get a FREE key at https://console.groq.com/keys
 */

import {
  generateCaption,
  generateWeeklyPlan as awsGenerateWeeklyPlan,
  transcribeVoiceNote,
  getUser,
} from '../aws/mediora.service';
import { parseJSONSafely } from './parser';
import { callGroqForJSON } from './groq.service';
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

/**
 * callGenerate — two-tier AI call:
 *  1. Tries AWS Bedrock via Lambda (primary)
 *  2. Falls back to Gemini 1.5 Flash if Bedrock throws
 */
async function callGenerate(userId: string, prompt: string, action = 'caption'): Promise<any> {
  // ── Tier 1: AWS Bedrock ───────────────────────────────────────────────────
  try {
    const result = await generateCaption({ userId, prompt, action } as any);
    // Bedrock succeeded — validate it returned something real
    const hasData = result && typeof result === 'object' && Object.keys(result).length > 0;
    if (hasData) {
      console.info(`[AI] Bedrock returned result for action=${action}`);
      return result;
    }
    throw new Error('Bedrock returned empty result');
  } catch (bedrockErr: any) {
    console.warn(`[AI] Bedrock unavailable for action=${action}:`, bedrockErr?.message ?? bedrockErr);
  }

  // ── Tier 2: Groq (Llama 3.3 70B) fallback ────────────────────────────────
  try {
    console.info(`[AI] Falling back to Groq for action=${action}`);
    const result = await callGroqForJSON(prompt);
    return result;
  } catch (groqErr: any) {
    console.error(`[AI] Groq fallback also failed for action=${action}:`, groqErr?.message ?? groqErr);
    throw new Error(
      `AI unavailable: both Bedrock and Groq failed. ` +
      `Set EXPO_PUBLIC_GROQ_API_KEY in .env for offline AI. ` +
      `Get a FREE key at https://console.groq.com/keys. ` +
      `Groq error: ${groqErr?.message ?? 'unknown'}`
    );
  }
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
 * @param userId    - Cognito userId (required for S3 path scoping).
 *
 * Throws with a descriptive message at each stage so callers can tell the user
 * exactly what went wrong (upload vs transcription vs empty result).
 */
export const transcribeAudio = async (audioUri: string, userId = 'anonymous'): Promise<string> => {
  if (!audioUri) {
    throw new Error('No audio URI provided for transcription');
  }

  // ── Stage 1: Get presigned upload URL ────────────────────────────────────
  let uploadData: { presignedUrl: string; fileKey: string };
  try {
    const { data } = await post<Record<string, string>, { presignedUrl: string; fileKey: string }>(
      '/upload',
      { userId, fileName: `recording_${Date.now()}.m4a`, fileType: 'audio/m4a', uploadType: 'voice', operation: 'upload' },
    );
    uploadData = data;
  } catch (e: any) {
    throw new Error(`[transcribeAudio] Failed to get upload URL: ${e?.message ?? e}`);
  }

  // ── Stage 2: Upload audio to S3 ──────────────────────────────────────────
  try {
    const fileRes = await fetch(audioUri);
    const blob = await fileRes.blob();
    const uploadRes = await fetch(uploadData.presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'audio/m4a' },
      body: blob,
    });
    if (!uploadRes.ok) {
      throw new Error(`S3 upload returned HTTP ${uploadRes.status}`);
    }
  } catch (e: any) {
    throw new Error(`[transcribeAudio] Failed to upload audio: ${e?.message ?? e}`);
  }

  // ── Stage 3: Transcribe via Lambda → Amazon Transcribe ───────────────────
  try {
    const result = await transcribeVoiceNote({ userId, s3AudioKey: uploadData.fileKey });
    if (!result?.transcript) {
      throw new Error('Transcription returned empty result');
    }
    return result.transcript;
  } catch (e: any) {
    throw new Error(`[transcribeAudio] Transcription failed: ${e?.message ?? e}`);
  }
};
