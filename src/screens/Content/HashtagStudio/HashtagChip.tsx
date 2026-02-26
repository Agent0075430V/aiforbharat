import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';
import { motion } from '../../../theme/animations';
import type { HashtagItem } from '../../../types/content.types';

interface HashtagChipProps {
  item: HashtagItem;
  selected: boolean;
  onToggle: () => void;
}

export const HashtagChip: React.FC<HashtagChipProps> = ({
  item,
  selected,
  onToggle,
}) => {
  const haptics = useHaptics();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: motion.press.scalePressed,
      useNativeDriver: true,
      friction: 6,
      tension: 180,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 180,
    }).start();
  };

  const handlePress = () => {
    haptics.light();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.full,
          borderWidth: 1.5,
          borderColor: selected ? colors.border.active : colors.border.subtle,
          backgroundColor: selected ? colors.gold.glow : colors.background.surface,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: selected ? colors.text.gold : colors.text.primary,
          }}
        >
          {item.tag}
        </Text>
        {item.estimatedPosts !== '—' && (
          <Text
            style={{
              marginTop: 2,
              fontFamily: fontFamilies.mono.regular,
              fontSize: 10,
              color: colors.text.muted,
            }}
          >
            {item.estimatedPosts}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default HashtagChip;
