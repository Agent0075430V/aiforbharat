import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';

export interface RecentSet {
  id: string;
  label: string;
  tags: string[];
}

interface RecentSetsProps {
  sets: RecentSet[];
  onSelectSet?: (tags: string[]) => void;
}

export const RecentSets: React.FC<RecentSetsProps> = ({
  sets,
  onSelectSet,
}) => {
  const haptics = useHaptics();

  if (sets.length === 0) return null;

  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.sm,
        }}
      >
        Recent sets
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {sets.map((set) => (
          <Pressable
            key={set.id}
            onPress={() => {
              haptics.light();
              onSelectSet?.(set.tags);
            }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.border.subtle,
              marginRight: spacing.sm,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: colors.text.primary,
              }}
            >
              {set.label}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                marginTop: 2,
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
                maxWidth: 140,
              }}
            >
              {set.tags.join(' ')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentSets;
