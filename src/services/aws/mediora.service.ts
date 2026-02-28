/**
 * mediora.service.ts
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Single entry-point for all AWS-backed features in Mediora  ║
 * ║  Import from here — never call apiService directly in UI.   ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { post, get } from './apiService';
import { getPresignedUrl as _getPresignedUrl, uploadFile as _uploadFile, UploadType } from './storageService';

// ─── Shared API paths ─────────────────────────────────────────────────────────

const PATHS = {
    generate: '/generate',
    user: '/user',
    upload: '/upload',
    transcribe: '/transcribe',
    weeklyPlan: '/weekly-plan',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ▌ Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface UserData {
    userId: string;
    name?: string;
    email?: string;
    niche?: string;
    /** e.g. "funny" | "educational" | "serious" | "relatable" */
    tone?: string;
    /** e.g. "en" | "hi" | "ta" | "mr" | "bn" */
    language?: string;
    /** Learned style parameters map */
    voiceProfile?: Record<string, unknown>;
    /** Up to 5 past captions used for few-shot prompting */
    pastPostSamples?: string[];
    /** Posts per week target */
    postingFrequency?: number;
}

export interface DraftData {
    userId: string;
    draftId: string;
    caption_en?: string;
    caption_hi?: string;
    caption_ta?: string;
    caption_mr?: string;
    caption_bn?: string;
    hashtags?: string[];
    script?: string;
    cta?: string;
    engagementScore?: number;
    platform?: string;
    format?: string;
    scheduledDate?: string;
    status?: 'draft' | 'scheduled' | 'posted';
}

export interface DraftRecord extends DraftData {
    createdAt: string;
}

export interface GenerateCaptionParams {
    userId: string;
    prompt: string;
    voiceProfile?: string;
    language?: string;
    /** S3 key of .m4a voice note to transcribe first */
    s3AudioKey?: string;
    platform?: string;
    format?: string;
    scheduledDate?: string;
}

export interface GenerateCaptionResult {
    draftId: string;
    caption_en: string;
    caption_hi: string;
    caption_ta: string;
    caption_mr: string;
    caption_bn: string;
    /** Kept as `caption` alias for backward compatibility */
    caption: string;
    hashtags: string[];
    script: string;
    cta: string;
    engagementScore: number;
}

export interface WeeklyPlanParams {
    userId: string;
    weekStartDate: string;
    postsPerWeek?: number;
}

export interface WeeklyPlanDay {
    date: string;
    draftId: string;
    caption_en: string;
    caption_hi: string;
    caption_ta: string;
    caption_mr: string;
    caption_bn: string;
    hashtags: string[];
    script: string;
    cta: string;
    engagementScore: number;
}

export interface WeeklyPlanResult {
    week: WeeklyPlanDay[];
}

export interface TranscribeParams {
    userId: string;
    s3AudioKey: string;
    /** BCP-47 language code hint e.g. "hi-IN", "en-US". Omit for auto-detect. */
    language?: string;
}

export interface TranscribeResult {
    transcript: string;
    language: string;
}

export interface PresignedUrlParams {
    userId: string;
    fileName: string;
    fileType: string;
    uploadType?: UploadType;
    operation?: 'upload' | 'download';
}

