import React from 'react';
import { View } from 'react-native';
import StatCard from '../../components/ui/Card/StatCard';
import { mockHomeStats } from '../../constants/mockData.constants';
import { spacing } from '../../theme/spacing';

export const StatsRow: React.FC = () => {
  const stats = mockHomeStats;

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.lg,
      }}
    >
      <View style={{ flex: 1, marginRight: spacing.sm }}>
        <StatCard label="Drafts" value={stats.drafts} sublabel="saved" />
      </View>
      <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
        <StatCard
          label="Posted"
          value={stats.postedThisWeek}
          sublabel="this week"
        />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <StatCard label="Streak 🔥" value={stats.streakDays} sublabel="days" />
      </View>
    </View>
  );
};

export default StatsRow;

