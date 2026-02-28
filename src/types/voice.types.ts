export type VoiceState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'responding'
  | 'error';

export type CommandIntent =
  | 'generate_captions'
  | 'generate_hashtags'
  | 'write_script'
  | 'generate_week_plan'
  | 'schedule_post'
  | 'check_calendar'
  | 'get_analytics'
  | 'check_brands'
  | 'generate_media_kit'
  | 'save_draft'
  | 'navigate'
  | 'improve_caption'
  | 'unknown';

export interface ParsedCommand {
  intent: CommandIntent;
  parameters: Record<string, string | number | boolean>;
  rawTranscript: string;
  confidence: number;
}

export interface VoiceCommandRecord {
  id: string;
  transcript: string;
  intent: CommandIntent;
  response: string;
  timestamp: string;
  wasSuccessful: boolean;
}

