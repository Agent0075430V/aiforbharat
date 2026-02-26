import React from 'react';
import { View } from 'react-native';
import VoiceOrb from '../../components/features/VoiceOrb';
import CommandHistory from './CommandHistory';
import type { VoiceCommandRecord } from '../../types/voice.types';
import { voiceAgentStyles } from './styles/VoiceAgent.styles';

interface ProcessingStateProps {
  commands: VoiceCommandRecord[];
  transcriptPreview?: string;
  onOrbPress?: () => void;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  commands,
  transcriptPreview,
  onOrbPress,
}) => {
  return (
    <View style={voiceAgentStyles.screen}>
      <View style={voiceAgentStyles.center}>
        <VoiceOrb
          state="processing"
          onPress={onOrbPress}
          transcriptPreview={transcriptPreview}
        />
      </View>
      <View style={voiceAgentStyles.historyContainer}>
        <CommandHistory commands={commands} />
      </View>
    </View>
  );
};

export default ProcessingState;

export {};
