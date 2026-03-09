/**
 * lambda/s3/index.js
 *
 * AWS Lambda Handler — S3 Presigned URL Generation
 * Routes: POST /upload
 *
 * Input body:
 *   { userId, fileName, fileType, uploadType, operation? }
 *   uploadType: "voice" | "media" | "avatar" | "export"
 *   operation:  "upload" (default) | "download"
 *
 * Output body:
 *   { presignedUrl, fileKey }
 *
 * Folder structure in mediora-storage:
 *   voice-notes/{userId}/{timestamp}_{hash}_{fileName}
 *   past-posts/{userId}/{timestamp}_{hash}_{fileName}
 *   exports/{userId}/{timestamp}_{hash}_{fileName}
 *   avatars/{userId}/{timestamp}_{hash}_{fileName}
 *
 * Runtime: Node.js 22.x
 * IAM permissions required:
 *   - s3:PutObject, s3:GetObject on arn:aws:s3:::mediora-storage/*
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash } from 'crypto';

const REGION = 'ap-south-1';
const BUCKET = 'mediora-storage';
const PUT_EXPIRES = 900;   // 15 minutes for upload
const GET_EXPIRES = 3600;  // 1 hour for download

const s3 = new S3Client({ region: REGION });

// ─── CORS headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
};

// ─── Map uploadType → S3 folder prefix ───────────────────────────────────────

const FOLDER_MAP = {
    voice: 'voice-notes',
    media: 'past-posts',
    avatar: 'avatars',
    export: 'exports',
};

// ─── Build a unique S3 key under userId-scoped folder ────────────────────────

function buildKey(uploadType, userId, fileName) {
    const folder = FOLDER_MAP[uploadType] ?? 'media';
    const timestamp = Date.now();
    const hash = createHash('md5').update(`${fileName}${timestamp}`).digest('hex').slice(0, 8);
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${folder}/${userId}/${timestamp}_${hash}_${safeName}`;
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

    const { userId, fileName, fileType, uploadType = 'media', operation = 'upload' } = body;

    if (!userId) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`userId` is required' }) };
    if (!fileName) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`fileName` is required' }) };
    if (!fileType) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '`fileType` is required' }) };

    const validTypes = ['voice', 'media', 'avatar', 'export'];
    if (!validTypes.includes(uploadType)) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: `uploadType must be one of: ${validTypes.join(', ')}` }),
        };
    }

    try {
        const fileKey = buildKey(uploadType, userId, fileName);

        let presignedUrl;
        if (operation === 'download') {
            const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: fileKey });
            presignedUrl = await getSignedUrl(s3, cmd, { expiresIn: GET_EXPIRES });
        } else {
            const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: fileKey, ContentType: fileType });
            presignedUrl = await getSignedUrl(s3, cmd, { expiresIn: PUT_EXPIRES });
        }

        console.log(`[S3] Generated ${operation} URL for key: ${fileKey}`);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ presignedUrl, fileKey }),
        };
    } catch (err) {
        console.error('[S3] Presign error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Failed to generate presigned URL', details: err.message }),
        };
    }
};
