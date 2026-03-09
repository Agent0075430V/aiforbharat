import React, { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import { ScoreBreakdown as ScoreBreakdownType } from '../../../types/content.types';
import { motion } from '../../../theme/animations';
import useHaptics from '../../../hooks/useHaptics';

interface Props {
  breakdown: ScoreBreakdownType;
}

export const ScoreBreakdown: React.FC<Props> = ({ breakdown }) => {
  const [open, setOpen] = useState(false);
  const animated = useRef(new Animated.Value(0)).current;
  const haptics = useHaptics();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    haptics.light();
    Animated.timing(animated, {
      toValue: next ? 1 : 0,
      duration: motion.durations.normal,
      useNativeDriver: false,
    }).start();
  };

  const height = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });
  const opacity = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rows: Array<[string, number]> = [
    ['Hook', breakdown.hookStrength],
    ['Tone match', breakdown.toneMatch],
    ['CTA', breakdown.ctaStrength],
    ['Relatability', breakdown.relatability],
    ['Language', breakdown.languageQuality],
  ];

  return (
    <View style={{ marginTop: spacing.sm }}>
      <Pressable
        onPress={toggle}
        hitSlop={8}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.xs,
            color: colors.text.secondary,
          }}
        >
          {open ? 'Hide score breakdown' : 'Show score breakdown'}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginLeft: 4,
            fontSize: 10,
            color: colors.text.muted,
          }}
        >
          {open ? '˄' : '˅'}
        </Text>
      </Pressable>
      <Animated.View
        style={{
          height,
          opacity,
          overflow: 'hidden',
          marginTop: spacing.xs,
        }}
      >
        {rows.map(([label, value]) => (
          <View
            key={label}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 2,
            }}
          >
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
              }}
            >
              {label}
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.mono.regular,
                fontSize: fontSizes.xs,
                color: colors.text.secondary,
              }}
            >
              {value}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default ScoreBreakdown;

