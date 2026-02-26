import React from 'react';
import { Text, View } from 'react-native';
import GoldBorderCard from '../../components/ui/Card/GoldBorderCard';
import ProgressRing from '../../components/ui/ProgressRing';
import { mockContentHealth } from '../../constants/mockData.constants';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

export const ContentHealthScore: React.FC = () => {
  const data = mockContentHealth;

  return (
    <GoldBorderCard>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.display.semibold,
                fontSize: 68,
                color: colors.gold.light,
                lineHeight: 68,
              }}
            >
              {data.score}
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginLeft: 4,
                fontFamily: fontFamilies.display.regular,
                fontSize: 24,
                color: colors.text.muted,
              }}
            >
              /100
            </Text>
          </View>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginTop: spacing.xs,
              fontFamily: fontFamilies.heading.medium,
              fontSize: 13,
              letterSpacing: 1,
              color: colors.text.secondary,
            }}
          >
            CONTENT HEALTH
          </Text>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              marginTop: spacing.sm,
            }}
          >
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginRight: spacing.sm,
                fontFamily: fontFamilies.body.medium,
                fontSize: 11,
                color: colors.text.secondary,
              }}
            >
              Quality ✓
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginRight: spacing.sm,
                fontFamily: fontFamilies.body.medium,
                fontSize: 11,
                color: colors.text.secondary,
              }}
            >
              Consistency ✓
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: 11,
                color: colors.text.secondary,
              }}
            >
              Engagement ↑
            </Text>
          </View>
        </View>
        <ProgressRing size={120} strokeWidth={8} progress={data.score} />
      </View>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: spacing.md,
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.gold,
        }}
      >
        💡 {data.tip}
      </Text>
    </GoldBorderCard>
  );
};

export default ContentHealthScore;

