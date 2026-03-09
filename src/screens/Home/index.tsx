import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { homeStyles as styles } from './styles/Home.styles';
import GreetingHeader from './GreetingHeader';
import ContentHealthScore from './ContentHealthScore';
import StatsRow from './StatsRow';
import TodaySuggestion from './TodaySuggestion';
import WeekStreak from './WeekStreak';
import TrendingNow from './TrendingNow';
import RecentDrafts from './RecentDrafts';
import MedioraHeader from '../../components/layout/MedioraHeader';
import { useDrafts } from '../../store/DraftsContext';
import { useAuth } from '../../store/AuthContext';

export const HomeScreen: React.FC = () => {
  const { syncFromServer } = useDrafts();
  const { token: authUserId } = useAuth();

  // Sync drafts from DynamoDB once when the Home screen first mounts
  // (i.e. right after login/signup → navigate to App)
  useEffect(() => {
    const doSync = async () => {
      try {
        // Prefer the live auth token; fall back to the one stored by LoginScreen
        const userId = authUserId ?? await AsyncStorage.getItem('last_user_id');
        if (userId) {
          await syncFromServer(userId);
        }
      } catch {
        // Non-fatal — drafts will still load from local AsyncStorage
      }
    };
    doSync();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MedioraHeader showBack={false} />
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
    </View>
  );
};

export default HomeScreen;

