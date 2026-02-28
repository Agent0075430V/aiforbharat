import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation.types';
import useHaptics from '../../hooks/useHaptics';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList, 'App'>;

export const VoiceFAB: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const haptics = useHaptics();

  return (
    <Pressable
      onPress={() => {
        haptics.light();
        navigation.navigate('VoiceAgent');
      }}
      style={({ pressed }) => ({
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.xxl,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: radius.full,
          backgroundColor: colors.gold.glowStrong,
          borderWidth: 1.5,
          borderColor: colors.border.gold,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.full,
            backgroundColor: colors.background.elevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.display.semibold,
              fontSize: 28,
              color: colors.gold.pure,
            }}
          >
            ●
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default VoiceFAB;

