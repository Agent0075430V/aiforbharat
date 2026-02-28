import React from 'react';
import { View, Text } from 'react-native';
import Card from '../../components/ui/Card';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface AIInsightsSectionProps {
  insights: string[];
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  insights,
}) => {
  if (insights.length === 0) return null;

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        AI insights
      </Text>
      {insights.map((insight, index) => (
        <Card
          key={index}
          style={{
            marginBottom: spacing.sm,
            borderRadius: radius.lg,
            padding: spacing.md,
            borderLeftWidth: 3,
            borderLeftColor: colors.teal.dim,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.sm,
              color: colors.text.secondary,
              lineHeight: 22,
            }}
          >
            {insight}
          </Text>
        </Card>
      ))}
    </View>
  );
};

export default AIInsightsSection;
