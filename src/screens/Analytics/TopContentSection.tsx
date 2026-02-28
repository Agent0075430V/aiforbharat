import React from 'react';
import { View, Text } from 'react-native';
import Card from '../../components/ui/Card';
import type { TopPost } from '../../types/analytics.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface TopContentSectionProps {
  topPosts: TopPost[];
}

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
};

const formatLabel: Record<string, string> = {
  reel: 'Reel',
  carousel: 'Carousel',
  short: 'Short',
  post: 'Post',
  story: 'Story',
  long_video: 'Long',
  podcast: 'Podcast',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return d.toLocaleDateString();
}

export const TopContentSection: React.FC<TopContentSectionProps> = ({
  topPosts,
}) => {
  const sorted = [...topPosts].sort(
    (a, b) => (b.likes + b.saves) - (a.likes + a.saves)
  );

  return (
    <View>
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: fontSizes.lg,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        Top content
      </Text>
      {sorted.slice(0, 5).map((post, index) => (
        <Card
          key={post.id}
          style={{
            marginBottom: spacing.sm,
            borderRadius: radius.lg,
            padding: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: spacing.xs,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: radius.sm,
                backgroundColor: colors.gold.glow,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.mono.medium,
                  fontSize: fontSizes.xs,
                  color: colors.text.gold,
                }}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
              }}
            >
              {platformLabel[post.platform] ?? post.platform} · {formatLabel[post.format] ?? post.format} · {formatDate(post.postedAt)}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            {post.captionPreview}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: spacing.md,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.mono.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
              }}
            >
              ♥ {post.likes}
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.mono.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
              }}
            >
              💬 {post.comments}
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.mono.regular,
                fontSize: fontSizes.xs,
                color: colors.text.muted,
              }}
            >
              🔖 {post.saves}
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.mono.medium,
                fontSize: fontSizes.xs,
                color: colors.text.gold,
              }}
            >
              {post.engagementRate.toFixed(1)}% ER
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default TopContentSection;
