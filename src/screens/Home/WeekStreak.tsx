import React from 'react';
import { Text, View } from 'react-native';
import Card from '../../components/ui/Card';
import { mockWeekStreak } from '../../constants/mockData.constants';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import colors from '../../theme/colors';

export const WeekStreak: React.FC = () => {
  const { currentStreak, target } = mockWeekStreak;
  const progress = Math.min(100, (currentStreak / target) * 100);

  return (
    <Card
      style={{
        marginTop: spacing.md,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
        }}
      >
        Week streak
      </Text>
      <Text
        style={{
          marginTop: spacing.xs,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.md,
          color: colors.text.primary,
        }}
      >
        {currentStreak} / {target} days
      </Text>
      <View
        style={{
          marginTop: spacing.sm,
          height: 6,
          borderRadius: 999,
          backgroundColor: colors.border.hair,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: 999,
            backgroundColor: colors.teal.pure,
          }}
        />
      </View>
    </Card>
  );
};

export default WeekStreak;

