import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BrandStackParamList } from '../../types/navigation.types';
import ActiveDeals from './ActiveDeals';
import Card from '../../components/ui/Card';
import useHaptics from '../../hooks/useHaptics';
import { mockBrandDeals } from '../../constants/mockData.constants';
import type { BrandDeal } from '../../types/brand.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

type Nav = NativeStackNavigationProp<BrandStackParamList, 'Brands'>;

export const BrandsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const haptics = useHaptics();

  const handleDealPress = (deal: BrandDeal) => {
    haptics.light();
    navigation.navigate('DealDetail', { dealId: deal.id });
  };

  const handleMediaKitPress = () => {
    haptics.light();
    navigation.navigate('MediaKit');
  };

  const handlePricingPress = () => {
    haptics.light();
    navigation.navigate('PricingCalculator');
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
        Brands
      </Text>

      <ActiveDeals deals={mockBrandDeals} onDealPress={handleDealPress} />

      <View style={{ marginTop: spacing.xl }}>
        <Text
          style={{
            fontFamily: fontFamilies.heading.semibold,
            fontSize: fontSizes.lg,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Tools
        </Text>
        <Pressable onPress={handlePricingPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
          <Card
            style={{
              marginBottom: spacing.sm,
              borderRadius: radius.lg,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, marginRight: spacing.sm }}>🧮</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fontFamilies.heading.medium,
                  fontSize: fontSizes.md,
                  color: colors.text.primary,
                }}
              >
                Pricing calculator
              </Text>
              <Text
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.sm,
                  color: colors.text.muted,
                }}
              >
                Estimate deal fees
              </Text>
            </View>
            <Text style={{ color: colors.text.muted }}>→</Text>
          </Card>
        </Pressable>
        <Pressable onPress={handleMediaKitPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
          <Card
            style={{
              borderRadius: radius.lg,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, marginRight: spacing.sm }}>📄</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fontFamilies.heading.medium,
                  fontSize: fontSizes.md,
                  color: colors.text.primary,
                }}
              >
                Media kit
              </Text>
              <Text
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.sm,
                  color: colors.text.muted,
                }}
              >
                Share your stats with brands
              </Text>
            </View>
            <Text style={{ color: colors.text.muted }}>→</Text>
          </Card>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default BrandsScreen;
