import React from 'react';
import { View, TextInput } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

interface HashtagSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const HashtagSearch: React.FC<HashtagSearchProps> = ({
  value,
  onChangeText,
  placeholder = 'Search or describe your topic...',
}) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
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
        }}
      />
    </View>
  );
};

export default HashtagSearch;
