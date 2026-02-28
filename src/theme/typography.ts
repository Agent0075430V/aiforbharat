export const fontFamilies = {
  display: {
    regular: 'CormorantGaramond_400Regular',
    medium: 'CormorantGaramond_500Medium',
    semibold: 'CormorantGaramond_600SemiBold',
  },
  heading: {
    regular: 'Syne_400Regular',
    medium: 'Syne_500Medium',
    semibold: 'Syne_600SemiBold',
    bold: 'Syne_700Bold',
  },
  body: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
  },
  mono: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    bold: 'JetBrainsMono_700Bold',
  },
} as const;

export type FontFamilies = typeof fontFamilies;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  displaySm: 32,
  displayMd: 36,
  displayLg: 42,
} as const;

export type FontSizes = typeof fontSizes;

export const lineHeights = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.35,
  relaxed: 1.5,
} as const;

export const letterSpacings = {
  normal: 0,
  tight: -0.3,
  wide: 0.6,
  ultraWide: 1.2,
} as const;

export type TextVariant =
  | 'displayHero'
  | 'displaySubtitle'
  | 'screenTitle'
  | 'sectionTitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'monoSmall'
  | 'monoNumber';

export interface TextStyleConfig {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

export const textVariants: Record<TextVariant, TextStyleConfig> = {
  displayHero: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: fontSizes.displayLg,
    lineHeight: fontSizes.displayLg * lineHeights.snug,
    letterSpacing: letterSpacings.wide,
  },
  displaySubtitle: {
    fontFamily: fontFamilies.display.regular,
    fontSize: fontSizes.displaySm,
    lineHeight: fontSizes.displaySm * lineHeights.normal,
  },
  screenTitle: {
    fontFamily: fontFamilies.heading.semibold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.snug,
  },
  sectionTitle: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  body: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.relaxed,
  },
  bodySmall: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  caption: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  monoSmall: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  monoNumber: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.snug,
    letterSpacing: letterSpacings.tight,
  },
};

export default {
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacings,
  textVariants,
};
