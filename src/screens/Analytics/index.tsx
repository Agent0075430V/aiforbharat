import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import OverviewSection from './OverviewSection';
import FollowerGrowthChart from './FollowerGrowthChart';
import EngagementChart from './EngagementChart';
import ContentFormatDonut from './ContentFormatDonut';
import TopContentSection from './TopContentSection';
import AIInsightsSection from './AIInsightsSection';
import PlatformBreakdown from './PlatformBreakdown';
import Card from '../../components/ui/Card';
import { mockAnalyticsData } from '../../constants/mockData.constants';
import { useDrafts } from '../../store/DraftsContext';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

export const AnalyticsScreen: React.FC = () => {
  const data = mockAnalyticsData;
  const { drafts } = useDrafts();

  // Use real draft count in health score (rough heuristic)
  const realHealthScore = drafts.length === 0
    ? 0
    : Math.min(100, 50 + drafts.length * 5);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.xl,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        Analytics
      </Text>

      {/* Demo data notice */}
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          backgroundColor: `${colors.teal.pure}15`,
          borderWidth: 1,
          borderColor: `${colors.teal.pure}40`,
          marginBottom: spacing.lg,
          gap: spacing.xs,
        }}
      >
        <Text style={{ fontSize: 14 }}>📊</Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.xs,
            color: colors.teal.light ?? colors.text.secondary,
            flex: 1,
          }}
        >
          Showing demo data. Connect your Instagram/YouTube to see real analytics.
        </Text>
      </View>

      <OverviewSection
        contentHealthScore={drafts.length > 0 ? realHealthScore : data.contentHealthScore}
        platformStats={data.platformStats}
      />

      <View style={{ marginTop: spacing.xl }}>
        <PlatformBreakdown platformStats={data.platformStats} />
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Card style={{ padding: spacing.md, borderRadius: radius.lg }}>
          <FollowerGrowthChart
            data={data.followerHistory}
            height={180}
          />
        </Card>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Card style={{ padding: spacing.md, borderRadius: radius.lg }}>
          <EngagementChart
            data={data.dailyEngagement}
            height={160}
            metric="likes"
          />
        </Card>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Card style={{ padding: spacing.md, borderRadius: radius.lg }}>
          <ContentFormatDonut topPosts={data.topPosts} size={120} />
        </Card>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <TopContentSection topPosts={data.topPosts} />
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <AIInsightsSection insights={data.aiInsights} />
      </View>
    </ScrollView>
  );
};

export default AnalyticsScreen;
