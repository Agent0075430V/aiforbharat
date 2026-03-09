import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors from '../../../theme/colors';

// MUST be defined at module scope — NOT inside the component.
// Defining it inside the component creates a new class each render → infinite re-render → stack overflow.
const AnimatedCircle = Animated.createAnimatedComponent(Circle as any);

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0–100
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 72,
  strokeWidth = 6,
  progress,
}) => {
  const animated = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          stroke={colors.border.subtle}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={colors.teal.pure}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset as any}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default ProgressRing;
