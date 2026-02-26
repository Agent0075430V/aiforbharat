import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.void,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.gold.glow,
  },
  monogram: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 96,
    letterSpacing: 8,
    color: colors.gold.pure,
  },
  wordmark: {
    marginTop: 8,
    fontFamily: fontFamilies.display.regular,
    fontSize: 20,
    letterSpacing: 12,
    textTransform: 'lowercase',
    color: colors.text.primary,
  },
  tagline: {
    marginTop: 12,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.muted,
  },
});

