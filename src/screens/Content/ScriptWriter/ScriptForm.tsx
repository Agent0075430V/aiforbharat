import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';
import type { Platform } from '../../../types/profile.types';

const DURATIONS = ['15–30 sec', '30–45 sec', '45–60 sec', '60–90 sec'];
const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
];

export type ScriptFormat = 'reel' | 'short';

interface ScriptFormProps {
  topic: string;
  onTopicChange: (text: string) => void;
  format: ScriptFormat;
  onFormatChange: (format: ScriptFormat) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({
  topic,
  onTopicChange,
  format,
  onFormatChange,
  duration,
  onDurationChange,
  platform,
  onPlatformChange,
}) => {
  const haptics = useHaptics();

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        Topic
      </Text>
      <TextInput
        value={topic}
        onChangeText={onTopicChange}
        placeholder="e.g. 3 hook formulas for educational reels"
        placeholderTextColor={colors.text.muted}
        multiline
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.md,
          color: colors.text.primary,
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: colors.border.subtle,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 72,
          textAlignVertical: 'top',
        }}
      />

      <Text
        style={{
          marginTop: spacing.md,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        Format
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Pressable
          onPress={() => {
            haptics.light();
            onFormatChange('reel');
          }}
          style={{
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.full,
            borderWidth: 1.5,
            borderColor: format === 'reel' ? colors.border.active : colors.border.subtle,
            backgroundColor: format === 'reel' ? colors.gold.glow : colors.background.surface,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: format === 'reel' ? colors.text.gold : colors.text.secondary,
            }}
          >
            Reel
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            haptics.light();
            onFormatChange('short');
          }}
          style={{
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.full,
            borderWidth: 1.5,
            borderColor: format === 'short' ? colors.border.active : colors.border.subtle,
            backgroundColor: format === 'short' ? colors.gold.glow : colors.background.surface,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: format === 'short' ? colors.text.gold : colors.text.secondary,
            }}
          >
            Short
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          marginTop: spacing.md,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        Duration
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {DURATIONS.map((d) => (
          <Pressable
            key={d}
            onPress={() => {
              haptics.light();
              onDurationChange(d);
            }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.full,
              borderWidth: 1.5,
              borderColor: duration === d ? colors.border.active : colors.border.subtle,
              backgroundColor: duration === d ? colors.teal.dim : colors.background.surface,
              marginRight: spacing.sm,
              marginBottom: spacing.sm,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: duration === d ? colors.teal.pure : colors.text.secondary,
              }}
            >
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        style={{
          marginTop: spacing.md,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        Platform
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {PLATFORMS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => {
              haptics.light();
              onPlatformChange(p.id);
            }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.full,
              borderWidth: 1.5,
              borderColor: platform === p.id ? colors.border.active : colors.border.subtle,
              backgroundColor: platform === p.id ? colors.gold.glow : colors.background.surface,
              marginRight: spacing.sm,
              marginBottom: spacing.sm,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: platform === p.id ? colors.text.gold : colors.text.secondary,
              }}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default ScriptForm;
