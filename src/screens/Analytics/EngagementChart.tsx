import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import type { DailyEngagement } from '../../types/analytics.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { motion } from '../../theme/animations';

interface EngagementChartProps {
  data: DailyEngagement[];
  height?: number;
  metric?: 'likes' | 'comments' | 'saves' | 'reach';
}

export const EngagementChart: React.FC<EngagementChartProps> = ({
  data,
  height = 140,
  metric = 'likes',
}) => {
  const maxVal = Math.max(...data.map((d) => d[metric]), 1);
  const barCount = data.length;
  const barGap = spacing.xs;
  const barWidth = Math.max(12, (280 - barGap * (barCount - 1)) / barCount);

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.sm,
        }}
      >
        Engagement ({metric})
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          height,
          gap: barGap,
        }}
      >
        {data.map((d, i) => (
          <Bar
            key={d.date}
            value={d[metric]}
            maxVal={maxVal}
            barWidth={barWidth}
            height={height - 20}
            delay={i * motion.calendarFill.itemStaggerMs}
            label={d.date.slice(5)}
          />
        ))}
      </View>
    </View>
  );
};

function Bar({
  value,
  maxVal,
  barWidth,
  height,
  delay,
  label,
}: {
  value: number;
  maxVal: number;
  barWidth: number;
  height: number;
  delay: number;
  label: string;
}) {
  const scaleY = useSharedValue(0);

  useEffect(() => {
    scaleY.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.chartDraw.durationMs,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      })
    );
  }, [scaleY, delay]);

  const barHeight = Math.max(4, (value / maxVal) * height);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const s = scaleY.value;
    return {
      transform: [
        { translateY: (barHeight / 2) * (1 - s) },
        { scaleY: s },
      ],
    };
  });

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <View
        style={{
          height,
          width: barWidth,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Animated.View
          style={[
            {
              width: barWidth,
              height: barHeight,
              backgroundColor: colors.gold.dim,
              borderRadius: radius.xs,
            },
            animatedStyle,
          ]}
        />
      </View>
      <Text
        style={{
          fontFamily: fontFamilies.mono.regular,
          fontSize: 10,
          color: colors.text.muted,
          marginTop: spacing.xs,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default EngagementChart;
