import React from 'react';
import { View, Text, Pressable } from 'react-native';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import useHaptics from '../../../hooks/useHaptics';
import type { Language } from '../../../types/profile.types';

const LANGUAGES: Language[] = ['English', 'Hindi', 'Hinglish'];

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  const haptics = useHaptics();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md }}>
      <Text
        style={{
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
          marginRight: spacing.sm,
        }}
      >
        Language
      </Text>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {LANGUAGES.map((lang, index) => {
          const selected = value === lang;
          const label = lang === 'English' ? 'EN' : lang === 'Hindi' ? 'HI' : 'Hinglish';
          return (
            <React.Fragment key={lang}>
              {index > 0 && (
                <Text
                  style={{
                    alignSelf: 'center',
                    marginHorizontal: spacing.xs,
                    fontFamily: fontFamilies.body.regular,
                    fontSize: fontSizes.xs,
                    color: colors.text.muted,
                  }}
                >
                  |
                </Text>
              )}
              <Pressable
                onPress={() => {
                  haptics.light();
                  onChange(lang);
                }}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamilies.body.medium,
                    fontSize: fontSizes.sm,
                    color: selected ? colors.text.gold : colors.text.secondary,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default LanguageSelector;
