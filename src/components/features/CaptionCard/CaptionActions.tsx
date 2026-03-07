import React, { useRef, useState } from 'react';
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

// ─── Each button is its own component so useRef is called at component level ──
// (calling useRef inside a plain helper function violates the Rules of Hooks)
interface ActionButtonProps {
  label: string;
  onPress?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onPress }) => {
  const haptics = useHaptics();
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

  return (
    <AnimatedPressable
      onPressIn={() => animateTo(motion.press.scalePressed, motion.press.opacityPressed)}
      onPressOut={() => animateTo(1, 1)}
      onPress={() => { haptics.light(); onPress?.(); }}
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

const Divider: React.FC = () => (
  // eslint-disable-next-line react-native/no-inline-styles
  <View style={{ width: 1, backgroundColor: colors.border.hair }} />
);

export const CaptionActions: React.FC<CaptionActionsProps> = ({
  captionText,
  onSaveDraft,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveDraft = () => {
    onSaveDraft?.();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
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
      <ActionButton label={copied ? '✅ Copied!' : 'Copy'} onPress={handleCopy} />
      <Divider />
      <ActionButton label={saved ? '✅ Saved!' : 'Save Draft'} onPress={handleSaveDraft} />
      <Divider />
      <ActionButton label="Regenerate" onPress={onRegenerate} />
    </View>
  );
};

export default CaptionActions;
