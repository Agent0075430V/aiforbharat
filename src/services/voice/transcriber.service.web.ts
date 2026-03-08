/**
 * transcriber.service.web.ts
 *
 * Web-specific transcription using Groq Whisper.
 * Automatically resolves instead of transcriber.service.ts on web builds.
 *
 * Key difference from native:
 *   - Native uses { uri: 'file://..' } React Native FormData syntax
 *   - Web fetches the blob:// URL then appends real Blob to FormData
 *
 * Skips AWS Transcribe — goes straight to Groq Whisper for low latency.
 */

const GROQ_WHISPER_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export const transcribeRecording = async (
    audioUri: string,
    _userId = 'anonymous',
): Promise<string> => {
    if (!audioUri) throw new Error('Voice transcription error: no audio URI provided.');

    // Read key lazily so Expo env is fully hydrated at call time
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY?.trim() ?? '';
    if (!apiKey) {
        throw new Error(
            'Voice transcription requires a Groq API key. ' +
            'Add EXPO_PUBLIC_GROQ_API_KEY to your .env file and restart.'
        );
    }

    // ── Step 1: Fetch the Blob from the blob:// URL ─────────────────────────
    let audioBlob: Blob;
    try {
        const res = await fetch(audioUri);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        audioBlob = await res.blob();
        URL.revokeObjectURL(audioUri); // free memory immediately after reading
    } catch (err: any) {
        throw new Error(
            `Voice transcription error: could not read recording. ${err?.message ?? err}`
        );
    }

    if (audioBlob.size < 500) {
        throw new Error(
            'Voice transcription error: recording is too short. Please hold the button and speak for at least one second.'
        );
    }

    console.info('[Transcriber/web] Blob:', audioBlob.size, 'bytes, type:', audioBlob.type);

    // ── Step 2: Build multipart form ─────────────────────────────────────────
    // IMPORTANT: Groq rejects 'audio/webm;codecs=opus' — strip to just 'audio/webm'
    // We override the MIME type by creating a new Blob with a clean type.
    const cleanMime = audioBlob.type.split(';')[0] || 'audio/webm';
    const cleanBlob = new Blob([audioBlob], { type: cleanMime });

    // Filename extension must match the format so Groq picks the right decoder
    const ext = cleanMime.includes('ogg') ? 'ogg' : 'webm';
    const filename = `voice.${ext}`;

    const form = new FormData();
    form.append('file', cleanBlob, filename);
    form.append('model', 'whisper-large-v3-turbo');
    form.append('response_format', 'json');
    // No language lock → auto-detect (works for Hindi, Hinglish, English)

    // ── Step 3: Send to Groq Whisper ─────────────────────────────────────────
    console.info('[Transcriber/web] Sending', cleanBlob.size, 'bytes as', filename);

    let res: Response;
    try {
        res = await fetch(GROQ_WHISPER_URL, {
            method: 'POST',
            headers: {
                // ⚠️ Do NOT set Content-Type — browser must set it with the correct boundary
                Authorization: `Bearer ${apiKey}`,
            },
            body: form,
        });
    } catch (netErr: any) {
        // Network error (offline, CORS, etc.)
        throw new Error(
            `Voice transcription error: network request failed. Check your internet connection. (${netErr?.message ?? netErr})`
        );
    }

    if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('[Transcriber/web] Groq error', res.status, errText.slice(0, 300));

        if (res.status === 400) {
            throw new Error(
                `Voice transcription error: audio format rejected by Groq (400). ` +
                `Details: ${errText.slice(0, 120)}`
            );
        }
        if (res.status === 401) {
            throw new Error('Voice transcription error: invalid Groq API key. Check EXPO_PUBLIC_GROQ_API_KEY in your .env.');
        }
        if (res.status === 429) {
            throw new Error('Voice transcription error: Groq rate limit reached. Please wait a moment and try again.');
        }
        throw new Error(`Voice transcription error: Groq returned HTTP ${res.status}.`);
    }

    const json = await res.json();
    const text: string = json?.text?.trim() ?? '';

    if (!text) {
        throw new Error('Voice transcription error: no speech detected. Please speak clearly near your microphone.');
    }

    console.info('[Transcriber/web] ✅ Transcribed:', text.slice(0, 60));
    return text;
};
