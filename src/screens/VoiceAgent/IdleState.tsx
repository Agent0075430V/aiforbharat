import React from 'react';
import { View } from 'react-native';
import VoiceOrb from '../../components/features/VoiceOrb';
import CommandHistory from './CommandHistory';
import type { VoiceCommandRecord } from '../../types/voice.types';
import { voiceAgentStyles } from './styles/VoiceAgent.styles';

interface IdleStateProps {
  commands: VoiceCommandRecord[];
  onOrbPress?: () => void;
}

export const IdleState: React.FC<IdleStateProps> = ({ commands, onOrbPress }) => {
  return (
    <View style={voiceAgentStyles.screen}>
      <View style={voiceAgentStyles.center}>
        <VoiceOrb state="idle" onPress={onOrbPress} />
      </View>
      <View style={voiceAgentStyles.historyContainer}>
        <CommandHistory commands={commands} />
      </View>
    </View>
  );
};

export default IdleState;

export { };
