/**
 * claude.service.ts
 *
 * Direct Claude Sonnet 3.5 v2 API client — used as the fallback AI when
 * AWS Bedrock is unavailable or not yet enabled.
 *
 * Uses the Anthropic Messages REST API (no SDK needed, works in Expo).
 * Set EXPO_PUBLIC_CLAUDE_API_KEY in your .env to enable this.
 */

import { parseJSONSafely } from './parser';

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? '';
const CLAUDE_MODEL = 'claude-sonnet-4-5';
const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

/**
 * callClaude — sends a prompt to Claude Sonnet 3.5 v2 and returns the text response.
 * Throws if the API key is missing or the request fails.
 */
export async function callClaude(prompt: string): Promise<string> {
    if (!CLAUDE_API_KEY) {
        throw new Error('EXPO_PUBLIC_CLAUDE_API_KEY is not set');
    }

    const response = await fetch(CLAUDE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const err = await response.text().catch(() => '');
        throw new Error(`Claude API error ${response.status}: ${err.slice(0, 200)}`);
    }

    const json = await response.json();
    const text: string = json?.content?.[0]?.text ?? '';

    if (!text) throw new Error('Claude returned an empty response');
    return text;
}

/**
 * callClaudeForJSON — calls Claude and parses the response as JSON.
 * Strips markdown code fences if Claude wraps the response in them.
 */
export async function callClaudeForJSON<T = any>(prompt: string): Promise<T> {
    const text = await callClaude(prompt);
    return parseJSONSafely<T>(text);
}
