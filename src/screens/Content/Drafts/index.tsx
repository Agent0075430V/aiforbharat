import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ContentStackParamList } from '../../../types/navigation.types';
import Card from '../../../components/ui/Card';
import useHaptics from '../../../hooks/useHaptics';
import { useDrafts } from '../../../store/DraftsContext';
import type { Draft } from '../../../types/content.types';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

type Nav = NativeStackNavigationProp<ContentStackParamList, 'DraftsList'>;

export const DraftsListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const haptics = useHaptics();
  const { drafts } = useDrafts();

  const handleDraftPress = (draft: Draft) => {
    haptics.light();
    navigation.navigate('DraftDetail', { draftId: draft.id });
  };

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
        Drafts
      </Text>
      {drafts.length === 0 ? (
        <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
          No drafts yet
        </Text>
      ) : (
        drafts.map((draft) => (
          <Pressable
            key={draft.id}
            onPress={() => handleDraftPress(draft)}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <Card style={{ marginBottom: spacing.sm, borderRadius: radius.lg, padding: spacing.md }}>
              <Text style={{ fontFamily: fontFamilies.heading.medium, fontSize: fontSizes.md, color: colors.text.primary }}>
                {draft.topic}
              </Text>
              <Text
                numberOfLines={2}
                style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.secondary, marginTop: spacing.xs }}
              >
                {draft.caption.text}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm }}>
                <Text style={{ fontFamily: fontFamilies.mono.regular, fontSize: fontSizes.xs, color: colors.text.muted, textTransform: 'capitalize' }}>
                  {draft.platform} · {draft.format}
                </Text>
                <Text style={{ fontFamily: fontFamilies.mono.medium, fontSize: fontSizes.xs, color: colors.text.gold }}>
                  Score {draft.engagementScore}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
};

export default DraftsListScreen;
