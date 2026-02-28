import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import OverviewSection from './OverviewSection';
import FollowerGrowthChart from './FollowerGrowthChart';
import EngagementChart from './EngagementChart';
import ContentFormatDonut from './ContentFormatDonut';
import TopContentSection from './TopContentSection';
import AIInsightsSection from './AIInsightsSection';
import Card from '../../components/ui/Card';
import { mockAnalyticsData } from '../../constants/mockData.constants';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

export const AnalyticsScreen: React.FC = () => {
  const data = mockAnalyticsData;

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
          marginBottom: spacing.lg,
        }}
      >
        Analytics
      </Text>

      <OverviewSection
        contentHealthScore={data.contentHealthScore}
        platformStats={data.platformStats}
      />

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
