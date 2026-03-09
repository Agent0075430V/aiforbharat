/**
 * localIntent.service.ts
 *
 * Regex-based intent classifier that works 100% offline — no AI, no network.
 * Used as the primary intent parser so Voice AI works even when AWS is down.
 * The AI-based parseVoiceCommand() can optionally override this result.
 */

import type { CommandIntent } from '../../types/voice.types';

interface LocalParsedIntent {
    intent: CommandIntent;
    parameters: Record<string, string | number | boolean>;
    confidence: number;
}

// ─── Pattern banks ────────────────────────────────────────────────────────────

const CAPTION_PATTERNS = [
    /caption/i, /write.*post/i, /create.*post/i, /generate.*post/i,
    /write.*caption/i, /make.*caption/i, /post.*about/i, /content.*about/i,
];

const HASHTAG_PATTERNS = [
    /hashtag/i, /tags?/i, /hash/i, /#/,
];

const SCRIPT_PATTERNS = [
    /script/i, /reel.*script/i, /video.*script/i, /write.*reel/i,
    /hook.*body.*cta/i, /content.*script/i,
];

const WEEK_PLAN_PATTERNS = [
    /week.*plan/i, /plan.*week/i, /weekly/i, /content.*plan/i,
    /calendar.*plan/i, /schedule.*week/i, /7.*day/i,
];

const ANALYTICS_PATTERNS = [
    /analytics/i, /stats?/i, /performance/i, /views?/i, /reach/i,
    /engagement/i, /growth/i, /follower/i,
];

const BRAND_PATTERNS = [
    /brand/i, /deal/i, /collab/i, /partnership/i, /sponsor/i,
];

const NAVIGATE_PATTERNS = [
    /go to/i, /open/i, /take me to/i, /navigate/i, /show/i,
];

const PLATFORM_MAP: Record<string, string> = {
    instagram: 'instagram', insta: 'instagram',
    youtube: 'youtube', yt: 'youtube',
    tiktok: 'tiktok', 'tik tok': 'tiktok',
    linkedin: 'linkedin',
    twitter: 'twitter', x: 'twitter',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function matchesAny(text: string, patterns: RegExp[]): boolean {
    return patterns.some((p) => p.test(text));
}

function extractTopicAfterKeyword(transcript: string, keywords: string[]): string {
    for (const kw of keywords) {
        const re = new RegExp(`${kw}\\s+(?:for|about|on|regarding)?\\s*(.+)`, 'i');
        const m = transcript.match(re);
        if (m?.[1]) return m[1].trim().replace(/[.!?]+$/, '');
    }
    return '';
}

function extractPlatform(transcript: string): string | undefined {
    for (const [key, val] of Object.entries(PLATFORM_MAP)) {
        if (new RegExp(`\\b${key}\\b`, 'i').test(transcript)) return val;
    }
    return undefined;
}

// ─── Main classifier ──────────────────────────────────────────────────────────

export function classifyIntentLocally(transcript: string): LocalParsedIntent {
    const t = transcript.trim();

    if (!t) {
        return { intent: 'unknown', parameters: {}, confidence: 0 };
    }

    const platform = extractPlatform(t);
    const params: Record<string, string | number | boolean> = {};
    if (platform) params.platform = platform;

    // Caption generation
    if (matchesAny(t, CAPTION_PATTERNS)) {
        const topic = extractTopicAfterKeyword(t, ['caption', 'post', 'write', 'create', 'generate', 'about']);
        if (topic) params.topic = topic;
        return { intent: 'generate_captions', parameters: params, confidence: 0.85 };
    }

    // Hashtags
    if (matchesAny(t, HASHTAG_PATTERNS)) {
        const topic = extractTopicAfterKeyword(t, ['hashtag', 'tags', 'for', 'about']);
        if (topic) params.topic = topic;
        return { intent: 'generate_hashtags', parameters: params, confidence: 0.85 };
    }

    // Script
    if (matchesAny(t, SCRIPT_PATTERNS)) {
        const topic = extractTopicAfterKeyword(t, ['script', 'reel', 'video', 'about', 'for']);
        if (topic) params.topic = topic;
        return { intent: 'write_script', parameters: params, confidence: 0.85 };
    }

    // Weekly plan
    if (matchesAny(t, WEEK_PLAN_PATTERNS)) {
        return { intent: 'generate_week_plan', parameters: params, confidence: 0.85 };
    }

    // Analytics
    if (matchesAny(t, ANALYTICS_PATTERNS)) {
        return { intent: 'get_analytics', parameters: params, confidence: 0.8 };
    }

    // Brands
    if (matchesAny(t, BRAND_PATTERNS)) {
        return { intent: 'check_brands', parameters: params, confidence: 0.8 };
    }

    // Navigation
    if (matchesAny(t, NAVIGATE_PATTERNS)) {
        const screenMatch = t.match(/(?:go to|open|take me to|show)\s+(\w+)/i);
        if (screenMatch?.[1]) params.screen = screenMatch[1].toLowerCase();
        return { intent: 'navigate', parameters: params, confidence: 0.75 };
    }

    // Unknown
    return { intent: 'unknown', parameters: {}, confidence: 0.3 };
}
