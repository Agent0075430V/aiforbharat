import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.base,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  section: {
    marginTop: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

