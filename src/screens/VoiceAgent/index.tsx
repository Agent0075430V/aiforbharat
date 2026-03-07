import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IdleState from './IdleState';
import ListeningState from './ListeningState';
import ProcessingState from './ProcessingState';
import RespondingState from './RespondingState';
import { useProfile } from '../../store/ProfileContext';
import { useAuth } from '../../store/AuthContext';
import { startRecording, stopRecording } from '../../services/voice/recorder.service';
import { speak, stopSpeaking } from '../../services/voice/speaker.service';
import { transcribeAudio, parseVoiceCommand } from '../../services/api';
import { executeVoiceCommand } from '../../services/voice/executor.service';
import { classifyIntentLocally } from '../../services/voice/localIntent.service';
import type { VoiceState, VoiceCommandRecord, CommandIntent } from '../../types/voice.types';
import type { ParsedCommand } from '../../types/voice.types';
import { mockInfluencerProfile } from '../../constants/mockData.constants';

function makeCommandId(): string {
  return `vc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const VoiceAgentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile } = useProfile();

  // userId: auth token takes priority; AsyncStorage is the fallback.
  // Stored as state so useCallback closures always get the fresh value.
  const { token: authToken } = useAuth();
  const [userId, setUserId] = useState<string>(authToken ?? 'anonymous');

  const [state, setState] = useState<VoiceState>('idle');
  const [commands, setCommands] = useState<VoiceCommandRecord[]>([]);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const processingRef = useRef(false);

  // Sync userId whenever auth changes or on first mount
  useEffect(() => {
    if (authToken) {
      setUserId(authToken);
      return;
    }
    AsyncStorage.getItem('last_user_id').then((id) => {
      if (id) setUserId(id);
    });
  }, [authToken]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const navigate = useCallback(
    (screen: string) => {
      const root = navigation.getParent();
      root?.navigate('App' as never);
    },
    [navigation]
  );

  const addCommand = useCallback(
    (transcript: string, intent: CommandIntent, response: string, wasSuccessful: boolean) => {
      setCommands((prev) => [
        {
          id: makeCommandId(),
          transcript: transcript || '(no transcript)',
          intent,
          response,
          timestamp: new Date().toISOString(),
          wasSuccessful,
        },
        ...prev,
      ]);
    },
    []
  );

  /** Deliver a voice response to the user and log it */
  const respond = useCallback(
    (transcript: string, intent: CommandIntent, msg: string, success: boolean) => {
      setLastResponse(msg);
      speak(msg, { language: 'en-IN' });
      addCommand(transcript, intent, msg, success);
      setState('responding');
      processingRef.current = false;
    },
    [addCommand]
  );

  // ─── Core pipeline ─────────────────────────────────────────────────────────

  /**
   * parseIntent — local classifier first (always works), then optionally
   * enhanced by the AI API. The AI result only replaces the local one when
   * it returns a higher-confidence, valid intent.
   */
  const parseIntent = useCallback(
    async (transcript: string): Promise<ParsedCommand> => {
      // Step 1: local classifier — instant, no network
      const local = classifyIntentLocally(transcript);

      // Step 2: try AI for richer topic/platform extraction
      try {
        const aiRaw = await parseVoiceCommand(transcript);
        const VALID_INTENTS: CommandIntent[] = [
          'generate_captions', 'generate_hashtags', 'write_script',
          'generate_week_plan', 'schedule_post', 'check_calendar',
          'get_analytics', 'check_brands', 'generate_media_kit',
          'save_draft', 'navigate', 'improve_caption', 'unknown',
        ];
        const aiIntent = aiRaw?.intent as CommandIntent | undefined;
        const aiConfidence: number = typeof aiRaw?.confidence === 'number' ? aiRaw.confidence : 0;
        const aiParams = aiRaw?.parameters ?? {};

        // Only trust AI if it returned a valid, known intent
        if (aiIntent && VALID_INTENTS.includes(aiIntent) && aiConfidence >= local.confidence) {
          // Sanitise parameters: strip any non-primitive values to match the strict type
          const safeParams: Record<string, string | number | boolean> = {};
          for (const [k, v] of Object.entries(aiParams)) {
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
              safeParams[k] = v;
            }
          }
          return {
            intent: aiIntent,
            parameters: safeParams,
            rawTranscript: transcript,
            confidence: aiConfidence,
          };
        }
      } catch (aiErr) {
        // AI unavailable — silently fall back to local result
        console.info('[VoiceAgent] AI intent parsing unavailable, using local classifier:', aiErr);
      }

      // Return local result (already correctly typed)
      return {
        intent: local.intent,
        parameters: local.parameters,
        rawTranscript: transcript,
        confidence: local.confidence,
      };
    },
    []
  );

  // ─── Orb press handler ─────────────────────────────────────────────────────

  const handleOrbPress = useCallback(() => {
    // ── IDLE → start recording ────────────────────────────────────────────────
    if (state === 'idle') {
      stopSpeaking();
      setLastTranscript('');
      setLastResponse('');

      startRecording().then((r) => {
        if (r.status === 'recording') {
          setState('listening');
        } else {
          // Mic permission denied or hardware error
          const msg = r.error?.includes('permission')
            ? 'Please grant microphone permission in your device Settings and try again.'
            : (r.error ?? 'Could not access the microphone. Please try again.');
          respond('', 'unknown', msg, false);
        }
      });
      return;
    }

    // ── LISTENING → stop & process ────────────────────────────────────────────
    if (state === 'listening') {
      stopRecording().then(async (r) => {
        if (r.status !== 'stopped' || !r.uri) {
          respond('', 'unknown', "I didn't capture any audio. Please tap and hold while speaking.", false);
          return;
        }

        setState('processing');
        processingRef.current = true;
        const profileOrMock = profile ?? mockInfluencerProfile;
        let transcript = '';

        try {
          // ── Stage 1: Transcribe ─────────────────────────────────────────────
          // Try AWS Transcribe. If it fails, we still have the local classifier
          // for intent — we just won't have a text transcript.
          try {
            transcript = await transcribeAudio(r.uri, userId);
          } catch (txErr: any) {
            console.warn('[VoiceAgent] AWS Transcribe unavailable:', txErr?.message ?? txErr);
            // Service is down — tell the user clearly instead of silently failing
            const msg =
              'Voice transcription service is currently unavailable. ' +
              'Please check your internet connection, or type your request in the Caption Generator.';
            respond('(transcription failed)', 'unknown', msg, false);
            return;
          }

          if (!transcript?.trim()) {
            respond('(empty)', 'unknown', "I couldn't make out what you said. Please try again, speaking clearly.", false);
            return;
          }

          setLastTranscript(transcript);

          // ── Stage 2: Parse intent (local + optional AI) ─────────────────────
          const parsed = await parseIntent(transcript);

          // ── Stage 3: Execute ────────────────────────────────────────────────
          const result = await executeVoiceCommand(parsed, profileOrMock, navigate);

          respond(transcript, parsed.intent, result.spokenResponse, result.success);

        } catch (e: any) {
          console.warn('[VoiceAgent] Unexpected error:', e?.message ?? e);
          respond(transcript || '(error)', 'unknown', 'Something went wrong. Please try again.', false);
        }
      });
      return;
    }

    // ── PROCESSING → ignore taps ──────────────────────────────────────────────
    if (state === 'processing') return;

    // ── RESPONDING → dismiss ─────────────────────────────────────────────────
    if (state === 'responding') {
      stopSpeaking();
      setState('idle');
      return;
    }

    setState('idle');
  }, [state, profile, navigate, userId, respond, parseIntent]);

  // ─── Render ────────────────────────────────────────────────────────────────

  const transcriptPreview = lastTranscript || commands[0]?.transcript;

  if (state === 'listening') {
    return (
      <ListeningState
        commands={commands}
        transcriptPreview={transcriptPreview}
        onOrbPress={handleOrbPress}
      />
    );
  }

  if (state === 'processing') {
    return (
      <ProcessingState
        commands={commands}
        transcriptPreview={transcriptPreview}
        onOrbPress={() => { }}
      />
    );
  }

  if (state === 'responding') {
    return (
      <RespondingState
        commands={commands}
        transcriptPreview={transcriptPreview}
        responsePreview={lastResponse}
        onOrbPress={handleOrbPress}
      />
    );
  }

  return <IdleState commands={commands} onOrbPress={handleOrbPress} />;
};

export default VoiceAgentScreen;

export { };
