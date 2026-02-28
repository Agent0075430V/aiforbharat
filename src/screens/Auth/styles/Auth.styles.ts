import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const authStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.base,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  brandCenter: {
    flex: 1,
    alignItems: 'center',
  },
  brandText: {
    fontFamily: fontFamilies.display.regular,
    fontSize: fontSizes.lg,
    letterSpacing: 8,
    color: colors.text.primary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  formTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 32,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    color: colors.text.gold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.hair,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
  },
  footerRow: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  footerLink: {
    color: colors.text.gold,
  },
});

