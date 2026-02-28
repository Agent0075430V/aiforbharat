import { Audio } from 'expo-av';

export type RecordingStatus = 'idle' | 'recording' | 'stopped' | 'error';

export interface RecordingState {
  status: RecordingStatus;
  uri?: string;
  error?: string;
}

let currentRecording: Audio.Recording | null = null;

export const startRecording = async (): Promise<RecordingState> => {
  try {
    // Request permissions and configure for high-quality voice capture
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      return { status: 'error', error: 'Microphone permission not granted' };
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      interruptionModeIOS: 1 /* InterruptionModeIOS.DoNotMix */,
      interruptionModeAndroid: 1 /* InterruptionModeAndroid.DoNotMix */,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();
    currentRecording = recording;

    return { status: 'recording' };
  } catch (error: any) {
    console.warn('startRecording error', error);
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
    return { status: 'stopped', uri };
  } catch (error: any) {
    console.warn('stopRecording error', error);
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

