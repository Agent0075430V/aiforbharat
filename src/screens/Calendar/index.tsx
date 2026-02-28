import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { startOfWeek, endOfWeek, format, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import BottomSheet, { type BottomSheetRef } from '../../components/ui/BottomSheet';
import WeekView from './WeekView';
import MonthView from './MonthView';
import GenerateWeekSheet from './GenerateWeekSheet';
import DayDetailSheet from './DayDetailSheet';
import type { CalendarDay } from '../../types/calendar.types';
import { mockCalendarDays, mockInfluencerProfile } from '../../constants/mockData.constants';
import { useProfile } from '../../store/ProfileContext';
import { generateWeeklyPlan } from '../../services/api';
import useHaptics from '../../hooks/useHaptics';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

type ViewMode = 'week' | 'month';

function getWeekLabel(weekStart: Date): string {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  return `${format(weekStart, 'd MMM')} – ${format(weekEnd, 'd MMM yyyy')}`;
}

export const CalendarScreen: React.FC = () => {
  const haptics = useHaptics();
  const { profile } = useProfile();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [generatingWeek, setGeneratingWeek] = useState(false);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>(mockCalendarDays);

  const generateSheetRef = useRef<BottomSheetRef>(null);
  const dayDetailSheetRef = useRef<BottomSheetRef>(null);

  const weekLabel = useMemo(() => getWeekLabel(weekStart), [weekStart]);

  const weekDays = useMemo(() => {
    const start = weekStart.getTime();
    const end = endOfWeek(weekStart, { weekStartsOn: 1 }).getTime();
    return calendarDays.filter((d) => {
      const t = new Date(d.date).getTime();
      return t >= start && t <= end;
    });
  }, [weekStart, calendarDays]);

  const daysInMonth = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    return calendarDays.filter((d) => {
      const [dy, dm] = d.date.split('-').map(Number);
      return dy === y && dm - 1 === m;
    });
  }, [currentMonth, calendarDays]);

  useEffect(() => {
    if (selectedDay) {
      dayDetailSheetRef.current?.snapToIndex(0);
    }
  }, [selectedDay]);

  const handleOpenGenerateSheet = () => {
    haptics.light();
    generateSheetRef.current?.snapToIndex(0);
  };

  const handleCloseGenerateSheet = () => {
    generateSheetRef.current?.snapToIndex(-1);
  };

  const handleGenerateWeek = async () => {
    setGeneratingWeek(true);
    const profileOrMock = profile ?? mockInfluencerProfile;
    const weekStartStr = format(weekStart, 'yyyy-MM-dd');
    try {
      const plan = await generateWeeklyPlan(profileOrMock, weekStartStr);
      const newDays = plan?.days ?? [];
      setCalendarDays((prev) => {
        const weekDates = new Set(newDays.map((d) => d.date));
        const rest = prev.filter((d) => !weekDates.has(d.date));
        return [...rest, ...newDays].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });
    } finally {
      setGeneratingWeek(false);
    }
  };

  const handleDayPress = (day: CalendarDay) => {
    haptics.light();
    setSelectedDay(day);
  };

  const handleCloseDayDetail = () => {
    setSelectedDay(null);
    dayDetailSheetRef.current?.snapToIndex(-1);
  };

  const handleMonthSelectDate = (date: string) => {
    haptics.light();
    setSelectedDate(date);
    const day = calendarDays.find((d) => d.date === date);
    if (day) {
      setSelectedDay(day);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <ScrollView
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
          Calendar
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <Pressable
            onPress={() => {
              haptics.light();
              setViewMode('week');
            }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.lg,
              backgroundColor:
                viewMode === 'week' ? colors.gold.glow : colors.background.surface,
              borderWidth: 1,
              borderColor:
                viewMode === 'week' ? colors.border.active : colors.border.subtle,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: viewMode === 'week' ? colors.text.gold : colors.text.secondary,
              }}
            >
              Week
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              haptics.light();
              setViewMode('month');
            }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.lg,
              backgroundColor:
                viewMode === 'month' ? colors.gold.glow : colors.background.surface,
              borderWidth: 1,
              borderColor:
                viewMode === 'month' ? colors.border.active : colors.border.subtle,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: viewMode === 'month' ? colors.text.gold : colors.text.secondary,
              }}
            >
              Month
            </Text>
          </Pressable>
        </View>

        {viewMode === 'week' && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Pressable
                onPress={() => {
                  haptics.light();
                  setWeekStart((w) => subWeeks(w, 1));
                }}
                style={{ padding: spacing.sm }}
              >
                <Text style={{ fontSize: 18, color: colors.text.gold }}>←</Text>
              </Pressable>
              <Text
                style={{
                  fontFamily: fontFamilies.body.medium,
                  fontSize: fontSizes.sm,
                  color: colors.text.secondary,
                }}
              >
                {weekLabel}
              </Text>
              <Pressable
                onPress={() => {
                  haptics.light();
                  setWeekStart((w) => addWeeks(w, 1));
                }}
                style={{ padding: spacing.sm }}
              >
                <Text style={{ fontSize: 18, color: colors.text.gold }}>→</Text>
              </Pressable>
            </View>
            <WeekView
              days={weekDays}
              weekLabel={weekLabel}
              onDayPress={handleDayPress}
            />
            <Pressable
              onPress={handleOpenGenerateSheet}
              style={{
                marginTop: spacing.xl,
                paddingVertical: spacing.md,
                alignItems: 'center',
                backgroundColor: colors.background.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border.subtle,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.body.medium,
                  fontSize: fontSizes.md,
                  color: colors.text.gold,
                }}
              >
                Generate week
              </Text>
            </Pressable>
          </>
        )}

        {viewMode === 'month' && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}
            >
              <Pressable
                onPress={() => {
                  haptics.light();
                  setCurrentMonth((m) => subMonths(m, 1));
                }}
                style={{ padding: spacing.sm }}
              >
                <Text style={{ fontSize: 18, color: colors.text.gold }}>←</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  haptics.light();
                  setCurrentMonth((m) => addMonths(m, 1));
                }}
                style={{ padding: spacing.sm }}
              >
                <Text style={{ fontSize: 18, color: colors.text.gold }}>→</Text>
              </Pressable>
            </View>
            <MonthView
              month={currentMonth}
              selectedDate={selectedDate}
              daysInMonth={daysInMonth}
              onSelectDate={handleMonthSelectDate}
            />
          </>
        )}
      </ScrollView>

      <BottomSheet
        ref={generateSheetRef}
        initialIndex={-1}
        snapPoints={['40%']}
        onClose={handleCloseGenerateSheet}
      >
        <GenerateWeekSheet
          weekLabel={weekLabel}
          onGenerate={handleGenerateWeek}
          onClose={handleCloseGenerateSheet}
          loading={generatingWeek}
        />
      </BottomSheet>

      <BottomSheet
        ref={dayDetailSheetRef}
        initialIndex={-1}
        snapPoints={['50%', '85%']}
        onClose={handleCloseDayDetail}
      >
        {selectedDay ? (
          <DayDetailSheet day={selectedDay} onClose={handleCloseDayDetail} />
        ) : null}
      </BottomSheet>
    </View>
  );
};

export default CalendarScreen;
