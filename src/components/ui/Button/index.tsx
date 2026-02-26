import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  PressableProps,
  Text,
  View,
} from 'react-native';
import { styles, getButtonContainerStyle } from './Button.styles';
import type { ButtonProps, ButtonVariant } from './Button.types';
import { motion } from '../../../theme/animations';
import useHaptics from '../../../hooks/useHaptics';
import colors from '../../../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(
  Pressable as React.ComponentType<PressableProps>
);

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  leadingIcon,
  trailingIcon,
  loading,
  disabled,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const haptics = useHaptics();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

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
    if (isDisabled) return;
    animateTo(motion.press.scalePressed, motion.press.opacityPressed);
  };

  const handlePressOut = () => {
    animateTo(motion.press.scaleRest, 1);
  };

  const handlePress = (event: any) => {
    if (isDisabled) return;
    haptics.light();
    onPress?.(event);
  };

  const titleStyleByVariant = (v: ButtonVariant) => {
    switch (v) {
      case 'secondary':
        return styles.titleSecondary;
      case 'ghost':
        return styles.titleGhost;
      case 'danger':
        return styles.titleDanger;
      case 'primary':
      default:
        return styles.titlePrimary;
    }
  };

  return (
    <AnimatedPressable
      {...rest}
      style={[
        getButtonContainerStyle(variant, isDisabled),
        { transform: [{ scale }], opacity },
        style,
      ]}
      activeOpacity={0.75}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            color={variant === 'primary' ? colors.background.base : colors.gold.pure}
          />
        )}
        {!loading && leadingIcon}
        <Text style={[titleStyleByVariant(variant), textStyle]}>{title}</Text>
        {!loading && trailingIcon}
      </View>
    </AnimatedPressable>
  );
};

export default Button;

