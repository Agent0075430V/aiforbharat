import React from 'react';
import { View, Text } from 'react-native';
import VoiceOrb from '../../components/features/VoiceOrb';
import CommandHistory from './CommandHistory';
import type { VoiceCommandRecord } from '../../types/voice.types';
import { voiceAgentStyles } from './styles/VoiceAgent.styles';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface RespondingStateProps {
  commands: VoiceCommandRecord[];
  transcriptPreview?: string;
  responsePreview?: string;
  onOrbPress?: () => void;
}

export const RespondingState: React.FC<RespondingStateProps> = ({
  commands,
  transcriptPreview,
  responsePreview,
  onOrbPress,
}) => {
  const lastResponse = responsePreview || commands[0]?.response || undefined;

  return (
    <View style={voiceAgentStyles.screen}>
      <View style={voiceAgentStyles.center}>
        <VoiceOrb
          state="responding"
          onPress={onOrbPress}
          transcriptPreview={transcriptPreview}
        />
        {lastResponse ? (
          <View
            style={{
              marginTop: spacing.lg,
              maxWidth: 320,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
                marginBottom: spacing.xs,
              }}
            >
              Mediora
            </Text>
            <Text
              numberOfLines={3}
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.secondary,
              }}
            >
              {lastResponse}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={voiceAgentStyles.historyContainer}>
        <CommandHistory commands={commands} />
      </View>
    </View>
  );
};

export default RespondingState;

export {};
