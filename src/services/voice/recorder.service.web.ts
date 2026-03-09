/**
 * recorder.service.web.ts
 *
 * Web-specific audio recorder using the browser's MediaRecorder API.
 * Metro automatically resolves this file instead of recorder.service.ts
 * when bundling for web (platform extension resolution).
 *
 * Produces a Blob URL (blob:http://...) that can be fetched by the web transcriber.
 */

export type RecordingStatus = 'idle' | 'recording' | 'stopped' | 'error';

export interface RecordingState {
    status: RecordingStatus;
    uri?: string;       // blob:// URL on web, file:// on native
    error?: string;
}

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let activeStream: MediaStream | null = null;

/** Pick the best supported MIME type for speech recording */
function getSupportedMimeType(): string {
    const candidates = [
        'audio/webm;codecs=opus', // Chrome, Edge — best speech quality
        'audio/webm',             // Chrome fallback
        'audio/ogg;codecs=opus',  // Firefox
        'audio/ogg',              // Firefox fallback
    ];
    return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}

export const startRecording = async (): Promise<RecordingState> => {
    // Kill any stale session first
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    activeStream?.getTracks().forEach((t) => t.stop());
    audioChunks = [];

    try {
        // 1. Request microphone
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,  // optimal for speech recognition
                echoCancellation: true,
                noiseSuppression: true,
            },
            video: false,
        });
        activeStream = stream;

        const mimeType = getSupportedMimeType();
        const options = mimeType ? { mimeType } : {};

        // 2. Create MediaRecorder
        mediaRecorder = new MediaRecorder(stream, options);
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunks.push(e.data);
        };

        // Collect data every 250ms for a smooth stream
        mediaRecorder.start(250);

        console.info('[Recorder/web] ✅ Recording started, mimeType:', mimeType || 'browser default');
        return { status: 'recording' };

    } catch (error: any) {
        console.warn('[Recorder/web] startRecording error:', error);
        activeStream = null;
        mediaRecorder = null;

        // Give the user a clear permission message
        const msg = error?.name === 'NotAllowedError'
            ? 'Microphone permission denied. Click the 🔒 icon in your browser address bar to allow it.'
            : (error?.message ?? 'Could not access the microphone');

        return { status: 'error', error: msg };
    }
};

export const stopRecording = async (): Promise<RecordingState> => {
    return new Promise((resolve) => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            resolve({ status: 'error', error: 'No active recording' });
            return;
        }

        mediaRecorder.onstop = () => {
            // Release microphone immediately
            activeStream?.getTracks().forEach((t) => t.stop());
            activeStream = null;

            if (audioChunks.length === 0) {
                mediaRecorder = null;
                resolve({ status: 'error', error: 'No audio data recorded' });
                return;
            }

            // Create a Blob URL — can be fetched like a normal URL in the browser
            const mimeType = mediaRecorder?.mimeType ?? 'audio/webm';
            const blob = new Blob(audioChunks, { type: mimeType });
            const uri = URL.createObjectURL(blob);

            audioChunks = [];
            mediaRecorder = null;

            console.info('[Recorder/web] ✅ Recording stopped, blob size:', blob.size, 'type:', mimeType);
            resolve({ status: 'stopped', uri });
        };

        mediaRecorder.stop();
    });
};

export const cancelRecording = async (): Promise<void> => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.ondataavailable = null;
        mediaRecorder.onstop = null;
        mediaRecorder.stop();
    }
    activeStream?.getTracks().forEach((t) => t.stop());
    activeStream = null;
    mediaRecorder = null;
    audioChunks = [];
};
