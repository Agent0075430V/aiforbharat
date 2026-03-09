import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import CampaignProgress from './CampaignProgress';
import DeliverablesList from './DeliverablesList';
import MedioraHeader from '../../components/layout/MedioraHeader';
import type { BrandDeal } from '../../types/brand.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface DealDetailProps {
  deal: BrandDeal;
}

export const DealDetail: React.FC<DealDetailProps> = ({ deal }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <MedioraHeader showBack />
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
            marginBottom: spacing.xs,
          }}
        >
          {deal.brandName}
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.md,
            color: colors.text.secondary,
            marginBottom: spacing.lg,
          }}
        >
          {deal.campaignName}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
            marginBottom: spacing.xl,
          }}
        >
          {deal.agreedFee != null && (
            <View
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                backgroundColor: colors.teal.dim,
                borderRadius: radius.lg,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.mono.medium,
                  fontSize: fontSizes.md,
                  color: colors.teal.pure,
                }}
              >
                ₹{deal.agreedFee.toLocaleString()}
              </Text>
            </View>
          )}
          <View
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              backgroundColor: colors.background.surface,
              borderRadius: radius.lg,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.secondary,
              }}
            >
              {deal.startDate} – {deal.endDate}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: spacing.xl }}>
          <CampaignProgress currentStatus={deal.status} />
        </View>

        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.muted,
              marginBottom: spacing.sm,
            }}
          >
            Objective
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.md,
              color: colors.text.primary,
            }}
          >
            {deal.objective}
          </Text>
        </View>

        <DeliverablesList deliverables={deal.deliverables} />
      </ScrollView>
    </View>
  );
};

export default DealDetail;
