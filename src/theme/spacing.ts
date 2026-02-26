export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type Spacing = typeof spacing;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export type Radius = typeof radius;

export const layout = {
  screenPaddingHorizontal: spacing.lg,
  screenPaddingVertical: spacing.lg,
  cardPadding: spacing.md,
  chipPaddingHorizontal: spacing.sm,
  chipPaddingVertical: 6,
  inputPaddingHorizontal: spacing.md,
} as const;

export default {
  spacing,
  radius,
  layout,
};
