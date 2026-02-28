import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const onboardingStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.gold,
    backgroundColor: colors.background.surface,
  },
  chipLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
    color: colors.text.gold,
  },
  introHeading: {
    marginTop: spacing.lg,
    fontFamily: fontFamilies.display.semibold,
    fontSize: 40,
    lineHeight: 44,
    color: colors.text.primary,
  },
  introBody: {
    marginTop: spacing.md,
    fontFamily: fontFamilies.body.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
  },
  statValue: {
    marginTop: 2,
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
  },
  platformsCollage: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  platformBadge: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformText: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.primary,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  quizQuestionMeta: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
  },
  quizQuestionTitle: {
    marginTop: spacing.sm,
    fontFamily: fontFamilies.display.semibold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text.primary,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border.hair,
    overflow: 'hidden',
    flex: 1,
    marginLeft: spacing.sm,
  },
  optionGrid: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionTile: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  optionTileSelected: {
    borderColor: colors.border.active,
    backgroundColor: colors.gold.glow,
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  optionLabel: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
  },
  optionDescription: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
  bottomBar: {
    marginTop: 'auto',
  },
});

