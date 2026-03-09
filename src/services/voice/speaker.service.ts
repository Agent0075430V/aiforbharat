/**
 * speaker.service.ts  (native — Android & iOS)
 *
 * Uses expo-speech with optimised settings for a clearer, more natural sound.
 * Selects the best available voice on the device when possible.
 *
 * Tuning choices:
 *   rate  0.88 — slightly slower than default → evenly paced, easy to follow
 *   pitch 0.92 — slightly lower than default  → warmer, less robotic
 *
 * Voice priority (iOS / Android):
 *   iOS    → Samantha enhanced, or first en-IN / en-US enhanced voice
 *   Android→ Google enhanced voices when installed
 */

import * as Speech from 'expo-speech';

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  language?: string;
}

/** Cached best voice identifier — looked up once, reused on every call */
let cachedVoiceId: string | null | undefined = undefined; // undefined = not yet looked up

async function getBestVoice(): Promise<string | undefined> {
  if (cachedVoiceId !== undefined) {
    return cachedVoiceId ?? undefined;
  }

  try {
    const voices = await Speech.getAvailableVoicesAsync();

    // Priority list — most natural → fallback
    const preferred = [
      // iOS enhanced (highest quality)
      'com.apple.voice.enhanced.en-IN.Isha',
      'com.apple.voice.enhanced.en-US.Samantha',
      'com.apple.voice.enhanced.en-GB.Daniel',
      // iOS compact (still better than Android default)
      'com.apple.ttsbundle.Samantha-compact',
      'com.apple.ttsbundle.siri_female_en-IN_compact',
      // Android Google TTS enhanced
      'en-in-x-ene-network',
      'en-us-x-sfg-network',
      'en-gb-x-gbd-network',
    ];

    for (const id of preferred) {
      if (voices.some((v) => v.identifier === id)) {
        cachedVoiceId = id;
        console.info('[Speaker] Selected voice:', id);
        return id;
      }
    }

    // Fallback: any en-IN or en-US voice
    const fallback = voices.find(
      (v) => v.language?.startsWith('en-IN') || v.language?.startsWith('en-US')
    );
    cachedVoiceId = fallback?.identifier ?? null;
    return cachedVoiceId ?? undefined;
  } catch {
    cachedVoiceId = null;
    return undefined;
  }
}

export const speak = async (text: string, options: SpeakOptions = {}): Promise<void> => {
  if (!text?.trim()) return;

  Speech.stop();

  const voice = await getBestVoice();

  Speech.speak(text, {
    rate: options.rate ?? 0.88,     // slightly slower = clearer, easier to follow
    pitch: options.pitch ?? 0.92,   // slightly lower = warmer, less robotic
    language: options.language ?? 'en-IN',
    ...(voice ? { voice } : {}),
  });
};

export const stopSpeaking = (): void => {
  Speech.stop();
};
