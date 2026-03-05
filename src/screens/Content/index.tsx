import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ContentStackParamList } from '../../types/navigation.types';
import Card from '../../components/ui/Card';
import useHaptics from '../../hooks/useHaptics';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

type Nav = NativeStackNavigationProp<ContentStackParamList, 'ContentHub'>;

export const ContentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const haptics = useHaptics();

  const navTo = (screen: keyof ContentStackParamList) => {
    haptics.light();
    navigation.navigate(screen as never);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.base }}
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
          marginBottom: spacing.lg,
        }}
      >
        Content
      </Text>

      <Pressable onPress={() => navTo('CaptionGenerator')} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <Card
          style={{
            marginBottom: spacing.sm,
            borderRadius: radius.lg,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, marginRight: spacing.sm }}>✍️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamilies.heading.medium, fontSize: fontSizes.md, color: colors.text.primary }}>
              Caption generator
            </Text>
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
              Generate captions for your posts
            </Text>
          </View>
          <Text style={{ color: colors.text.muted }}>→</Text>
        </Card>
      </Pressable>

      <Pressable onPress={() => navTo('HashtagStudio')} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <Card
          style={{
            marginBottom: spacing.sm,
            borderRadius: radius.lg,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, marginRight: spacing.sm }}>#</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamilies.heading.medium, fontSize: fontSizes.md, color: colors.text.primary }}>
              Hashtag studio
            </Text>
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
              Find and save hashtag sets
            </Text>
          </View>
          <Text style={{ color: colors.text.muted }}>→</Text>
        </Card>
      </Pressable>

      <Pressable onPress={() => navTo('ScriptWriter')} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <Card
          style={{
            marginBottom: spacing.sm,
            borderRadius: radius.lg,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, marginRight: spacing.sm }}>🎬</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamilies.heading.medium, fontSize: fontSizes.md, color: colors.text.primary }}>
              Script writer
            </Text>
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
              Reel & short scripts with hook, body, CTA
            </Text>
          </View>
          <Text style={{ color: colors.text.muted }}>→</Text>
        </Card>
      </Pressable>

      <Pressable onPress={() => navTo('DraftsList')} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <Card
          style={{
            borderRadius: radius.lg,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, marginRight: spacing.sm }}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fontFamilies.heading.medium, fontSize: fontSizes.md, color: colors.text.primary }}>
              Drafts
            </Text>
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
              View and edit your drafts
            </Text>
          </View>
          <Text style={{ color: colors.text.muted }}>→</Text>
        </Card>
      </Pressable>
    </ScrollView>
  );
};

export default ContentScreen;
