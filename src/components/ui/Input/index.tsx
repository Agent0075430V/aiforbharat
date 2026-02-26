import React, { useRef, useState } from 'react';
import {
  Animated,
  TextInput,
  TextInputProps,
  Text,
  View,
} from 'react-native';
import { styles } from './Input.styles';
import { motion } from '../../../theme/animations';
import colors from '../../../theme/colors';

export interface MedioraInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<MedioraInputProps> = ({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(rest.value ?? rest.defaultValue ?? '');
  const animatedLabel = useRef(new Animated.Value(0)).current;

  const hasValue = typeof value === 'string' ? value.length > 0 : !!value;

  const runLabelAnimation = (toValue: number) => {
    Animated.timing(animatedLabel, {
      toValue,
      duration: motion.durations.normal,
      useNativeDriver: true,
    }).start();
  };

  const handleFocus = (e: any) => {
    setFocused(true);
    runLabelAnimation(1);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    if (!hasValue) {
      runLabelAnimation(0);
    }
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    rest.onChangeText?.(text);
  };

  const labelTranslateY = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });
  const labelScale = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          errorText && { borderColor: colors.semantic.error },
        ]}
      >
        {label && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.labelContainer,
              {
                transform: [
                  { translateY: labelTranslateY },
                  { scale: labelScale },
                ],
              },
            ]}
          >
            <Text style={styles.labelText}>{label}</Text>
          </Animated.View>
        )}
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          {...rest}
          value={value as string}
          onChangeText={handleChangeText}
          style={styles.textInput}
          placeholderTextColor={colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {!!errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export default Input;

