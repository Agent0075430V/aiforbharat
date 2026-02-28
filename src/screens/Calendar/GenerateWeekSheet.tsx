import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/ui/Button';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface GenerateWeekSheetProps {
  weekLabel: string;
  onGenerate: () => void;
  onClose: () => void;
  loading?: boolean;
}

export const GenerateWeekSheet: React.FC<GenerateWeekSheetProps> = ({
  weekLabel,
  onGenerate,
  onClose,
  loading = false,
}) => {
  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.xs,
        }}
      >
        Generate week
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}
      >
        {weekLabel}
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.md,
          color: colors.text.secondary,
          marginBottom: spacing.xl,
        }}
      >
        Create content ideas and suggested times for each day of this week based on your profile and goals.
      </Text>
      <Button
        title={loading ? 'Generating…' : 'Generate week'}
        variant="primary"
        loading={loading}
        onPress={onGenerate}
      />
      <View style={{ height: spacing.md }} />
      <Button
        title="Cancel"
        variant="ghost"
        onPress={onClose}
      />
    </View>
  );
};

export default GenerateWeekSheet;
