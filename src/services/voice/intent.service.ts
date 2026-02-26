import type { ParsedCommand } from '../../types/voice.types';
import { parseVoiceCommand } from '../api';

export const interpretVoiceTranscript = async (
  transcript: string
): Promise<ParsedCommand> => {
  if (!transcript || !transcript.trim()) {
    return {
      intent: 'unknown',
      parameters: {},
      rawTranscript: transcript,
      confidence: 0,
    };
  }

  const result = await parseVoiceCommand(transcript.trim());

  return {
    intent: result.intent,
    parameters: result.parameters ?? {},
    rawTranscript: transcript,
    confidence: typeof result.confidence === 'number' ? result.confidence : 0.8,
  };
};

