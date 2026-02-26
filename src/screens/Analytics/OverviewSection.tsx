import React from 'react';
import { View, Text } from 'react-native';
import Card from '../../components/ui/Card';
import type { PlatformStats } from '../../types/analytics.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface OverviewSectionProps {
  contentHealthScore: number;
  platformStats: PlatformStats[];
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  contentHealthScore,
  platformStats,
}) => {
  const totalFollowers = platformStats.reduce((s, p) => s + p.followers, 0);
  const avgEngagement =
    platformStats.length > 0
      ? platformStats.reduce((s, p) => s + p.engagementRate, 0) / platformStats.length
      : 0;
  const totalPosts = platformStats.reduce((s, p) => s + p.totalPosts, 0);

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        Overview
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Card style={{ flex: 1, minWidth: 140, borderRadius: radius.lg, padding: spacing.md }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.xs,
              color: colors.text.muted,
              marginBottom: spacing.xs,
            }}
          >
            Content health
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.xxl,
              color: colors.teal.pure,
            }}
          >
            {contentHealthScore}
          </Text>
        </Card>
        <Card style={{ flex: 1, minWidth: 140, borderRadius: radius.lg, padding: spacing.md }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.xs,
              color: colors.text.muted,
              marginBottom: spacing.xs,
            }}
          >
            Total followers
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.xxl,
              color: colors.text.primary,
            }}
          >
            {(totalFollowers / 1000).toFixed(1)}k
          </Text>
        </Card>
        <Card style={{ flex: 1, minWidth: 140, borderRadius: radius.lg, padding: spacing.md }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.xs,
              color: colors.text.muted,
              marginBottom: spacing.xs,
            }}
          >
            Avg. engagement
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.xxl,
              color: colors.text.gold,
            }}
          >
            {avgEngagement.toFixed(1)}%
          </Text>
        </Card>
        <Card style={{ flex: 1, minWidth: 140, borderRadius: radius.lg, padding: spacing.md }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.xs,
              color: colors.text.muted,
              marginBottom: spacing.xs,
            }}
          >
            Posts ({platformStats[0]?.platform === 'instagram' ? 'IG' : 'all'})
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.xxl,
              color: colors.text.primary,
            }}
          >
            {totalPosts}
          </Text>
        </Card>
      </View>
    </View>
  );
};

export default OverviewSection;
