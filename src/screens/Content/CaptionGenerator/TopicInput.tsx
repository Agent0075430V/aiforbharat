import React from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';

const QUICK_TOPICS = [
  'My morning routine',
  'Product review',
  'Workout tip',
  'Behind the scenes',
  'Q&A response',
  'Life update',
];

interface TopicInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  value,
  onChangeText,
  placeholder = "Describe your post... (e.g. 'A morning routine reel showing my 5am gym routine in winter')",
}) => {
  const haptics = useHaptics();

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={{
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.md,
          color: colors.text.primary,
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: colors.border.subtle,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 100,
        }}
      />
      <Text
        style={{
          marginTop: spacing.sm,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        Quick topics
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {QUICK_TOPICS.map((t) => (
          <Pressable
            key={t}
            onPress={() => {
              haptics.light();
              onChangeText(t);
            }}
            style={{
              fontFamily: fontFamilies.body.regular,
              fontSize: fontSizes.sm,
              color: colors.text.gold,
              marginRight: spacing.sm,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.border.gold,
              overflow: 'hidden',
            }}
          >
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.gold }}>
              {t}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopicInput;
