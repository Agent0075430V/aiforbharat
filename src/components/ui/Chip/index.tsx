import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { styles } from './Chip.styles';
import { motion } from '../../../theme/animations';
import useHaptics from '../../../hooks/useHaptics';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Chip: React.FC<ChipProps> = ({ label, selected, onPress }) => {
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

  const handlePressIn = () => {
    animateTo(motion.press.scalePressed, motion.press.opacityPressed);
  };

  const handlePressOut = () => {
    animateTo(motion.press.scaleRest, 1);
  };

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  return (
    <AnimatedPressable
      activeOpacity={0.75}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[
        styles.container,
        selected ? styles.containerSelected : undefined,
        { transform: [{ scale }], opacity },
      ]}
    >
      <View>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

export default Chip;

