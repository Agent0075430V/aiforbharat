import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  badgeText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  scoreValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.xl,
  },
  scoreMax: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.sm,
    color: colors.text.muted,
  },
  captionText: {
    marginTop: spacing.sm,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.6,
    color: colors.text.primary,
  },
  tipText: {
    marginTop: spacing.sm,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.gold,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});

