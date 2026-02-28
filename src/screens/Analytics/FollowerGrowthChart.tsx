import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { FollowerDataPoint } from '../../types/analytics.types';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { motion } from '../../theme/animations';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface FollowerGrowthChartProps {
  data: FollowerDataPoint[];
  height?: number;
  width?: number;
}

export const FollowerGrowthChart: React.FC<FollowerGrowthChartProps> = ({
  data,
  height = 160,
  width,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: motion.chartDraw.durationMs,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }, [progress]);

  if (data.length < 2) return null;

  const minCount = Math.min(...data.map((d) => d.count));
  const maxCount = Math.max(...data.map((d) => d.count));
  const range = maxCount - minCount || 1;
  const padding = { top: 20, right: 12, bottom: 24, left: 44 };
  const chartWidth = (width ?? 320) - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const stepX = chartWidth / (data.length - 1);

  const pathD = data
    .map((d, i) => {
      const x = padding.left + i * stepX;
      const y =
        padding.top +
        chartHeight -
        ((d.count - minCount) / range) * chartHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const pathLength = (() => {
    let len = 0;
    for (let i = 1; i < data.length; i++) {
      const x0 = padding.left + (i - 1) * stepX;
      const y0 =
        padding.top +
        chartHeight -
        ((data[i - 1].count - minCount) / range) * chartHeight;
      const x1 = padding.left + i * stepX;
      const y1 =
        padding.top +
        chartHeight -
        ((data[i].count - minCount) / range) * chartHeight;
      len += Math.hypot(x1 - x0, y1 - y0);
    }
    return len;
  })();

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  const svgWidth = width ?? 320;

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
        Follower growth
      </Text>
      <Svg width={svgWidth} height={height}>
        <Defs>
          <LinearGradient id="followerGradient" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor={colors.teal.pure} stopOpacity="0.2" />
            <Stop offset="1" stopColor={colors.teal.pure} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path
          d={`${pathD} L ${padding.left + (data.length - 1) * stepX} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`}
          fill="url(#followerGradient)"
        />
        <AnimatedPath
          d={pathD}
          fill="none"
          stroke={colors.teal.pure}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          animatedProps={animatedProps}
        />
      </Svg>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: spacing.xs,
          paddingHorizontal: padding.left,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamilies.mono.regular,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
          }}
        >
          {data[0]?.date.slice(5) ?? ''}
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.mono.regular,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
          }}
        >
          {data[data.length - 1]?.date.slice(5) ?? ''}
        </Text>
      </View>
    </View>
  );
};

export default FollowerGrowthChart;
