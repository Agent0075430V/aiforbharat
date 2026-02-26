const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  const key = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not configured');

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.82,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export const groqGenerateCaptions = async (prompt: string) =>
  callGroq(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    2500
  );

export const groqGenerateWeeklyPlan = async (prompt: string) =>
  callGroq(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    3000
  );

export const groqGenerateHashtags = async (prompt: string) =>
  callGroq(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    1000
  );

export const groqGenerateScript = async (prompt: string) =>
  callGroq(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    2000
  );

export const groqAnalyzeQuiz = async (prompt: string) =>
  callGroq(
    'You are Mediora AI. Always respond with valid JSON only. No markdown.',
    prompt,
    1000
  );

export const groqParseVoiceIntent = async (prompt: string) =>
  callGroq(
    'You are Mediora AI voice parser. Always respond with valid JSON only.',
    prompt,
    500
  );

// Groq Whisper — FREE voice transcription
export const groqTranscribeAudio = async (audioUri: string): Promise<string> => {
  const key = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not configured');

  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as any);
  formData.append('model', 'whisper-large-v3');
  formData.append('language', 'en');
  formData.append('response_format', 'text');

  const res = await fetch(
    'https://api.groq.com/openai/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: formData,
    }
  );

  if (!res.ok) throw new Error(`Whisper API error: ${res.status}`);
  return await res.text();
};

