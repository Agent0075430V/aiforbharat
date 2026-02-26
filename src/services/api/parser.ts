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

  try {
    return JSON.parse(clean) as T;
  } catch (e) {
    console.error('JSON parse failed. Raw:', clean.slice(0, 200));
    throw new Error('Failed to parse AI response as JSON');
  }
}

