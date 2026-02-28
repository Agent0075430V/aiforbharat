import React from 'react';
import { View } from 'react-native';
import VoiceOrb from '../../components/features/VoiceOrb';
import CommandHistory from './CommandHistory';
import type { VoiceCommandRecord } from '../../types/voice.types';
import { voiceAgentStyles } from './styles/VoiceAgent.styles';

interface ListeningStateProps {
  commands: VoiceCommandRecord[];
  transcriptPreview?: string;
  onOrbPress?: () => void;
}

export const ListeningState: React.FC<ListeningStateProps> = ({
  commands,
  transcriptPreview,
  onOrbPress,
}) => {
  return (
    <View style={voiceAgentStyles.screen}>
      <View style={voiceAgentStyles.center}>
        <VoiceOrb
          state="listening"
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

export default ListeningState;

export {};
