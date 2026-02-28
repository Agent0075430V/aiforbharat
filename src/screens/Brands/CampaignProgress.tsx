import React from 'react';
import { View, Text } from 'react-native';
import type { DealStatus } from '../../types/brand.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

const STEPS: DealStatus[] = [
  'inquiry',
  'negotiating',
  'brief_received',
  'draft_submitted',
  'approved',
  'live',
  'completed',
];

const STEP_LABEL: Record<DealStatus, string> = {
  inquiry: 'Inquiry',
  negotiating: 'Negotiating',
  brief_received: 'Brief',
  draft_submitted: 'Draft',
  approved: 'Approved',
  live: 'Live',
  completed: 'Done',
};

interface CampaignProgressProps {
  currentStatus: DealStatus;
}

export const CampaignProgress: React.FC<CampaignProgressProps> = ({
  currentStatus,
}) => {
  const currentIndex = STEPS.indexOf(currentStatus);
  if (currentIndex < 0) return null;

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.sm,
        }}
      >
        Campaign progress
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step}>
              <View style={{ alignItems: 'center', maxWidth: 56 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: radius.md,
                    backgroundColor: isCompleted
                      ? colors.teal.dim
                      : isCurrent
                        ? colors.gold.glow
                        : colors.background.surface,
                    borderWidth: 1.5,
                    borderColor: isCompleted
                      ? colors.teal.pure
                      : isCurrent
                        ? colors.border.active
                        : colors.border.subtle,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isCompleted ? (
                    <Text style={{ fontSize: 12, color: colors.teal.pure }}>✓</Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: fontFamilies.mono.medium,
                        fontSize: fontSizes.xs,
                        color: isCurrent ? colors.text.gold : colors.text.muted,
                      }}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fontFamilies.body.regular,
                    fontSize: 10,
                    color: isCurrent ? colors.text.primary : colors.text.muted,
                    marginTop: spacing.xs,
                    textAlign: 'center',
                  }}
                >
                  {STEP_LABEL[step]}
                </Text>
              </View>
              {!isLast && (
                <View
                  style={{
                    width: 12,
                    height: 2,
                    backgroundColor: isCompleted ? colors.teal.pure : colors.border.subtle,
                    marginHorizontal: 2,
                    marginBottom: 20,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default CampaignProgress;
