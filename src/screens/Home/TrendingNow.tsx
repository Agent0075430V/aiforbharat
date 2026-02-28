import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { mockTrendingNow } from '../../constants/mockData.constants';
import { spacing, radius } from '../../theme/spacing';
import colors from '../../theme/colors';
import { fontFamilies, fontSizes } from '../../theme/typography';

export const TrendingNow: React.FC = () => {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: 14,
          color: colors.text.secondary,
          marginBottom: spacing.sm,
        }}
      >
        Trending now
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {mockTrendingNow.map((item) => (
          <View
            key={item.tag}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.border.subtle,
              backgroundColor: colors.background.surface,
              marginRight: spacing.sm,
            }}
          >
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: 13,
                color: colors.text.primary,
              }}
            >
              {item.tag} · {item.volume}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TrendingNow;

