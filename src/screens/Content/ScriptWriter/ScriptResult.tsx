import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../../../components/ui/Card';
import type { ContentScript } from '../../../types/content.types';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

interface ScriptResultProps {
  script: ContentScript;
}

export const ScriptResult: React.FC<ScriptResultProps> = ({ script }) => {
  return (
    <ScrollView
      style={{ marginTop: spacing.xl }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <Card style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
        <View style={{ padding: spacing.lg }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.xs,
              color: colors.text.gold,
              letterSpacing: 1,
              marginBottom: spacing.xs,
            }}
          >
            HOOK
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.md,
              color: colors.text.primary,
              lineHeight: 24,
            }}
          >
            {script.hook}
          </Text>

          <Text
            style={{
              marginTop: spacing.lg,
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.xs,
              color: colors.text.gold,
              letterSpacing: 1,
              marginBottom: spacing.xs,
            }}
          >
            BODY
          </Text>
          {script.body.map((line, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                marginBottom: spacing.sm,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.mono.regular,
                  fontSize: fontSizes.xs,
                  color: colors.text.muted,
                  marginRight: spacing.sm,
                  width: 20,
                }}
              >
                {index + 1}.
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.md,
                  color: colors.text.primary,
                  lineHeight: 24,
                }}
              >
                {line}
              </Text>
            </View>
          ))}

          <Text
            style={{
              marginTop: spacing.lg,
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.xs,
              color: colors.text.gold,
              letterSpacing: 1,
              marginBottom: spacing.xs,
            }}
          >
            CTA
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.md,
              color: colors.text.primary,
              lineHeight: 24,
            }}
          >
            {script.cta}
          </Text>

          <Text
            style={{
              marginTop: spacing.lg,
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.xs,
              color: colors.text.muted,
            }}
          >
            Est. {script.estimatedDuration} · {script.platform}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

export default ScriptResult;
