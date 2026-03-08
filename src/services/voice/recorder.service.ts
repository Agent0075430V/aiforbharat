/**
 * recorder.service.ts
 *
 * Wraps expo-av Audio.Recording with a clean start/stop/cancel API.
 *
 * Recording format: AAC in an MPEG-4 container (.m4a)
 *   - Supported by Groq Whisper (mp4/m4a ✔)
 *   - Works on both Android and iOS
 *   - Small file size, good quality for speech
 */

import { Audio } from 'expo-av';

export type RecordingStatus = 'idle' | 'recording' | 'stopped' | 'error';

export interface RecordingState {
  status: RecordingStatus;
  uri?: string;
  error?: string;
}

/**
 * Custom recording options that guarantee an AAC/M4A file on every platform.
 * HIGH_QUALITY preset uses LINEAR16 PCM on some Android versions which
 * Groq Whisper may reject with a 400 error.
 */
const SPEECH_RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 16000,  // 16 kHz is optimal for speech recognition
    numberOfChannels: 1, // mono — half the file size, same accuracy
    bitRate: 64000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.MEDIUM,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 64000,
  },
};

let currentRecording: Audio.Recording | null = null;

export const startRecording = async (): Promise<RecordingState> => {
  // Clean up any stale recording from a previous session
  if (currentRecording) {
    try {
      await currentRecording.stopAndUnloadAsync();
    } catch {
      // ignore — might already be unloaded
    }
    currentRecording = null;
  }

  try {
    // 1. Request microphone permission
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      return { status: 'error', error: 'Microphone permission not granted' };
    }

    // 2. Set audio mode for recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      interruptionModeIOS: 1,     // DoNotMix
      interruptionModeAndroid: 1, // DoNotMix
    });

    // 3. Create and start recording with explicit AAC/M4A options
    const { recording } = await Audio.Recording.createAsync(SPEECH_RECORDING_OPTIONS);
    currentRecording = recording;

    console.info('[Recorder] ✅ Recording started (AAC/M4A, 16kHz mono)');
    return { status: 'recording' };
  } catch (error: any) {
    console.warn('[Recorder] startRecording error:', error);
    currentRecording = null;
    return { status: 'error', error: error?.message ?? 'Failed to start recording' };
  }
};

export const stopRecording = async (): Promise<RecordingState> => {
  if (!currentRecording) {
    return { status: 'error', error: 'No active recording' };
  }

  try {
    await currentRecording.stopAndUnloadAsync();
    const uri = currentRecording.getURI() ?? undefined;
    currentRecording = null;

    // Reset audio mode back to playback after recording ends
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
    }).catch(() => {
      // Non-fatal — don't block on this
    });

    if (!uri) {
      return { status: 'error', error: 'Recording produced no audio file' };
    }

    console.info('[Recorder] ✅ Recording stopped, URI:', uri);
    return { status: 'stopped', uri };
  } catch (error: any) {
    console.warn('[Recorder] stopRecording error:', error);
    currentRecording = null;
    return { status: 'error', error: error?.message ?? 'Failed to stop recording' };
  }
};

export const cancelRecording = async (): Promise<void> => {
  try {
    if (currentRecording) {
      await currentRecording.stopAndUnloadAsync();
    }
  } catch {
    // swallow
  } finally {
    currentRecording = null;
  }
};
