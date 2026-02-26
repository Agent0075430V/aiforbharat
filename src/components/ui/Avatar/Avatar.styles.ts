import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import { radius } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    padding: 2,
    borderRadius: radius.full,
  },
  image: {
    borderRadius: radius.full,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  initials: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.md,
    color: colors.text.primary,
  },
});

