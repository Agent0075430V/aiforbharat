import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';
import { motion } from '../../../theme/animations';

interface CaptionActionsProps {
  captionText: string;
  onSaveDraft?: () => void;
  onRegenerate?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CaptionActions: React.FC<CaptionActionsProps> = ({
  captionText,
  onSaveDraft,
  onRegenerate,
}) => {
  const haptics = useHaptics();

  const makeAnimatedButton = (label: string, onPress?: () => void) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const animateTo = (nextScale: number, nextOpacity: number) => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: nextScale,
          useNativeDriver: true,
          friction: 6,
          tension: 180,
        }),
        Animated.timing(opacity, {
          toValue: nextOpacity,
          duration: motion.press.duration,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const handlePressIn = () => {
      animateTo(motion.press.scalePressed, motion.press.opacityPressed);
    };

    const handlePressOut = () => {
      animateTo(1, 1);
    };

    const handlePress = () => {
      haptics.light();
      onPress?.();
    };

    return (
      <AnimatedPressable
        key={label}
        activeOpacity={0.75}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: spacing.sm,
          transform: [{ scale }],
          opacity,
        }}
      >
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
          }}
        >
          {label}
        </Text>
      </AnimatedPressable>
    );
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(captionText);
  };

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.border.hair,
        marginTop: spacing.md,
      }}
    >
      {makeAnimatedButton('Copy', handleCopy)}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: 1,
          backgroundColor: colors.border.hair,
        }}
      />
      {makeAnimatedButton('Save Draft', onSaveDraft)}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: 1,
          backgroundColor: colors.border.hair,
        }}
      />
      {makeAnimatedButton('Regenerate', onRegenerate)}
    </View>
  );
};

export default CaptionActions;

