const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            { text: '\n\n' + userPrompt },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.82,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join(' ') ??
    '';

  return text.trim();
}

export const geminiGenerateCaptions = async (prompt: string) =>
  callGemini(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    2500
  );

export const geminiGenerateWeeklyPlan = async (prompt: string) =>
  callGemini(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    3000
  );

export const geminiGenerateHashtags = async (prompt: string) =>
  callGemini(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    1000
  );

export const geminiGenerateScript = async (prompt: string) =>
  callGemini(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    2000
  );

export const geminiAnalyzeQuiz = async (prompt: string) =>
  callGemini(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    1000
  );

export const geminiParseVoiceIntent = async (prompt: string) =>
  callGemini(
    'You are Mediora AI voice parser. Always respond with valid JSON only.',
    prompt,
    500
  );

