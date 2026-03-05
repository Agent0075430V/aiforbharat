import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../../theme/colors';
import { motion } from '../../../theme/animations';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
}) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animated, {
        toValue: 1,
        duration: motion.shimmer.durationMs,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animated]);

  const translateX = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 200],
  });

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: width as any,
        height,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: colors.background.surface,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            colors.background.surface,
            'rgba(255,255,255,0.05)',
            colors.background.surface,
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;

