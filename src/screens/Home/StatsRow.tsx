import React from 'react';
import { View } from 'react-native';
import StatCard from '../../components/ui/Card/StatCard';
import { useDrafts } from '../../store/DraftsContext';
import { spacing } from '../../theme/spacing';

export const StatsRow: React.FC = () => {
  const { drafts } = useDrafts();

  // Real data from DraftsContext
  const totalDrafts = drafts.length;

  // Count drafts posted this week
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  const postedThisWeek = drafts.filter(
    (d) => d.status === 'posted' && new Date(d.updatedAt) >= weekStart
  ).length;

  // Streak: consecutive days with at least one draft updated
  const streakDays = calcStreak(drafts);

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
        <StatCard label="Drafts" value={totalDrafts} sublabel="saved" />
      </View>
      <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
        <StatCard
          label="Posted"
          value={postedThisWeek}
          sublabel="this week"
        />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <StatCard label="Streak 🔥" value={streakDays} sublabel="days" />
      </View>
    </View>
  );
};

/** Count consecutive days ending today where at least one draft was touched */
function calcStreak(drafts: { updatedAt: string }[]): number {
  if (!drafts.length) return 0;
  const dates = new Set(
    drafts.map((d) => new Date(d.updatedAt).toISOString().slice(0, 10))
  );
  let streak = 0;
  const cur = new Date();
  while (true) {
    const key = cur.toISOString().slice(0, 10);
    if (!dates.has(key)) break;
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export default StatsRow;
