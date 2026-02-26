import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { VoiceCommandRecord } from '../../types/voice.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface CommandHistoryProps {
  commands: VoiceCommandRecord[];
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ commands }) => {
  if (commands.length === 0) {
    return (
      <View>
        <Text
          style={{
            fontFamily: fontFamilies.heading.medium,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}
        >
          History
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.muted,
          }}
        >
          Your recent voice commands will appear here.
        </Text>
      </View>
    );
  }

  const limited = commands
    .slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 6);

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        History
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: spacing.xs }}
      >
        {limited.map((cmd) => {
          const time = new Date(cmd.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const success = cmd.wasSuccessful;
          return (
            <View
              key={cmd.id}
              style={{
                width: 220,
                marginRight: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.lg,
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: success ? colors.teal.dim : colors.border.subtle,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing.xs,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fontFamilies.body.medium,
                    fontSize: fontSizes.xs,
                    color: colors.text.muted,
                  }}
                >
                  {cmd.intent}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamilies.mono.regular,
                    fontSize: fontSizes.xs,
                    color: colors.text.muted,
                  }}
                >
                  {time}
                </Text>
              </View>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.sm,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                {cmd.transcript}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.xs,
                  color: colors.text.secondary,
                }}
              >
                {cmd.response}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CommandHistory;

export {};
