/**
 * lambda/weeklyPlan/index.js
 *
 * AWS Lambda Handler — Weekly Content Plan Generator
 * Routes: POST /weekly-plan
 *
 * Input body:
 *   { userId, weekStartDate, postsPerWeek? }
 *   weekStartDate: ISO date string e.g. "2024-03-01"
 *   postsPerWeek:  number 1–7 (default 7)
 *
 * Output body:
 *   { week: [ { date, draftId, caption_en, caption_hi, caption_ta, caption_mr, caption_bn, hashtags, script, cta, engagementScore } ] }
 *
 * Runtime: Node.js 22.x
 * IAM permissions required:
 *   - bedrock:InvokeModel on anthropic.claude-3-5-sonnet-20241022-v2:0
 *   - translate:TranslateText
 *   - dynamodb:GetItem on mediora-users
 *   - dynamodb:PutItem on mediora-drafts
 */

import {
    BedrockRuntimeClient,
    ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const REGION = 'ap-south-1';
// APAC cross-region inference profile — confirmed Active in ap-south-1 (Mumbai)
// ARN: arn:aws:bedrock:ap-south-1:318276049767:inference-profile/apac.anthropic.claude-3-5-sonnet-20241022-v2:0
const MODEL_ID = 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0';
const USERS_TABLE = 'mediora-users';
const DRAFTS_TABLE = 'mediora-drafts';

const bedrock = new BedrockRuntimeClient({ region: REGION });
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

function parseJSON(raw) {
    try { return JSON.parse(raw); } catch (_) {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) { try { return JSON.parse(match[1]); } catch (_) { } }
        return null;
    }
}

/** Add N days to an ISO date string */
function addDays(dateStr, n) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
}

/** Day of week label for a date string */
function dayLabel(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
}

async function fetchUser(userId) {
    try {
        const result = await dynamo.send(new GetCommand({ TableName: USERS_TABLE, Key: { userId } }));
        return result.Item ?? null;
    } catch (_) { return null; }
}

async function translateCaption(text, targets) {
    const results = {};
    await Promise.allSettled(targets.map(async (lang) => {
        try {
            const { TranslatedText } = await translate.send(new TranslateTextCommand({
                Text: text,
                SourceLanguageCode: 'en',
                TargetLanguageCode: lang,
            }));
            results[lang] = TranslatedText ?? text;
        } catch (_) { results[lang] = text; }
    }));
    return results;
}

// ─── Generate one day's content via Bedrock ───────────────────────────────────

async function generateDayContent(user, date, dayIndex) {
    const niche = user?.niche ?? 'general';
    const tone = user?.tone ?? 'engaging';
    const samples = Array.isArray(user?.pastPostSamples) && user.pastPostSamples.length
        ? `\nCreator style examples:\n${user.pastPostSamples.map((s, i) => `${i + 1}. "${s}"`).join('\n')}`
        : '';

    const dayName = dayLabel(date);
    const system = `You are Mediora AI, a social media content strategist.
Creator niche: ${niche} | Tone: ${tone}
${samples}

Generate content for ${dayName} (Day ${dayIndex + 1} of a weekly content plan).
Vary the content theme/angle from previous days to keep the feed fresh.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "caption": "<engaging English caption>",
  "hashtags": ["<tag1>", "<tag2>"],
  "script": "<short voiceover script>",
  "cta": "<call-to-action>",
  "engagementScore": <1-10>
}`;

    const command = new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: system }],
        messages: [{ role: 'user', content: [{ text: `Generate ${dayName} content for a ${niche} creator.` }] }],
        inferenceConfig: { maxTokens: 800, temperature: 0.8 },
    });

    const response = await bedrock.send(command);
    const raw = response.output?.message?.content?.[0]?.text ?? '{}';
    return parseJSON(raw);
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
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const { userId, weekStartDate, postsPerWeek = 7 } = body;

    if (!userId) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`userId` is required' }) };
    if (!weekStartDate) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`weekStartDate` is required (ISO date string)' }) };

    const count = Math.min(Math.max(Number(postsPerWeek) || 7, 1), 7);

    console.log(`[WeeklyPlan] userId=${userId} weekStart=${weekStartDate} posts=${count}`);

    try {
        const user = await fetchUser(userId);

        // Generate all days in parallel
        const dates = Array.from({ length: count }, (_, i) => addDays(weekStartDate, i));
        const results = await Promise.allSettled(
            dates.map((date, i) => generateDayContent(user, date, i))
        );

        const week = [];
        const now = new Date().toISOString();

        await Promise.allSettled(results.map(async (result, i) => {
            const date = dates[i];
            const parsed = result.status === 'fulfilled' ? result.value : null;

            const caption_en = parsed?.caption ?? '';
            const hashtags = Array.isArray(parsed?.hashtags) ? parsed.hashtags : [];
            const script = parsed?.script ?? '';
            const cta = parsed?.cta ?? '';
            const engagementScore = typeof parsed?.engagementScore === 'number' ? parsed.engagementScore : 7;

            // Translate
            const translations = await translateCaption(caption_en, ['hi', 'ta', 'mr', 'bn']);

            const draftId = randomUUID();
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
                platform: 'instagram',
                format: 'reel',
                scheduledDate: date,
                status: 'draft',
                createdAt: now,
            };

            try {
                await dynamo.send(new PutCommand({ TableName: DRAFTS_TABLE, Item: draftItem }));
                console.log(`[WeeklyPlan] Saved draft for ${date}: ${draftId}`);
            } catch (e) {
                console.error(`[WeeklyPlan] Failed to save draft for ${date}:`, e.message);
            }

            week.push({
                date,
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
        }));

        // Sort by date
        week.sort((a, b) => a.date.localeCompare(b.date));

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ week }),
        };
    } catch (err) {
        console.error('[WeeklyPlan] Error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Weekly plan generation failed', details: err.message }),
        };
    }
};
