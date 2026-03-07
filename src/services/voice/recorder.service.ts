import { Audio } from 'expo-av';

export type RecordingStatus = 'idle' | 'recording' | 'stopped' | 'error';

export interface RecordingState {
  status: RecordingStatus;
  uri?: string;
  error?: string;
}

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
      interruptionModeIOS: 1,    // DoNotMix
      interruptionModeAndroid: 1, // DoNotMix
    });

    // 3. Create and start recording using the recommended async factory
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    currentRecording = recording;

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
