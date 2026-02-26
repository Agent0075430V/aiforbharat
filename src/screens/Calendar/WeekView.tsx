import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { CalendarDay } from '../../types/calendar.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { motion } from '../../theme/animations';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface WeekViewProps {
  days: CalendarDay[];
  weekLabel: string;
  onDayPress: (day: CalendarDay) => void;
}

function DayCell({
  day,
  index,
  onPress,
}: {
  day: CalendarDay | null;
  index: number;
  onPress: () => void;
}) {
  const entering = useCallback(
    () =>
      FadeInDown.delay(index * motion.entry.staggerMs)
        .duration(motion.entry.duration)
        .springify(),
    [index]
  );

  if (!day) {
    return (
      <Animated.View
        entering={entering()}
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.hair,
          margin: spacing.xs,
          minHeight: 88,
        }}
      />
    );
  }

  const dayNum = day.date.split('-')[2];
  const statusColor =
    day.status === 'scheduled'
      ? colors.teal.dim
      : day.status === 'posted'
        ? colors.semantic.success
        : colors.gold.glow;

  return (
    <Animated.View
      entering={entering()}
      style={{ flex: 1, minWidth: 0, margin: spacing.xs }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: colors.border.subtle,
          padding: spacing.sm,
          minHeight: 88,
          opacity: pressed ? 0.9 : 1,
          borderLeftWidth: 3,
          borderLeftColor: statusColor,
        })}
      >
        <Text
          style={{
            fontFamily: fontFamilies.mono.medium,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
          }}
        >
          {dayNum}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.xs,
            color: colors.text.primary,
            marginTop: spacing.xs,
          }}
        >
          {day.topic || '—'}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: 10,
            color: colors.text.muted,
            marginTop: 2,
          }}
        >
          {day.bestTimeToPost}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export const WeekView: React.FC<WeekViewProps> = ({
  days,
  weekLabel,
  onDayPress,
}) => {
  const byDayOfWeek = React.useMemo(() => {
    const map: (CalendarDay | null)[] = [null, null, null, null, null, null, null];
    for (const d of days) {
      const date = new Date(d.date);
      const dow = date.getDay();
      const idx = dow === 0 ? 6 : dow - 1;
      map[idx] = d;
    }
    return map;
  }, [days]);

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
        {weekLabel}
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: spacing.xs }}>
        {DAY_LABELS.map((label) => (
          <View
            key={label}
            style={{
              flex: 1,
              alignItems: 'center',
              marginHorizontal: spacing.xs,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {byDayOfWeek.map((day, index) => (
          <DayCell
            key={day?.date ?? `empty-${index}`}
            day={day}
            index={index}
            onPress={() => day && onDayPress(day)}
          />
        ))}
      </View>
    </View>
  );
};

export default WeekView;
