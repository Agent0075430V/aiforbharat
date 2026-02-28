/**
 * lambda/bedrock/index.js
 *
 * AWS Lambda Handler — Bedrock AI Generation + Transcribe + Translate
 * Routes: POST /generate   POST /transcribe
 *
 * Input (generate):
 *   { userId, prompt, voiceProfile?, language?, s3AudioKey? }
 *
 * Input (transcribe):
 *   { userId, s3AudioKey, language? }
 *
 * Output (generate):
 *   { caption_en, caption_hi, caption_ta, caption_mr, caption_bn,
 *     hashtags, script, cta, engagementScore, draftId }
 *
 * Output (transcribe):
 *   { transcript, language }
 *
 * Runtime: Node.js 22.x
 * IAM permissions required:
 *   - bedrock:InvokeModel on anthropic.claude-3-5-sonnet-20241022-v2:0
 *   - transcribe:StartTranscriptionJob, transcribe:GetTranscriptionJob
 *   - translate:TranslateText
 *   - dynamodb:GetItem, PutItem on mediora-users, mediora-drafts
 *   - s3:GetObject on mediora-storage
 */

import {
    BedrockRuntimeClient,
    ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
    TranscribeClient,
    StartTranscriptionJobCommand,
    GetTranscriptionJobCommand,
} from '@aws-sdk/client-transcribe';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

// ─── Constants ────────────────────────────────────────────────────────────────

const REGION = 'ap-south-1';
const MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
const BUCKET = 'mediora-storage';
const USERS_TABLE = 'mediora-users';
const DRAFTS_TABLE = 'mediora-drafts';

// ─── AWS Clients ──────────────────────────────────────────────────────────────

