import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import { shadows } from '../../../theme/shadows';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: shadows.floatingOrb.shadowColor,
    shadowOpacity: shadows.floatingOrb.shadowOpacity,
    shadowRadius: shadows.floatingOrb.shadowRadius,
    shadowOffset: shadows.floatingOrb.shadowOffset,
    elevation: shadows.floatingOrb.elevation,
  },
  innerOrb: {
    width: 168,
    height: 168,
    borderRadius: 84,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.base,
    borderWidth: 1,
    borderColor: colors.border.hair,
  },
  monogram: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 64,
    letterSpacing: 4,
    color: colors.gold.pure,
  },
  subtitle: {
    marginTop: spacing.lg,
    fontFamily: fontFamilies.display.regular,
    fontSize: fontSizes.xl,
    color: colors.text.secondary,
  },
  hint: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.muted,
  },
  transcriptCard: {
    marginTop: spacing.lg,
    maxWidth: 320,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  transcriptLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  transcriptText: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
});

