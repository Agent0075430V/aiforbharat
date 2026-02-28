import React from 'react';
import { Text, View } from 'react-native';
import Card from '../../components/ui/Card';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';
import { mockTodaySuggestion } from '../../constants/mockData.constants';

export const TodaySuggestion: React.FC = () => {
  const suggestion = mockTodaySuggestion;

  return (
    <Card>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          borderLeftWidth: 4,
          borderLeftColor: colors.gold.pure,
          paddingLeft: spacing.md,
        }}
      >
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.xs,
            color: colors.text.gold,
            marginBottom: spacing.xs,
          }}
        >
          ✨ Suggested for Today — {suggestion.platform.toUpperCase()}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.heading.medium,
            fontSize: 18,
            color: colors.text.primary,
          }}
        >
          {suggestion.topic}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: spacing.xs,
            fontFamily: fontFamilies.body.regular,
            fontSize: 14,
            color: colors.text.secondary,
          }}
        >
          {suggestion.captionPreview}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: spacing.sm,
            fontFamily: fontFamilies.body.regular,
            fontSize: 12,
            color: colors.text.muted,
          }}
        >
          📍 Best time: {suggestion.bestTimeToPost}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: spacing.sm,
            fontFamily: fontFamilies.body.medium,
            fontSize: 13,
            color: colors.text.gold,
          }}
        >
          Generate Now →
        </Text>
      </View>
    </Card>
  );
};

export default TodaySuggestion;

