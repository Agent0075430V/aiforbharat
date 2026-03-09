/**
 * lambda/dynamo/index.js
 *
 * AWS Lambda Handler — DynamoDB CRUD
 * Routes: POST /user
 *
 * Supported actions (passed in the request body as `action`):
 *   getUser        → GET  mediora-users item by userId
 *   saveUser       → PUT  mediora-users item (full schema)
 *   saveDraft      → PUT  mediora-drafts item (full new schema)
 *   getDrafts      → GET  all drafts for a userId (newest first)
 *   deleteDraft    → DELETE a specific draft by userId + draftId
 *
 * Runtime: Node.js 22.x
 * IAM permissions required:
 *   - dynamodb:GetItem, PutItem, UpdateItem, DeleteItem, Query
 *     on arn:aws:dynamodb:ap-south-1:*:table/mediora-users
 *     on arn:aws:dynamodb:ap-south-1:*:table/mediora-drafts
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-south-1';
const USERS_TABLE = 'mediora-users';
const DRAFTS_TABLE = 'mediora-drafts';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// ─── CORS headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
};

// ─── Action handlers ──────────────────────────────────────────────────────────

async function getUser(userId) {
    const result = await dynamo.send(
        new GetCommand({ TableName: USERS_TABLE, Key: { userId } }),
    );
    return result.Item ?? null;
}

async function saveUser(payload) {
    const {
        userId, name, email, niche, tone, language,
        voiceProfile, pastPostSamples, postingFrequency,
    } = payload;
    if (!userId) throw new Error('userId is required');

    const now = new Date().toISOString();

    // Fetch existing to preserve createdAt
    let createdAt = now;
    try {
        const existing = await dynamo.send(new GetCommand({ TableName: USERS_TABLE, Key: { userId } }));
        if (existing.Item?.createdAt) createdAt = existing.Item.createdAt;
    } catch (_) { }

    await dynamo.send(
        new PutCommand({
            TableName: USERS_TABLE,
            Item: {
                userId,
                name: name ?? '',
                email: email ?? '',
                niche: niche ?? '',
                tone: tone ?? 'engaging',
                language: language ?? 'en',
                voiceProfile: voiceProfile ?? {},
                pastPostSamples: Array.isArray(pastPostSamples) ? pastPostSamples.slice(0, 5) : [],
                postingFrequency: typeof postingFrequency === 'number' ? postingFrequency : 3,
                createdAt,
                updatedAt: now,
            },
        }),
    );
    return { success: true };
}

async function saveDraft(payload) {
    const {
        userId, draftId, caption_en, caption_hi, caption_ta, caption_mr, caption_bn,
        hashtags, script, cta, engagementScore,
        platform, format, scheduledDate, status,
    } = payload;
    if (!userId || !draftId) throw new Error('userId and draftId are required');

    await dynamo.send(
        new PutCommand({
            TableName: DRAFTS_TABLE,
            Item: {
                userId,
                draftId,
                caption_en: caption_en ?? '',
                caption_hi: caption_hi ?? '',
                caption_ta: caption_ta ?? '',
                caption_mr: caption_mr ?? '',
                caption_bn: caption_bn ?? '',
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                script: script ?? '',
                cta: cta ?? '',
                engagementScore: typeof engagementScore === 'number' ? engagementScore : 0,
                platform: platform ?? 'instagram',
                format: format ?? 'reel',
                scheduledDate: scheduledDate ?? '',
                status: status ?? 'draft',
                createdAt: new Date().toISOString(),
            },
        }),
    );
    return { success: true };
}

async function getDrafts(userId) {
    if (!userId) throw new Error('userId is required');

    const result = await dynamo.send(
        new QueryCommand({
            TableName: DRAFTS_TABLE,
            KeyConditionExpression: 'userId = :uid',
            ExpressionAttributeValues: { ':uid': userId },
            ScanIndexForward: false, // newest first
        }),
    );
    return result.Items ?? [];
}

async function deleteDraft(userId, draftId) {
    if (!userId || !draftId) throw new Error('userId and draftId are required');

    await dynamo.send(
        new DeleteCommand({
            TableName: DRAFTS_TABLE,
            Key: { userId, draftId },
        }),
    );
    return { success: true };
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

    const { action, ...payload } = body;

    try {
        let result;

        switch (action) {
            case 'getUser':
                result = await getUser(payload.userId);
                break;
            case 'saveUser':
                result = await saveUser(payload);
                break;
            case 'saveDraft':
                result = await saveDraft(payload);
                break;
            case 'getDrafts':
                result = await getDrafts(payload.userId);
                break;
            case 'deleteDraft':
                result = await deleteDraft(payload.userId, payload.draftId);
                break;
            default:
                return {
                    statusCode: 400,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ error: `Unknown action: "${action}"` }),
                };
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };
    } catch (err) {
        console.error('DynamoDB error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'DynamoDB operation failed', details: err.message }),
        };
    }
};
