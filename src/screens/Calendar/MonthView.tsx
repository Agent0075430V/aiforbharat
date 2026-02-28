import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import type { CalendarDay } from '../../types/calendar.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MonthViewProps {
  month: Date;
  selectedDate: string | null;
  daysInMonth: CalendarDay[];
  onSelectDate: (date: string) => void;
}

function dateToKey(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export const MonthView: React.FC<MonthViewProps> = ({
  month,
  selectedDate,
  daysInMonth,
  onSelectDate,
}) => {
  const daysByDate = React.useMemo(() => {
    const map: Record<string, CalendarDay[]> = {};
    for (const d of daysInMonth) {
      if (!map[d.date]) map[d.date] = [];
      map[d.date].push(d);
    }
    return map;
  }, [daysInMonth]);

  const grid = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const rows: Date[][] = [];
    let current = start;
    while (current <= end) {
      const row: Date[] = [];
      for (let i = 0; i < 7; i++) {
        row.push(current);
        current = addDays(current, 1);
      }
      rows.push(row);
    }
    return rows;
  }, [month]);

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        {format(month, 'MMMM yyyy')}
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
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row' }}>
          {row.map((d) => {
            const key = dateToKey(d);
            const inMonth = isSameMonth(d, month);
            const selected = selectedDate !== null && isSameDay(parseISO(selectedDate), d);
            const hasPosts = (daysByDate[key]?.length ?? 0) > 0;

            return (
              <Pressable
                key={key}
                onPress={() => onSelectDate(key)}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  maxHeight: 44,
                  margin: 2,
                  borderRadius: radius.sm,
                  backgroundColor: selected
                    ? colors.gold.glow
                    : inMonth
                      ? colors.background.surface
                      : colors.background.base,
                  borderWidth: selected ? 1.5 : 0,
                  borderColor: colors.border.active,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamilies.mono.medium,
                    fontSize: fontSizes.sm,
                    color: inMonth
                      ? selected
                        ? colors.text.gold
                        : colors.text.primary
                      : colors.text.muted,
                  }}
                >
                  {format(d, 'd')}
                </Text>
                {hasPosts && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.teal.pure,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default MonthView;
