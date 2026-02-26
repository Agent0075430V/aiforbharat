import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './Card.styles';
import { motion } from '../../../theme/animations';
import useHaptics from '../../../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps['onPress'];
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, ...rest }) => {
  const haptics = useHaptics();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const isPressable = !!onPress;

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
    if (!isPressable) return;
    animateTo(motion.press.scalePressed, motion.press.opacityPressed);
  };

  const handlePressOut = () => {
    if (!isPressable) return;
    animateTo(motion.press.scaleRest, 1);
  };

  const handlePress = (e: any) => {
    if (!isPressable) return;
    haptics.light();
    onPress?.(e);
  };

  if (!isPressable) {
    return <View style={[styles.base, style]}>{children}</View>;
  }

  return (
    <AnimatedPressable
      {...rest}
      style={[styles.base, { transform: [{ scale }], opacity }, style]}
      activeOpacity={0.75}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {children}
    </AnimatedPressable>
  );
};

export default Card;

