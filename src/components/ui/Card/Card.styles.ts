import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    shadowColor: shadows.cardSoft.shadowColor,
    shadowOffset: shadows.cardSoft.shadowOffset,
    shadowOpacity: shadows.cardSoft.shadowOpacity,
    shadowRadius: shadows.cardSoft.shadowRadius,
    elevation: shadows.cardSoft.elevation,
  },
  glass: {
    backgroundColor: colors.background.glass,
    borderColor: colors.border.hair,
  },
  goldBorder: {
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  stat: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 

