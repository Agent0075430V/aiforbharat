import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Card from '../../components/ui/Card';
import type { BrandDeal } from '../../types/brand.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

const STATUS_LABEL: Record<string, string> = {
  inquiry: 'Inquiry',
  negotiating: 'Negotiating',
  brief_received: 'Brief received',
  draft_submitted: 'Draft submitted',
  approved: 'Approved',
  live: 'Live',
  completed: 'Completed',
};

interface ActiveDealsProps {
  deals: BrandDeal[];
  onDealPress: (deal: BrandDeal) => void;
}

export const ActiveDeals: React.FC<ActiveDealsProps> = ({
  deals,
  onDealPress,
}) => {
  if (deals.length === 0) {
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
          Active deals
        </Text>
        <Card
          style={{
            padding: spacing.xl,
            borderRadius: radius.lg,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.sm,
              color: colors.text.muted,
            }}
          >
            No active deals yet
          </Text>
        </Card>
      </View>
    );
  }

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
        Active deals
      </Text>
      {deals.map((deal) => (
        <Pressable
          key={deal.id}
          onPress={() => onDealPress(deal)}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <Card
            style={{
              marginBottom: spacing.sm,
              borderRadius: radius.lg,
              padding: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: spacing.xs,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.heading.medium,
                  fontSize: fontSizes.md,
                  color: colors.text.primary,
                }}
              >
                {deal.brandName}
              </Text>
              <View
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: radius.full,
                  backgroundColor: colors.gold.glow,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamilies.body.medium,
                    fontSize: fontSizes.xs,
                    color: colors.text.gold,
                  }}
                >
                  {STATUS_LABEL[deal.status] ?? deal.status}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              {deal.campaignName}
            </Text>
            {deal.agreedFee != null && (
              <Text
                style={{
                  fontFamily: fontFamilies.mono.medium,
                  fontSize: fontSizes.sm,
                  color: colors.teal.pure,
                }}
              >
                ₹{deal.agreedFee.toLocaleString()}
              </Text>
            )}
          </Card>
        </Pressable>
      ))}
    </View>
  );
};

export default ActiveDeals;
