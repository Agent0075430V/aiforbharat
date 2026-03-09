/**
 * transcriber.service.ts
 *
 * Two-tier transcription strategy:
 *   1. Primary:  AWS Transcribe via Lambda  (EXPO_PUBLIC_API_URL)
 *   2. Fallback: Groq Whisper-large-v3-turbo (EXPO_PUBLIC_GROQ_API_KEY)
 *
 * API key is read lazily inside functions — NOT at module-load time —
 * so Expo's env is fully initialised before we check it.
 */

import { transcribeAudio } from '../api';

const GROQ_WHISPER_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

/**
 * transcribeWithGroqWhisper
 *
 * Sends the audio file directly to Groq's Whisper endpoint.
 *
 * ⚠️  React Native FormData file attachment rules:
 *   - Use { uri, type, name } object — NOT a Blob fetched from a file:// URI.
 *   - DO NOT set Content-Type manually — fetch sets it with the correct multipart boundary.
 *   - DO NOT pre-fetch / read the file — pass the URI directly.
 */
async function transcribeWithGroqWhisper(audioUri: string): Promise<string> {
  // Read key lazily so Expo env is fully hydrated
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY?.trim() ?? '';
  if (!apiKey) throw new Error('EXPO_PUBLIC_GROQ_API_KEY is not configured');

  // Build multipart form — React Native style (uri object, not Blob)
  const form = new FormData();
  form.append('file', {
    uri: audioUri,          // file:/// path from expo-av
    type: 'audio/m4a',     // MIME type of the recording
    name: 'recording.m4a', // filename Groq sees
  } as any);
  form.append('model', 'whisper-large-v3-turbo'); // fastest Groq Whisper model, free tier
  form.append('response_format', 'json');
  // Omit 'language' — let Groq auto-detect (works for Hindi, Hinglish, English)

  console.info('[Transcriber] Sending audio to Groq Whisper…');

  const res = await fetch(GROQ_WHISPER_URL, {
    method: 'POST',
    headers: {
      // Authorization only — Content-Type must NOT be set manually
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[Transcriber] Groq Whisper HTTP error:', res.status, errText.slice(0, 300));
    throw new Error(`Groq Whisper HTTP ${res.status}: ${errText.slice(0, 100)}`);
  }

  const json = await res.json();
  const text: string = json?.text ?? '';

  if (!text.trim()) throw new Error('Groq Whisper returned an empty transcript');

  console.info('[Transcriber] Groq Whisper OK — transcript length:', text.length);
  return text.trim();
}

/**
 * transcribeRecording — public entry point used by VoiceAgentScreen.
 *
 * Tier 1: AWS Transcribe via Lambda
 * Tier 2: Groq Whisper (free, fast, multilingual)
 */
export const transcribeRecording = async (
  audioUri: string,
  userId = 'anonymous',
): Promise<string> => {
  if (!audioUri) throw new Error('No audio URI provided for transcription');

  // ── Tier 1: AWS Transcribe ─────────────────────────────────────────────────
  try {
    const transcript = await transcribeAudio(audioUri, userId);
    if (transcript?.trim()) {
      console.info('[Transcriber] ✅ AWS Transcribe succeeded');
      return transcript.trim();
    }
    throw new Error('AWS returned empty transcript');
  } catch (awsErr: any) {
    console.warn(
      '[Transcriber] AWS Transcribe failed, falling back to Groq Whisper:',
      awsErr?.message ?? awsErr,
    );
  }

  // ── Tier 2: Groq Whisper ───────────────────────────────────────────────────
  const transcript = await transcribeWithGroqWhisper(audioUri);
  // If this throws, the error propagates to the caller with a meaningful message
  return transcript;
};
