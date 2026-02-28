import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';

interface WaveformBarsProps {
  active: boolean;
}

const BAR_COUNT = 5;

export const WaveformBars: React.FC<WaveformBarsProps> = ({ active }) => {
  const values = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.4))
  ).current;

  useEffect(() => {
    if (!active) {
      values.forEach((v) => v.stopAnimation());
      return;
    }

    const animations = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 260 + index * 40,
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: 0.35,
            duration: 260 + index * 40,
            useNativeDriver: false,
          }),
        ])
      )
    );

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [active, values]);

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        position: 'absolute',
        bottom: 38,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.xs,
      }}
    >
      {values.map((value, index) => {
        const height = value.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 34],
        });

        return (
          <Animated.View
            key={index}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: 5,
              borderRadius: radius.full,
              backgroundColor: colors.teal.pure,
              height,
            }}
          />
        );
      })}
    </View>
  );
};

export default WaveformBars;

