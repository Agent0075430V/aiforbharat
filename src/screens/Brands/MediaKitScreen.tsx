import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { MediaKit } from '../../types/brand.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

const FORMAT_LABEL: Record<string, string> = {
  reel: 'Reel', carousel: 'Carousel', short: 'Short', post: 'Post',
  story: 'Story', long_video: 'Long video', podcast: 'Podcast',
};

interface MediaKitScreenProps {
  mediaKit: MediaKit;
}

export const MediaKitScreen: React.FC<MediaKitScreenProps> = ({ mediaKit }) => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.xl,
          color: colors.text.primary,
          marginBottom: spacing.lg,
        }}
      >
        Media kit
      </Text>

      <View
        style={{
          padding: spacing.lg,
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          marginBottom: spacing.lg,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamilies.heading.medium,
            fontSize: fontSizes.lg,
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}
        >
          {mediaKit.displayName}
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.md,
            color: colors.text.secondary,
            lineHeight: 24,
          }}
        >
          {mediaKit.bio}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        }}
      >
        AUDIENCE
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}
      >
        {mediaKit.primaryAudience}
      </Text>

      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        }}
      >
        PLATFORMS
      </Text>
      {mediaKit.platforms.map((p) => (
        <View
          key={p.platform}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.hair,
            marginBottom: spacing.xs,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.primary,
              textTransform: 'capitalize',
            }}
          >
            {p.platform}
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.sm,
              color: colors.text.gold,
            }}
          >
            {(p.followers / 1000).toFixed(1)}k · {p.engagementRate.toFixed(1)}% ER
          </Text>
        </View>
      ))}

      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
          marginTop: spacing.md,
        }}
      >
        CONTENT FORMATS
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}
      >
        {mediaKit.topContentFormats.map((f) => FORMAT_LABEL[f] ?? f).join(', ')}
      </Text>

      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        }}
      >
        COLLABORATION TYPES
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}
      >
        {mediaKit.collaborationTypes.join(', ')}
      </Text>

      <Text
        style={{
          fontFamily: fontFamilies.heading.medium,
          fontSize: fontSizes.sm,
          color: colors.text.gold,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        }}
      >
        CONTACT
      </Text>
      <Text
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.teal,
        }}
      >
        {mediaKit.contactEmail}
      </Text>
    </ScrollView>
  );
};

export default MediaKitScreen;
