/**
 * gemini.service.ts
 *
 * Direct Gemini 1.5 Flash API client — used as the fallback AI when
 * AWS Bedrock is unavailable or not yet enabled.
 *
 * Uses the free Gemini REST API (no SDK needed, works in Expo).
 * Set EXPO_PUBLIC_GEMINI_API_KEY in your .env to enable this.
 */

import { parseJSONSafely } from './parser';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * callGemini — sends a prompt to Gemini 1.5 Flash and returns the text response.
 * Throws if the API key is missing or the request fails.
 */
export async function callGemini(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set');
    }

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 4096,
                responseMimeType: 'application/json',
            },
        }),
    });

    if (!response.ok) {
        const err = await response.text().catch(() => '');
        throw new Error(`Gemini API error ${response.status}: ${err.slice(0, 200)}`);
    }

    const json = await response.json();
    const text: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) throw new Error('Gemini returned an empty response');
    return text;
}

/**
 * callGeminiForJSON — calls Gemini and parses the response as JSON.
 * Strips markdown code fences if Gemini adds them.
 */
export async function callGeminiForJSON<T = any>(prompt: string): Promise<T> {
    const text = await callGemini(prompt);
    return parseJSONSafely<T>(text);
}
