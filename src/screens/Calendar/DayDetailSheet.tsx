import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { CalendarDay } from '../../types/calendar.types';
import Button from '../../components/ui/Button';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface DayDetailSheetProps {
  day: CalendarDay;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  approved: 'Approved',
  scheduled: 'Scheduled',
  posted: 'Posted',
};

export const DayDetailSheet: React.FC<DayDetailSheetProps> = ({
  day,
  onClose,
}) => {
  const statusLabel = STATUS_LABEL[day.status] ?? day.status;

  return (
    <ScrollView
      style={{ maxHeight: 400 }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.xs,
        }}
      >
        {day.dayName}, {day.date}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
          gap: spacing.sm,
        }}
      >
        <View
          style={{
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            borderRadius: radius.full,
            backgroundColor:
              day.status === 'scheduled'
                ? colors.teal.dim
                : day.status === 'posted'
                  ? colors.semantic.success + '22'
                  : colors.gold.glow,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.xs,
              color:
                day.status === 'scheduled'
                  ? colors.teal.pure
                  : day.status === 'posted'
                    ? colors.semantic.success
                    : colors.text.gold,
            }}
          >
            {statusLabel}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
            textTransform: 'capitalize',
          }}
        >
          {day.platform} · {day.format}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        }}
      >
        TOPIC
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.md,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        {day.topic}
      </Text>

      <Text
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        }}
      >
        CAPTION PREVIEW
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.md,
        }}
      >
        {day.captionPreview || '—'}
      </Text>

      {day.hashtags.length > 0 && (
        <>
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.xs,
              color: colors.text.gold,
              letterSpacing: 1,
              marginBottom: spacing.xs,
            }}
          >
            HASHTAGS
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.sm,
              color: colors.text.secondary,
              marginBottom: spacing.md,
            }}
          >
            {day.hashtags.join(' ')}
          </Text>
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: spacing.sm,
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.border.hair,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
          }}
        >
          Best time: {day.bestTimeToPost}
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.mono.medium,
            fontSize: fontSizes.sm,
            color: colors.text.gold,
          }}
        >
          Score {day.engagementScore}
        </Text>
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button title="Close" variant="ghost" onPress={onClose} />
      </View>
    </ScrollView>
  );
};

export default DayDetailSheet;
