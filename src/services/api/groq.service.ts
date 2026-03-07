/**
 * groq.service.ts
 *
 * Groq Cloud API client — used as the fallback AI when AWS Bedrock is
 * unavailable. Groq has a generous FREE tier with fast inference.
 *
 * Model: llama-3.3-70b-versatile (free, ~500 tokens/s)
 * API is OpenAI-compatible format.
 *
 * Get a FREE key at https://console.groq.com/keys
 * Set EXPO_PUBLIC_GROQ_API_KEY in your .env to enable this.
 */

import { parseJSONSafely } from './parser';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * callGroq — sends a prompt to Groq and returns the text response.
 * Throws if the API key is missing or the request fails.
 */
export async function callGroq(prompt: string): Promise<string> {
    if (!GROQ_API_KEY) {
        throw new Error('EXPO_PUBLIC_GROQ_API_KEY is not set');
    }

    const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.8,
            max_tokens: 2048,
        }),
    });

    if (!response.ok) {
        const err = await response.text().catch(() => '');
        throw new Error(`Groq API error ${response.status}: ${err.slice(0, 200)}`);
    }

    const json = await response.json();
    const text: string = json?.choices?.[0]?.message?.content ?? '';

    if (!text) throw new Error('Groq returned an empty response');
    return text;
}

/**
 * callGroqForJSON — calls Groq and parses the response as JSON.
 * Strips markdown code fences if the model wraps the response in them.
 */
export async function callGroqForJSON<T = any>(prompt: string): Promise<T> {
    const text = await callGroq(prompt);
    return parseJSONSafely<T>(text);
}
