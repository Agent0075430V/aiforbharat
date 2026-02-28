import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.base,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: spacing.sm,
    fontFamily: fontFamilies.display.regular,
    fontSize: fontSizes.lg,
    letterSpacing: 8,
    color: colors.text.primary,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 42,
    lineHeight: 46,
    color: colors.text.primary,
  },
  headingAccent: {
    color: colors.gold.light,
    fontStyle: 'italic',
  },
  subtext: {
    marginTop: spacing.md,
    fontFamily: fontFamilies.body.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  bottom: {
    paddingTop: spacing.lg,
  },
  secondaryCta: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontFamily: fontFamilies.body.medium,
    fontSize: 14,
    color: colors.text.secondary,
  },
  orbGoldLarge: {
    position: 'absolute',
    right: -80,
    top: -60,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: colors.gold.glowStrong,
    opacity: 0.15,
  },
  orbTeal: {
    position: 'absolute',
    left: -60,
    bottom: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.teal.glow,
    opacity: 0.1,
  },
  orbGoldSmall: {
    position: 'absolute',
    right: -20,
    bottom: 60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.gold.glow,
    opacity: 0.12,
  },
});

