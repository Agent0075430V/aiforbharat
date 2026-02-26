import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';

interface ProgressBarProps {
  progress: number; // 0–100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const animated = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress, animated]);

  const widthInterpolated = animated.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: '100%',
        height: 6,
        borderRadius: radius.full,
        backgroundColor: colors.background.surface,
        overflow: 'hidden',
        marginTop: spacing.sm,
      }}
    >
      <Animated.View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: '100%',
          borderRadius: radius.full,
          backgroundColor: colors.teal.pure,
          width: widthInterpolated,
        }}
      />
    </View>
  );
};

export default ProgressBar;

