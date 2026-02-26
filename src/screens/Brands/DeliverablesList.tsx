import React from 'react';
import { View, Text } from 'react-native';
import type { Deliverable } from '../../types/brand.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

const FORMAT_LABEL: Record<string, string> = {
  reel: 'Reel',
  carousel: 'Carousel',
  short: 'Short',
  post: 'Post',
  story: 'Story',
  long_video: 'Long video',
  podcast: 'Podcast',
};

interface DeliverablesListProps {
  deliverables: Deliverable[];
}

export const DeliverablesList: React.FC<DeliverablesListProps> = ({
  deliverables,
}) => {
  if (deliverables.length === 0) {
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
          Deliverables
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.muted,
          }}
        >
          No deliverables yet
        </Text>
      </View>
    );
  }

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
        Deliverables
      </Text>
      {deliverables.map((d) => (
        <View
          key={d.id}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.background.surface,
            borderRadius: radius.lg,
            borderLeftWidth: 3,
            borderLeftColor: d.isCompleted ? colors.teal.pure : colors.gold.dim,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: d.isCompleted ? colors.teal.dim : colors.background.elevated,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.sm,
            }}
          >
            {d.isCompleted ? (
              <Text style={{ fontSize: 12, color: colors.teal.pure }}>✓</Text>
            ) : (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.text.muted,
                }}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: colors.text.primary,
              }}
            >
              {FORMAT_LABEL[d.type] ?? d.type} · {d.platform}
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              {d.description}
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.mono.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
                marginTop: spacing.xs,
              }}
            >
              Due {d.dueDate}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default DeliverablesList;
