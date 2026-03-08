import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IdleState from './IdleState';
import ListeningState from './ListeningState';
import ProcessingState from './ProcessingState';
import RespondingState from './RespondingState';
import { useProfile } from '../../store/ProfileContext';
import { useAuth } from '../../store/AuthContext';
import { useDrafts } from '../../store/DraftsContext';
import { startRecording, stopRecording, cancelRecording } from '../../services/voice/recorder.service';
import { speak, stopSpeaking } from '../../services/voice/speaker.service';
import { parseVoiceCommand } from '../../services/api';
import { transcribeRecording } from '../../services/voice/transcriber.service';
import { executeVoiceCommand } from '../../services/voice/executor.service';
import { classifyIntentLocally } from '../../services/voice/localIntent.service';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import type { VoiceState, VoiceCommandRecord, CommandIntent } from '../../types/voice.types';
import type { ParsedCommand } from '../../types/voice.types';
import { mockInfluencerProfile } from '../../constants/mockData.constants';

function makeCommandId(): string {
  return `vc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const VoiceAgentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useProfile();
  const { addDraftFromCaption } = useDrafts();

  // userId: auth token takes priority; AsyncStorage is the fallback.
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

  // ─── Close handler ─────────────────────────────────────────────────────────

  const handleClose = useCallback(async () => {
    // Stop any active recording and speech before leaving
    if (state === 'listening') {
      await cancelRecording();
    }
    stopSpeaking();
    processingRef.current = false;
    // Go back to previous screen (the FAB opens VoiceAgent as a stack screen)
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('App');
    }
  }, [navigation, state]);

  // ─── Navigation helper ─────────────────────────────────────────────────

  /**
   * navigate(tab, screen?) — navigates from the VoiceAgent stack screen
   * back to the main App tab navigator then to the correct tab + inner screen.
   *
   * Navigation tree:
   *   AppNavigator (Root Stack)
   *     └─ 'App' → MainTabNavigator
   *           ├─ 'HomeStack'     → Home, Settings
   *           ├─ 'ContentStack'  → ContentHub, CaptionGenerator, …
   *           ├─ 'CalendarStack' → Calendar
   *           ├─ 'AnalyticsStack'→ Analytics
   *           └─ 'BrandStack'    → Brands, …
   */
  const navigate = useCallback(
    (tab: string, screen?: string) => {
      // First go back to App (closes VoiceAgent modal)
      navigation.navigate('App', {
        screen: tab,
        params: screen ? { screen } : undefined,
      });
    },
    [navigation],
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
    async (transcript: string, intent: CommandIntent, msg: string, success: boolean) => {
      setLastResponse(msg);
      await speak(msg, { language: 'en-IN' }); // async on native (voice selection), sync on web
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
          // transcribeRecording tries AWS first, then Groq Whisper automatically.
          // If both fail it throws a human-readable error caught below.
          transcript = await transcribeRecording(r.uri, userId);

          if (!transcript?.trim()) {
            respond('(empty)', 'unknown', "I couldn't make out what you said. Please speak clearly and try again.", false);
            return;
          }

          setLastTranscript(transcript);

          // ── Stage 2: Parse intent (local + optional AI) ─────────────────────
          const parsed = await parseIntent(transcript);

          // ── Stage 3: Execute ────────────────────────────────────────────────
          const result = await executeVoiceCommand(parsed, profileOrMock, {
            navigate,
            saveDraftFromCaption: addDraftFromCaption,
          });

          respond(transcript, parsed.intent, result.spokenResponse, result.success);

        } catch (e: any) {
          const errMsg: string = e?.message ?? '';
          console.warn('[VoiceAgent] Pipeline error:', errMsg);

          // Show the real transcription error if it's user-readable
          const isTranscriptionErr =
            errMsg.startsWith('Voice transcription') ||
            errMsg.startsWith('Recording is too short') ||
            errMsg.startsWith('Failed to read recorded');

          const userMsg = isTranscriptionErr
            ? errMsg.replace(/^Voice transcription error:\s*/i, '')  // strip prefix for UI
            : 'Something went wrong. Please try again.';

          respond(transcript || '(error)', 'unknown', userMsg, false);
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

  /** The ✕ close button — always visible in every state */
  const CloseButton = (
    <Pressable
      onPress={handleClose}
      style={closeStyles.btn}
      hitSlop={12}
    >
      <Text style={closeStyles.btnText}>✕</Text>
    </Pressable>
  );

  if (state === 'listening') {
    return (
      <View style={{ flex: 1 }}>
        {CloseButton}
        <ListeningState
          commands={commands}
          transcriptPreview={transcriptPreview}
          onOrbPress={handleOrbPress}
        />
      </View>
    );
  }

  if (state === 'processing') {
    return (
      <View style={{ flex: 1 }}>
        {CloseButton}
        <ProcessingState
          commands={commands}
          transcriptPreview={transcriptPreview}
          onOrbPress={() => { }}
        />
      </View>
    );
  }

  if (state === 'responding') {
    return (
      <View style={{ flex: 1 }}>
        {CloseButton}
        <RespondingState
          commands={commands}
          transcriptPreview={transcriptPreview}
          responsePreview={lastResponse}
          onOrbPress={handleOrbPress}
        />
      </View>
    );
  }

  // idle
  return (
    <View style={{ flex: 1 }}>
      {CloseButton}
      <IdleState commands={commands} onOrbPress={handleOrbPress} />
    </View>
  );
};

// ─── Close button styles ──────────────────────────────────────────────────────

const closeStyles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default VoiceAgentScreen;

export { };
