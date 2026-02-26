import { StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  inputWrapper: {
    borderRadius: radius.lg,
    backgroundColor: colors.background.surface,
    borderWidth: 1.5,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: colors.border.active,
  },
  textInput: {
    flex: 1,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    paddingVertical: spacing.xs,
  },
  placeholder: {
    color: colors.text.muted,
  },
  labelContainer: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.sm + 2,
  },
  labelText: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  helperText: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
  },
  errorText: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    color: colors.semantic.error,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

