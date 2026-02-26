import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import { shadows } from '../../../theme/shadows';
import type { ButtonVariant } from './Button.types';

export const getButtonContainerStyle = (
  variant: ButtonVariant,
  disabled?: boolean
) => {
  const base = {
    height: 52,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const disabledOpacity = disabled ? 0.5 : 1;

  switch (variant) {
    case 'secondary':
      return [
        base,
        {
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.border.gold,
          shadowColor: 'transparent',
          opacity: disabledOpacity,
        },
      ];
    case 'ghost':
      return [
        base,
        {
          backgroundColor: 'transparent',
          borderWidth: 0,
          opacity: disabledOpacity,
        },
      ];
    case 'danger':
      return [
        base,
        {
          backgroundColor: colors.semantic.error,
          shadowColor: shadows.cardStrong.shadowColor,
          shadowOpacity: shadows.cardStrong.shadowOpacity,
          shadowRadius: shadows.cardStrong.shadowRadius,
          shadowOffset: shadows.cardStrong.shadowOffset,
          elevation: shadows.cardStrong.elevation,
          opacity: disabledOpacity,
        },
      ];
    case 'primary':
    default:
      return [
        base,
        {
          backgroundColor: colors.gold.pure,
          shadowColor: colors.gold.pure,
          shadowOpacity: shadows.goldGlow.shadowOpacity,
          shadowRadius: shadows.goldGlow.shadowRadius,
          shadowOffset: shadows.goldGlow.shadowOffset,
          elevation: shadows.goldGlow.elevation,
          opacity: disabledOpacity,
        },
      ];
  }
};

export const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  titlePrimary: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.md,
    color: colors.background.base,
  },
  titleSecondary: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.md,
    color: colors.gold.pure,
  },
  titleGhost: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  titleDanger: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.md,
    color: colors.common.white,
  },
  spinner: {
    marginRight: spacing.sm,
  },
});

