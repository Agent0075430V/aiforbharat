import React from 'react';
import { ScrollView, View } from 'react-native';
import { homeStyles as styles } from './styles/Home.styles';
import GreetingHeader from './GreetingHeader';
import ContentHealthScore from './ContentHealthScore';
import StatsRow from './StatsRow';
import TodaySuggestion from './TodaySuggestion';
import WeekStreak from './WeekStreak';
import TrendingNow from './TrendingNow';
import RecentDrafts from './RecentDrafts';

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <GreetingHeader />
      <ContentHealthScore />
      <StatsRow />
      <View style={styles.section}>
        <TodaySuggestion />
      </View>
      <WeekStreak />
      <TrendingNow />
      <RecentDrafts />
    </ScrollView>
  );
};

export default HomeScreen;

