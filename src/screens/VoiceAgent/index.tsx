import React, { useCallback, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import IdleState from './IdleState';
import ListeningState from './ListeningState';
import ProcessingState from './ProcessingState';
import RespondingState from './RespondingState';
import { useProfile } from '../../store/ProfileContext';
import { startRecording, stopRecording } from '../../services/voice/recorder.service';
import { transcribeAudio, parseVoiceCommand } from '../../services/api';
import { executeVoiceCommand } from '../../services/voice/executor.service';
import type { VoiceState, VoiceCommandRecord, CommandIntent } from '../../types/voice.types';
import { mockInfluencerProfile } from '../../constants/mockData.constants';

function makeCommandId(): string {
  return `vc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const VoiceAgentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile } = useProfile();
  const [state, setState] = useState<VoiceState>('idle');
  const [commands, setCommands] = useState<VoiceCommandRecord[]>([]);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const processingRef = useRef(false);

  const navigate = useCallback(
    (screen: string) => {
      const root = navigation.getParent();
      if (screen === 'app' || screen === 'home') {
        root?.navigate('App' as never);
      } else if (screen === 'analytics') {
        root?.navigate('App' as never);
        // Tab switch would require tab navigator ref; user can tap Analytics tab
      } else {
        root?.navigate('App' as never);
      }
    },
    [navigation]
  );

  const handleOrbPress = useCallback(() => {
    if (state === 'idle') {
      setLastTranscript('');
      setLastResponse('');
      startRecording().then((r) => {
        if (r.status === 'recording') setState('listening');
        else setState('idle');
      });
      return;
    }
    if (state === 'listening') {
      stopRecording().then(async (r) => {
        if (r.status !== 'stopped' || !r.uri) {
          setState('idle');
          return;
        }
        setState('processing');
        processingRef.current = true;
        const profileOrMock = profile ?? mockInfluencerProfile;
        let transcript = '';
        try {
          transcript = await transcribeAudio(r.uri);
          setLastTranscript(transcript || '');
          const parsed = await parseVoiceCommand(transcript || '');
          const intent = (parsed?.intent ?? 'unknown') as CommandIntent;
          const parameters = parsed?.parameters ?? {};
          const result = await executeVoiceCommand(
            { intent, parameters, rawTranscript: transcript || '', confidence: parsed?.confidence ?? 0 },
            profileOrMock,
            navigate
          );
          setLastResponse(result.spokenResponse);
          setCommands((prev) => [
            {
              id: makeCommandId(),
              transcript: transcript || '(no transcript)',
              intent,
              response: result.spokenResponse,
              timestamp: new Date().toISOString(),
              wasSuccessful: result.success,
            },
            ...prev,
          ]);
          setState('responding');
        } catch (e) {
          const errTranscript = transcript || '(no transcript)';
          setLastResponse('Something went wrong. Please try again.');
          setCommands((prev) => [
            {
              id: makeCommandId(),
              transcript: errTranscript,
              intent: 'unknown',
              response: 'Something went wrong.',
              timestamp: new Date().toISOString(),
              wasSuccessful: false,
            },
            ...prev,
          ]);
          setState('responding');
        } finally {
          processingRef.current = false;
        }
      });
      return;
    }
    if (state === 'processing') {
      return;
    }
    if (state === 'responding') {
      setState('idle');
      return;
    }
    setState('idle');
  }, [state, profile, navigate]);

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
        onOrbPress={() => {}}
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

export {};
