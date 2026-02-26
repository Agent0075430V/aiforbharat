import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.surface,
  },
  default: {
    borderColor: colors.border.subtle,
  },
  success: {
    borderColor: colors.semantic.success,
    backgroundColor: colors.teal.dim,
  },
  warning: {
    borderColor: colors.semantic.warning,
  },
  danger: {
    borderColor: colors.semantic.error,
  },
  label: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
});

