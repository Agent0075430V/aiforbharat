import { transcribeAudio } from '../api';

export const transcribeRecording = async (audioUri: string): Promise<string> => {
  if (!audioUri) {
    throw new Error('No audio URI provided for transcription');
  }

  return transcribeAudio(audioUri);
};