const bedrock = new BedrockRuntimeClient({ region: REGION });
const transcribe = new TranscribeClient({ region: REGION });
const translate = new TranslateClient({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// ─── CORS headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ok(body) { return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(body) }; }
function err(code, message, details) {
    return { statusCode: code, headers: CORS_HEADERS, body: JSON.stringify({ error: message, details }) };
}

/** Safely parse JSON from Claude's response, stripping markdown code blocks if needed */
function parseJSON(raw) {
    try { return JSON.parse(raw); } catch (_) {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) {
            try { return JSON.parse(match[1]); } catch (_) { }
        }
        return null;
    }
}

// ─── DynamoDB helpers ─────────────────────────────────────────────────────────

async function fetchUser(userId) {
    try {
        const result = await dynamo.send(new GetCommand({ TableName: USERS_TABLE, Key: { userId } }));
        return result.Item ?? null;
    } catch (e) {
        console.error('[DynamoDB] fetchUser error:', e.message);
        return null;
    }
}

async function saveDraft(draft) {
    await dynamo.send(new PutCommand({ TableName: DRAFTS_TABLE, Item: draft }));
}

// ─── Transcribe helpers ───────────────────────────────────────────────────────

/** Start an Amazon Transcribe job for an .m4a file already in S3 */
async function runTranscribeJob(s3AudioKey, languageHint) {
    const jobName = `mediora-${Date.now()}`;
    const mediaUri = `s3://${BUCKET}/${s3AudioKey}`;

    const startParams = {
        TranscriptionJobName: jobName,
        Media: { MediaFileUri: mediaUri },
        MediaFormat: 'm4a',
        OutputBucketName: BUCKET,
        OutputKey: `transcripts/${jobName}.json`,
    };

    // Auto-detect or lock to a language
    if (languageHint) {
        startParams.LanguageCode = languageHint; // e.g. 'en-US', 'hi-IN', 'ta-IN'
    } else {
        startParams.IdentifyLanguage = true;
        startParams.LanguageOptions = ['en-US', 'hi-IN', 'ta-IN'];
    }

    console.log('[Transcribe] Starting job:', jobName);
    await transcribe.send(new StartTranscriptionJobCommand(startParams));

    // Poll until complete (max 90s)
    for (let i = 0; i < 18; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const { TranscriptionJob } = await transcribe.send(
            new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
        );
        const status = TranscriptionJob?.TranscriptionJobStatus;
        console.log(`[Transcribe] Poll ${i + 1}/18 — status: ${status}`);

        if (status === 'COMPLETED') {
            // Fetch transcript JSON from S3
            const transcriptUri = TranscriptionJob.Transcript?.TranscriptFileUri;
            if (!transcriptUri) throw new Error('No transcript URI returned');
            const res = await fetch(transcriptUri);
            const json = await res.json();
            const text = json.results?.transcripts?.[0]?.transcript ?? '';
            const detectedLang = TranscriptionJob.LanguageCode ?? 'en-US';
            return { transcript: text, language: detectedLang };
        }

        if (status === 'FAILED') {
            throw new Error(`Transcribe job failed: ${TranscriptionJob?.FailureReason ?? 'unknown'}`);
        }
    }

    throw new Error('Transcribe job timed out after 90s');
}

// ─── Translate helpers ────────────────────────────────────────────────────────

/** Translate text to multiple target languages */
async function translateCaption(text, targetLanguages) {
    const results = {};
    await Promise.allSettled(
        targetLanguages.map(async (lang) => {
            try {
                const { TranslatedText } = await translate.send(new TranslateTextCommand({
                    Text: text,
                    SourceLanguageCode: 'en',
                    TargetLanguageCode: lang,
                }));
                results[lang] = TranslatedText ?? text;
            } catch (e) {
                console.error(`[Translate] Failed for ${lang}:`, e.message);
                results[lang] = text; // fallback to English
            }
        })
    );
    return results;
}

// ─── Bedrock system prompt builder ────────────────────────────────────────────

function buildSystemPrompt(user) {
    const niche = user?.niche ?? 'general';
    const tone = user?.tone ?? 'engaging';
    const language = user?.language ?? 'en';
    const voice = user?.voiceProfile ? JSON.stringify(user.voiceProfile) : 'neutral';

    const samples = Array.isArray(user?.pastPostSamples) && user.pastPostSamples.length > 0
        ? `\nHere are example captions from this creator (match their style):\n${user.pastPostSamples.map((s, i) => `${i + 1}. "${s}"`).join('\n')}`
        : '';

    return `You are Mediora AI, a professional social media content strategist.
Creator niche: ${niche}
Creator tone: ${tone}
Preferred language: ${language}
Voice profile: ${voice}
${samples}

Always respond with a valid JSON object only (no markdown, no code blocks):
{
  "caption": "<engaging English caption>",
  "hashtags": ["<tag1>", "<tag2>", ...],
  "script": "<short voiceover script in English>",
  "cta": "<call-to-action phrase>",
  "engagementScore": <number 1-10>
}`;
}

// ─── /generate handler ────────────────────────────────────────────────────────

async function handleGenerate(body) {
    const { userId, prompt, s3AudioKey } = body;

    if (!userId) return err(400, '`userId` is required');

    let finalPrompt = prompt;

    // If a voice note S3 key is provided, transcribe it first
    if (s3AudioKey) {
        console.log('[Generate] Transcribing audio before generation:', s3AudioKey);
        const { transcript } = await runTranscribeJob(s3AudioKey, null);
        finalPrompt = transcript;
        console.log('[Generate] Transcript:', transcript.slice(0, 100));
    }

    if (!finalPrompt || typeof finalPrompt !== 'string') {
        return err(400, '`prompt` is required (or provide `s3AudioKey` for voice input)');
    }

    // Fetch user profile for few-shot voice matching
    const user = await fetchUser(userId);
    console.log('[Generate] User profile fetched:', !!user);

    // Call Bedrock
    const command = new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: buildSystemPrompt(user) }],
        messages: [{ role: 'user', content: [{ text: finalPrompt }] }],
        inferenceConfig: { maxTokens: 1500, temperature: 0.75 },
    });

    console.log('[Bedrock] Invoking model:', MODEL_ID);
    const response = await bedrock.send(command);
    const rawText = response.output?.message?.content?.[0]?.text ?? '{}';
    console.log('[Bedrock] Raw response length:', rawText.length);

    const parsed = parseJSON(rawText);
    if (!parsed) return err(500, 'Failed to parse Bedrock response', rawText.slice(0, 200));

    const caption_en = parsed.caption ?? '';
    const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];
    const script = parsed.script ?? '';
    const cta = parsed.cta ?? '';
    const engagementScore = typeof parsed.engagementScore === 'number' ? parsed.engagementScore : 7;

    // Translate caption to regional languages
    console.log('[Translate] Translating caption to hi, ta, mr, bn');
    const translations = await translateCaption(caption_en, ['hi', 'ta', 'mr', 'bn']);

    // Save draft to DynamoDB
    const draftId = randomUUID();
    const now = new Date().toISOString();
    const draftItem = {
        userId,
        draftId,
        caption_en,
        caption_hi: translations['hi'] ?? caption_en,
        caption_ta: translations['ta'] ?? caption_en,
        caption_mr: translations['mr'] ?? caption_en,
        caption_bn: translations['bn'] ?? caption_en,
        hashtags,
        script,
        cta,
        engagementScore,
        platform: body.platform ?? 'instagram',
        format: body.format ?? 'reel',
        scheduledDate: body.scheduledDate ?? '',
        status: 'draft',
        createdAt: now,
    };

    console.log('[DynamoDB] Saving draft:', draftId);
    await saveDraft(draftItem);

    return ok({
        draftId,
        caption_en,
        caption_hi: draftItem.caption_hi,
        caption_ta: draftItem.caption_ta,
        caption_mr: draftItem.caption_mr,
        caption_bn: draftItem.caption_bn,
        hashtags,
        script,
        cta,
        engagementScore,
    });
}

// ─── /transcribe handler ──────────────────────────────────────────────────────

async function handleTranscribe(body) {
    const { s3AudioKey, language } = body;
    if (!s3AudioKey) return err(400, '`s3AudioKey` is required');

    console.log('[Transcribe] Standalone transcription request:', s3AudioKey);
    const { transcript, language: detectedLang } = await runTranscribeJob(s3AudioKey, language ?? null);
    return ok({ transcript, language: detectedLang });
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    let body;
    try {
        body = JSON.parse(event.body ?? '{}');
    } catch {
        return err(400, 'Invalid JSON body');
    }

    // Route by path or explicit `action` field
    const path = event.path ?? event.rawPath ?? '';
    const action = body.action ?? (path.includes('/transcribe') ? 'transcribe' : 'generate');

    console.log(`[Handler] action=${action} path=${path}`);

    try {
        if (action === 'transcribe') return await handleTranscribe(body);
        return await handleGenerate(body);
    } catch (e) {
        console.error('[Handler] Unhandled error:', e);
        return err(500, 'Internal server error', e.message);
    }
};
