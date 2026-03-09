/**
 * lambda/transcribe/index.js
 *
 * AWS Lambda Handler — Amazon Transcribe (voice-to-text)
 * Routes: POST /transcribe
 *
 * Input body:
 *   { userId, s3AudioKey, language? }
 *   s3AudioKey: S3 key of the .m4a audio file (e.g. "voice-notes/userId/file.m4a")
 *   language:   optional BCP-47 hint e.g. "hi-IN", "en-US", "ta-IN" — omit for auto-detect
 *
 * Output body:
 *   { transcript, language }
 *
 * Runtime: Node.js 22.x
 * Timeout: 90s recommended (Transcribe jobs can take up to ~60s)
 * IAM permissions required:
 *   - transcribe:StartTranscriptionJob
 *   - transcribe:GetTranscriptionJob
 *   - s3:GetObject on arn:aws:s3:::mediora-storage/*
 *   - s3:PutObject on arn:aws:s3:::mediora-storage/transcripts/*
 */

import {
    TranscribeClient,
    StartTranscriptionJobCommand,
    GetTranscriptionJobCommand,
} from '@aws-sdk/client-transcribe';

const REGION = 'ap-south-1';
const BUCKET = 'mediora-storage';

const transcribe = new TranscribeClient({ region: REGION });

// ─── CORS headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
};

// ─── Transcribe helper ────────────────────────────────────────────────────────

async function runTranscribeJob(s3AudioKey, languageHint) {
    const jobName = `mediora-transcribe-${Date.now()}`;
    const mediaUri = `s3://${BUCKET}/${s3AudioKey}`;

    // Detect file format from key extension
    const ext = s3AudioKey.split('.').pop()?.toLowerCase() ?? 'm4a';
    const validFormats = ['mp3', 'mp4', 'wav', 'flac', 'ogg', 'm4a', 'webm', 'amr'];
    const mediaFormat = validFormats.includes(ext) ? ext : 'm4a';

    const startParams = {
        TranscriptionJobName: jobName,
        Media: { MediaFileUri: mediaUri },
        MediaFormat: mediaFormat,
        OutputBucketName: BUCKET,
        OutputKey: `transcripts/${jobName}.json`,
    };

    if (languageHint) {
        // Lock to a specific language
        startParams.LanguageCode = languageHint;
    } else {
        // Auto-detect from Hindi / English / Tamil
        startParams.IdentifyLanguage = true;
        startParams.LanguageOptions = ['en-US', 'hi-IN', 'ta-IN'];
    }

    console.log('[Transcribe] Starting job:', jobName, '| mediaFormat:', mediaFormat);
    await transcribe.send(new StartTranscriptionJobCommand(startParams));

    // Poll every 5s, up to 90s total (18 attempts)
    for (let i = 0; i < 18; i++) {
        await new Promise(r => setTimeout(r, 5000));

        const { TranscriptionJob } = await transcribe.send(
            new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
        );

        const status = TranscriptionJob?.TranscriptionJobStatus;
        console.log(`[Transcribe] Poll ${i + 1}/18 — status: ${status}`);

        if (status === 'COMPLETED') {
            const transcriptUri = TranscriptionJob.Transcript?.TranscriptFileUri;
            if (!transcriptUri) throw new Error('Transcription completed but no URI returned');

            const res = await fetch(transcriptUri);
            const json = await res.json();
            const text = json.results?.transcripts?.[0]?.transcript ?? '';
            const detectedLanguage = TranscriptionJob.LanguageCode ?? languageHint ?? 'en-US';

            console.log('[Transcribe] Completed. Language:', detectedLanguage, '| Length:', text.length);
            return { transcript: text, language: detectedLanguage };
        }

        if (status === 'FAILED') {
            throw new Error(`Transcribe job failed: ${TranscriptionJob?.FailureReason ?? 'unknown reason'}`);
        }
    }

    throw new Error('Transcribe job timed out after 90s — consider increasing Lambda timeout');
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    let body;
    try {
        body = JSON.parse(event.body ?? '{}');
    } catch {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
    }

    const { userId, s3AudioKey, language } = body;

    if (!userId) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`userId` is required' }) };
    if (!s3AudioKey) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`s3AudioKey` is required — upload the audio file first via POST /upload' }) };

    console.log(`[Handler] userId=${userId} s3AudioKey=${s3AudioKey} language=${language ?? 'auto'}`);

    try {
        const result = await runTranscribeJob(s3AudioKey, language ?? null);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };
    } catch (err) {
        console.error('[Handler] Transcribe error:', err.message);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Transcription failed', details: err.message }),
        };
    }
};
