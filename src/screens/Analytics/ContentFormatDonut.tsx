import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import type { ContentFormat } from '../../types/profile.types';
import type { TopPost } from '../../types/analytics.types';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { motion } from '../../theme/animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FORMAT_COLORS: Record<string, string> = {
  reel: colors.gold.pure,
  carousel: colors.teal.pure,
  short: colors.platform.youtube,
  post: colors.platform.instagram,
  story: colors.semantic.info,
  long_video: colors.text.muted,
  podcast: colors.platform.linkedin,
};

const FORMAT_LABELS: Record<string, string> = {
  reel: 'Reel',
  carousel: 'Carousel',
  short: 'Short',
  post: 'Post',
  story: 'Story',
  long_video: 'Long',
  podcast: 'Podcast',
};

function DonutSegment({
  cx,
  cy,
  r,
  strokeWidth,
  circumference,
  startOffset,
  segmentLength,
  color,
  progress,
}: {
  cx: number;
  cy: number;
  r: number;
  strokeWidth: number;
  circumference: number;
  startOffset: number;
  segmentLength: number;
  color: string;
  progress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - startOffset - segmentLength * progress.value,
  }));

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      fill="transparent"
      strokeWidth={strokeWidth}
      strokeDasharray={`${segmentLength} ${circumference}`}
      strokeLinecap="round"
      animatedProps={animatedProps}
    />
  );
}

interface ContentFormatDonutProps {
  topPosts: TopPost[];
  size?: number;
}

export const ContentFormatDonut: React.FC<ContentFormatDonutProps> = ({
  topPosts,
  size = 120,
}) => {
  const formatCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of topPosts) {
      map[p.format] = (map[p.format] ?? 0) + 1;
    }
    const total = topPosts.length || 1;
    return Object.entries(map).map(([format, count]) => ({
      format: format as ContentFormat,
      count,
      share: count / total,
    }));
  }, [topPosts]);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: motion.chartDraw.durationMs,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }, [progress]);

  if (formatCounts.length === 0) {
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
          Content format
        </Text>
        <View style={{ height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
            No data
          </Text>
        </View>
      </View>
    );
  }

  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

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
        Content format
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={colors.border.subtle}
            fill="transparent"
            strokeWidth={strokeWidth}
          />
          {formatCounts.map(({ format, share }) => {
            const segmentLength = share * circumference;
            const startOffset = offset;
            offset += segmentLength;
            return (
              <DonutSegment
                key={format}
                cx={cx}
                cy={cy}
                r={r}
                strokeWidth={strokeWidth}
                circumference={circumference}
                startOffset={startOffset}
                segmentLength={segmentLength}
                color={FORMAT_COLORS[format] ?? colors.text.muted}
                progress={progress}
              />
            );
          })}
        </Svg>
        <View style={{ flex: 1 }}>
          {formatCounts.map(({ format, count, share }) => (
            <View
              key={format}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.xs,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: FORMAT_COLORS[format] ?? colors.text.muted,
                  marginRight: spacing.sm,
                }}
              />
              <Text
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.sm,
                  color: colors.text.secondary,
                }}
              >
                {FORMAT_LABELS[format] ?? format} — {count} ({(share * 100).toFixed(0)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ContentFormatDonut;
