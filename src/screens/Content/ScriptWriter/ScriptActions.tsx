import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';
import type { ContentScript } from '../../../types/content.types';

interface ScriptActionsProps {
  script: ContentScript;
  onSave?: (script: ContentScript) => void;
}

function scriptToPlainText(script: ContentScript): string {
  const lines = [
    script.hook,
    '',
    ...script.body,
    '',
    script.cta,
    '',
    `Est. ${script.estimatedDuration} · ${script.platform}`,
  ];
  return lines.join('\n');
}

export const ScriptActions: React.FC<ScriptActionsProps> = ({
  script,
  onSave,
}) => {
  const haptics = useHaptics();

  const handleCopy = async () => {
    haptics.light();
    await Clipboard.setStringAsync(scriptToPlainText(script));
  };

  const handleSave = () => {
    haptics.light();
    onSave?.(script);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border.hair,
        paddingTop: spacing.md,
      }}
    >
      <Pressable
        onPress={handleCopy}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.sm,
        }}
      >
        <Text
          style={{
            marginRight: spacing.xs,
            fontSize: 16,
          }}
        >
          📋
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
          }}
        >
          Copy
        </Text>
      </Pressable>
      <View
        style={{
          width: 1,
          backgroundColor: colors.border.hair,
        }}
      />
      <Pressable
        onPress={handleSave}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.sm,
        }}
      >
        <Text
          style={{
            marginRight: spacing.xs,
            fontSize: 16,
          }}
        >
          💾
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: colors.text.gold,
          }}
        >
          Save
        </Text>
      </Pressable>
    </View>
  );
};

export default ScriptActions;
