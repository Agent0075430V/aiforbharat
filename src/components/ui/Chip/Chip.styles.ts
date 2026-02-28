import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.surface,
  },
  containerSelected: {
    borderColor: colors.border.active,
    backgroundColor: colors.teal.dim,
  },
  label: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  labelSelected: {
    color: colors.teal.pure,
  },
});

