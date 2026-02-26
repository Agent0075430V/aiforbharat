import React from 'react';
import { View, Text, Pressable } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';
import type { Platform } from '../../../types/profile.types';

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'instagram', label: 'IG' },
  { id: 'youtube', label: 'YT' },
  { id: 'tiktok', label: 'TT' },
  { id: 'linkedin', label: 'LI' },
];

const platformColor = (p: Platform): string => {
  if (p === 'instagram') return colors.platform.instagram;
  if (p === 'youtube') return colors.platform.youtube;
  if (p === 'tiktok') return colors.platform.tiktok;
  if (p === 'linkedin') return colors.platform.linkedin;
  return colors.platform.twitter;
};

interface PlatformControlsProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

export const PlatformControls: React.FC<PlatformControlsProps> = ({
  value,
  onChange,
}) => {
  const haptics = useHaptics();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md }}>
      <Text
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginRight: spacing.sm,
        }}
      >
        Platform
      </Text>
      <View style={{ flexDirection: 'row', flex: 1, gap: spacing.sm }}>
        {PLATFORMS.map((p) => {
          const selected = value === p.id;
          const bgColor = platformColor(p.id);
          return (
            <Pressable
              key={p.id}
              onPress={() => {
                haptics.light();
                onChange(p.id);
              }}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: radius.full,
                backgroundColor: selected ? bgColor + '33' : colors.background.surface,
                borderWidth: 1.5,
                borderColor: selected ? bgColor : colors.border.subtle,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.body.medium,
                  fontSize: fontSizes.sm,
                  color: selected ? colors.text.primary : colors.text.secondary,
                }}
              >
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default PlatformControls;
