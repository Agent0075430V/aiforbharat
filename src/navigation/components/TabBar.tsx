import React from 'react';
import { View, Pressable, Text } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import useHaptics from '../../hooks/useHaptics';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

const LABELS: Record<string, string> = {
  HomeStack: 'Home',
  ContentStack: 'Content',
  CalendarStack: 'Calendar',
  AnalyticsStack: 'Analytics',
  BrandStack: 'Brands',
};

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeStack: 'home-outline',
  ContentStack: 'create-outline',
  CalendarStack: 'calendar-outline',
  AnalyticsStack: 'bar-chart-outline',
  BrandStack: 'briefcase-outline',
};

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const haptics = useHaptics();

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background.elevated,
        borderTopWidth: 1,
        borderTopColor: colors.border.hair,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          haptics.light();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const label = LABELS[route.name] ?? route.name;
        const iconName = ICONS[route.name] ?? 'ellipse-outline';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: isFocused
                  ? colors.background.surface
                  : colors.background.elevated,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={iconName}
                  size={18}
                  color={isFocused ? colors.gold.pure : colors.text.muted}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    fontFamily: fontFamilies.body.medium,
                    fontSize: fontSizes.xs,
                    color: isFocused ? colors.text.gold : colors.text.muted,
                  }}
                >
                  {label}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default TabBar;

