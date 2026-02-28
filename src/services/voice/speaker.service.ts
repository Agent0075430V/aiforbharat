import * as Speech from 'expo-speech';

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  language?: string;
}

export const speak = (text: string, options: SpeakOptions = {}) => {
  if (!text?.trim()) return;

  Speech.stop();
  Speech.speak(text, {
    rate: options.rate ?? 1.0,
    pitch: options.pitch ?? 1.0,
    language: options.language ?? 'en-IN',
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};

