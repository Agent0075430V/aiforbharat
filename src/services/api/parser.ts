/**
 * parser.ts
 *
 * Safely parses AI JSON responses.
 * Handles:
 *  - Markdown code fences (```json ... ```)
 *  - Truncated responses (auto-closes unbalanced braces/brackets)
 */

export function parseJSONSafely<T = any>(raw: string): T {
  // Strip markdown code fences if AI added them
  let clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Extract first JSON object or array found in the string
  const match = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) clean = match[0];

  // ── Attempt 1: Parse as-is ────────────────────────────────────────────────
  try {
    return JSON.parse(clean) as T;
  } catch (_) {
    // Fall through to recovery
  }

  // ── Attempt 2: Auto-close truncated JSON ──────────────────────────────────
  // If Groq hit a token limit and cut the response mid-way, we try to
  // close all unclosed braces/brackets so JSON.parse has a chance.
  try {
    const recovered = autoCloseJSON(clean);
    const parsed = JSON.parse(recovered) as T;
    console.warn('[parser] Recovered truncated JSON response (response was cut off by token limit).');
    return parsed;
  } catch (e) {
    // Nothing worked — log a useful excerpt and throw
    console.error('JSON parse failed. Raw:', clean.slice(0, 300));
    throw new Error('Failed to parse AI response as JSON');
  }
}

/**
 * autoCloseJSON — appends missing closing characters to a truncated JSON string.
 * Works by scanning char-by-char and tracking open braces/brackets/strings.
 */
function autoCloseJSON(s: string): string {
  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if (ch === '}' || ch === ']') stack.pop();
  }

  // If we ended mid-string, close the string first
  let result = s.trimEnd();
  if (inString) {
    // Remove any trailing partial escape char and close the string
    result = result.replace(/\\$/, '') + '"';
  }

  // Remove trailing commas before closing (invalid JSON)
  result = result.replace(/,\s*$/, '');

  // Append all missing closing chars in reverse stack order
  while (stack.length > 0) {
    result += stack.pop();
  }

  return result;
}
