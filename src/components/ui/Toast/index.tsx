import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import colors from '../../../theme/colors';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import { radius, spacing } from '../../../theme/spacing';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.semantic.success,
        backgroundColor: colors.background.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        paddingHorizontal: spacing.md,
      }}
      contentContainerStyle={{ paddingHorizontal: spacing.sm }}
      text1Style={{
        fontFamily: fontFamilies.body.medium,
        fontSize: fontSizes.sm,
        color: colors.text.primary,
      }}
      text2Style={{
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.xs,
        color: colors.text.secondary,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.semantic.error,
        backgroundColor: colors.background.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        fontFamily: fontFamilies.body.medium,
        fontSize: fontSizes.sm,
        color: colors.text.primary,
      }}
      text2Style={{
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.xs,
        color: colors.text.secondary,
      }}
    />
  ),
};

export const MedioraToast = () => <Toast config={toastConfig} />;

export default MedioraToast;

