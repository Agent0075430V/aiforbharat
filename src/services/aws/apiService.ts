/**
 * apiService.ts
 * Typed HTTP helper for all API Gateway calls.
 * Automatically attaches the Cognito JWT (if available) as a Bearer token.
 * Never exposes AWS credentials — all sensitive ops happen in Lambda.
 */

import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL =
    (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
    'https://5nkq4i9v6j.execute-api.ap-south-1.amazonaws.com';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
}

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly body?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString() ?? null;
    } catch {
        return null;
    }
}

async function buildHeaders(extra: Record<string, string> = {}): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...extra,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// ─── Public POST helper ───────────────────────────────────────────────────────

/**
 * post<TBody, TResponse>(path, body)
 *
 * @param path   - API Gateway path e.g. "/generate", "/user", "/upload"
 * @param body   - JSON-serialisable request body
 * @returns      - Parsed JSON response typed as TResponse
 */
export async function post<TBody, TResponse>(
    path: string,
    body: TBody,
): Promise<ApiResponse<TResponse>> {
    const url = `${API_BASE_URL}${path}`;
    const headers = await buildHeaders();

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(response.status, `API call to ${path} failed`, json);
    }

    return { data: json as TResponse, status: response.status };
}

/**
 * get<TResponse>(path)
 *
 * @param path - API Gateway path e.g. "/user?userId=xxx"
 */
export async function get<TResponse>(path: string): Promise<ApiResponse<TResponse>> {
    const url = `${API_BASE_URL}${path}`;
    const headers = await buildHeaders();

    const response = await fetch(url, { method: 'GET', headers });
    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(response.status, `API call to ${path} failed`, json);
    }

    return { data: json as TResponse, status: response.status };
}