export interface PresignedUrlResult {
    presignedUrl: string;
    fileKey: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ▌ AI / Bedrock — Content Generation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * generateCaption
 * Calls POST /generate → Lambda → Bedrock (Claude 3.5 Sonnet v2)
 * Fetches user voice profile, generates multilingual content, saves draft automatically.
 */
export async function generateCaption(
    params: GenerateCaptionParams,
): Promise<GenerateCaptionResult> {
    const { data } = await post<GenerateCaptionParams, GenerateCaptionResult>(
        PATHS.generate,
        params,
    );
    // Provide `caption` alias pointing to English for backward compatibility
    return { ...data, caption: data.caption_en };
}

/**
 * generateWeeklyPlan
 * Calls POST /weekly-plan → Lambda → Bedrock (7x parallel calls)
 * Returns a full week of drafted content.
 */
export async function generateWeeklyPlan(
    params: WeeklyPlanParams,
): Promise<WeeklyPlanResult> {
    const { data } = await post<WeeklyPlanParams, WeeklyPlanResult>(
        PATHS.weeklyPlan,
        params,
    );
    return data;
}

/**
 * transcribeVoiceNote
 * Calls POST /transcribe → Lambda → Amazon Transcribe
 * Auto-detects Hindi/English/Tamil from a voice note already in S3.
 */
export async function transcribeVoiceNote(
    params: TranscribeParams,
): Promise<TranscribeResult> {
    const { data } = await post<TranscribeParams, TranscribeResult>(
        PATHS.transcribe,
        params,
    );
    return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ▌ User Profile — DynamoDB mediora-users
// ═══════════════════════════════════════════════════════════════════════════════

/** Upserts a user record in mediora-users */
export async function saveUser(userData: UserData): Promise<{ success: boolean }> {
    const { data } = await post<{ action: string } & UserData, { success: boolean }>(
        PATHS.user,
        { action: 'saveUser', ...userData },
    );
    return data;
}

/** Fetches a user record from mediora-users via GET /user?userId= */
export async function getUser(userId: string): Promise<UserData | null> {
    const { data } = await get<UserData | null>(`${PATHS.user}?userId=${encodeURIComponent(userId)}`);
    return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ▌ Drafts — DynamoDB mediora-drafts
// ═══════════════════════════════════════════════════════════════════════════════

/** Saves a content draft to mediora-drafts */
export async function saveDraft(draftData: DraftData): Promise<{ success: boolean }> {
    const { data } = await post<{ action: string } & DraftData, { success: boolean }>(
        PATHS.user,
        { action: 'saveDraft', ...draftData },
    );
    return data;
}

/** Retrieves all drafts for a user (newest first) */
export async function getDrafts(userId: string): Promise<DraftRecord[]> {
    const { data } = await post<{ action: string; userId: string }, DraftRecord[]>(
        PATHS.user,
        { action: 'getDrafts', userId },
    );
    return data;
}

/** Deletes a specific draft by userId + draftId */
export async function deleteDraft(
    userId: string,
    draftId: string,
): Promise<{ success: boolean }> {
    const { data } = await post<
        { action: string; userId: string; draftId: string },
        { success: boolean }
    >(PATHS.user, { action: 'deleteDraft', userId, draftId });
    return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ▌ Storage — S3 via presigned URLs
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * getPresignedUrl
 * Gets an S3 presigned URL from Lambda via POST /upload.
 * Returns { presignedUrl, fileKey }.
 */
export async function getPresignedUrl(
    params: PresignedUrlParams,
): Promise<PresignedUrlResult> {
    const { data } = await post<PresignedUrlParams, PresignedUrlResult>(
        PATHS.upload,
        {
            userId: params.userId,
            fileName: params.fileName,
            fileType: params.fileType,
            uploadType: params.uploadType ?? 'media',
            operation: params.operation ?? 'upload',
        },
    );
    return data;
}

/**
 * uploadVoiceRecording
 * Uploads a voice note to S3 under voice-notes/{userId}/ and returns the fileKey.
 * Pass the fileKey to transcribeVoiceNote() to get a transcript.
 */
export async function uploadVoiceRecording(
    userId: string,
    localUri: string,
    fileName: string,
): Promise<string> {
    const { fileKey } = await getPresignedUrl({ userId, fileName, fileType: 'audio/m4a', uploadType: 'voice' });
    await _uploadFile(localUri, fileName, 'audio/m4a', 'voice');
    return fileKey;
}

/**
 * uploadMediaFile
 * Uploads an image/video to S3 under past-posts/{userId}/.
 */
export async function uploadMediaFile(
    userId: string,
    localUri: string,
    fileName: string,
    mimeType: string,
): Promise<string> {
    return _uploadFile(localUri, fileName, mimeType, 'media');
}
