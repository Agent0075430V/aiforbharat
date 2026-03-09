/**
 * speaker.service.web.ts  (web / browser)
 *
 * Uses the Web Speech API (window.speechSynthesis) instead of expo-speech.
 * In Chrome and Edge, Google's premium neural voices are available for free
 * and sound dramatically better than the device TTS.
 *
 * Voice priority order (most natural → fallback):
 *   1. Google UK English Female     — warm, clear British female (Chrome)
 *   2. Google US English            — natural American female  (Chrome)
 *   3. Microsoft Aria Online        — neural voice (Edge)
 *   4. Microsoft Jenny Online       — neural voice (Edge)
 *   5. Samantha / Alex              — macOS system voices
 *   6. Any English voice as fallback
 *
 * Tuning:
 *   rate  0.88 — measured pace, clear delivery
 *   pitch 0.95 — slightly warmer, less "computer-ish"
 */

export interface SpeakOptions {
    rate?: number;
    pitch?: number;
    language?: string;
}

/** Ordered list of preferred voice names — best first */
const PREFERRED_VOICE_NAMES = [
    // Chrome — Google neural voices (best quality, free)
    'Google UK English Female',
    'Google UK English Male',
    'Google US English',
    // Edge — Microsoft neural voices
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)',
    'Microsoft Sonia Online (Natural) - English (United Kingdom)',
    'Microsoft Mia Online (Natural) - English (United Kingdom)',
    // Safari / macOS
    'Samantha',
    'Alex',
    'Karen',
    // iOS
    'Siri Voice 1',
];

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

function pickVoice(): SpeechSynthesisVoice | null {
    if (cachedVoice !== undefined) return cachedVoice;

    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return (cachedVoice = null);
    }

    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null; // voices not loaded yet — will retry on speak()

    // 1. Check preferred list in order
    for (const name of PREFERRED_VOICE_NAMES) {
        const match = voices.find((v) => v.name === name);
        if (match) {
            console.info('[Speaker/web] Selected voice:', match.name);
            return (cachedVoice = match);
        }
    }

    // 2. Any English default voice
    const enDefault = voices.find((v) => v.default && v.lang.startsWith('en'));
    if (enDefault) return (cachedVoice = enDefault);

    // 3. Any English voice at all
    const anyEn = voices.find((v) => v.lang.startsWith('en'));
    return (cachedVoice = anyEn ?? null);
}

// Voices load asynchronously in some browsers — reset cache when they arrive
if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        cachedVoice = undefined; // force re-pick on next speak()
    };
}

export const speak = (text: string, options: SpeakOptions = {}): void => {
    if (!text?.trim()) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Voice selection (try again each time in case voices just loaded)
    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.lang = options.language ?? 'en-IN';
    utterance.rate = options.rate ?? 0.88;   // slightly slower = clearer delivery
    utterance.pitch = options.pitch ?? 0.95;   // slightly lower = warmer, less robotic
    utterance.volume = 1.0;

    // Chrome bug workaround: long utterances get cut off after ~15 seconds
    // Splitting on sentence boundaries prevents this
    if (text.length > 200) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
        sentences.forEach((sentence, i) => {
            const u = new SpeechSynthesisUtterance(sentence.trim());
            if (voice) u.voice = voice;
            u.lang = utterance.lang;
            u.rate = utterance.rate;
            u.pitch = utterance.pitch;
            u.volume = 1.0;
            // Small pause between sentences feels more natural
            if (i > 0) setTimeout(() => window.speechSynthesis.speak(u), i * 50);
            else window.speechSynthesis.speak(u);
        });
    } else {
        window.speechSynthesis.speak(utterance);
    }
};

export const stopSpeaking = (): void => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};
