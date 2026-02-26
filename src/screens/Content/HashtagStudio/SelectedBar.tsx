import React from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';

interface SelectedBarProps {
  selectedCount: number;
  selectedTags: string[];
  onCopy: () => void;
  onClear: () => void;
}

export const SelectedBar: React.FC<SelectedBarProps> = ({
  selectedCount,
  selectedTags,
  onCopy,
  onClear,
}) => {
  const haptics = useHaptics();

  const handleCopy = async () => {
    haptics.light();
    const text = selectedTags.join(' ');
    await Clipboard.setStringAsync(text);
    onCopy();
  };

  const handleClear = () => {
    haptics.light();
    onClear();
  };

  if (selectedCount === 0) return null;

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        paddingBottom: spacing.xl + 16,
        backgroundColor: colors.background.elevated,
        borderTopWidth: 1,
        borderTopColor: colors.border.hair,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
        }}
      >
        {selectedCount} selected
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={handleCopy}
          style={{
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border.gold,
            marginRight: spacing.sm,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.gold,
            }}
          >
            Copy
          </Text>
        </Pressable>
        <Pressable
          onPress={handleClear}
          style={{
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.full,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.border.subtle,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.secondary,
            }}
          >
            Clear
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SelectedBar;
