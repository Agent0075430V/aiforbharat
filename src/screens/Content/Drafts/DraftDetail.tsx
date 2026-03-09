import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { ContentStackParamList } from '../../../types/navigation.types';
import MedioraHeader from '../../../components/layout/MedioraHeader';
import { useDrafts } from '../../../store/DraftsContext';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

type DraftDetailRouteProp = RouteProp<ContentStackParamList, 'DraftDetail'>;

export const DraftDetailScreen: React.FC = () => {
  const route = useRoute<DraftDetailRouteProp>();
  const { draftId } = route.params;
  const { getDraft } = useDrafts();
  const draft = getDraft(draftId);

  if (!draft) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
        <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
          Draft not found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <MedioraHeader showBack />
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: fontFamilies.heading.semibold,
            fontSize: fontSizes.xl,
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}
        >
          {draft.topic}
        </Text>
        <Text
          style={{
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.muted,
            textTransform: 'capitalize',
            marginBottom: spacing.lg,
          }}
        >
          {draft.platform} · {draft.format} · {draft.status}
        </Text>

        {draft.script ? (
          <View
            style={{
              padding: spacing.md,
              backgroundColor: colors.background.surface,
              borderRadius: radius.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.xs,
                color: colors.text.gold,
                letterSpacing: 1,
                marginBottom: spacing.xs,
              }}
            >
              SCRIPT
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: colors.text.primary,
                marginBottom: spacing.xs,
              }}
            >
              {draft.script.hook}
            </Text>
            {draft.script.body?.map((p, i) => (
              <Text
                key={i}
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.md,
                  color: colors.text.primary,
                  lineHeight: 24,
                  marginBottom: spacing.xs,
                }}
              >
                {p}
              </Text>
            ))}
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.sm,
                color: colors.text.gold,
              }}
            >
              CTA: {draft.script.cta}
            </Text>
          </View>
        ) : (
          <View
            style={{
              padding: spacing.md,
              backgroundColor: colors.background.surface,
              borderRadius: radius.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.xs,
                color: colors.text.gold,
                letterSpacing: 1,
                marginBottom: spacing.xs,
              }}
            >
              CAPTION
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.md,
                color: colors.text.primary,
                lineHeight: 24,
              }}
            >
              {draft.caption.text}
            </Text>
          </View>
        )}

        {draft.hashtags.length > 0 && (
          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontFamily: fontFamilies.body.medium,
                fontSize: fontSizes.xs,
                color: colors.text.gold,
                letterSpacing: 1,
                marginBottom: spacing.xs,
              }}
            >
              HASHTAGS
            </Text>
            <Text
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.secondary,
              }}
            >
              {draft.hashtags.join(' ')}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border.hair,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.sm,
              color: colors.text.muted,
            }}
          >
            Best time: {draft.bestTimeToPost}
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.sm,
              color: colors.text.gold,
            }}
          >
            Score {draft.engagementScore}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DraftDetailScreen;
