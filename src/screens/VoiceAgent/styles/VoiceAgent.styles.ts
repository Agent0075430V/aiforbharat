import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const voiceAgentStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.base,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContainer: {
    marginTop: spacing.xl,
  },
});

export {};
