import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MedioraHeader from '../../components/layout/MedioraHeader';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

export const PricingCalculator: React.FC = () => {
  const [ratePerPost, setRatePerPost] = useState('');
  const [numPosts, setNumPosts] = useState('');
  const [usageFee, setUsageFee] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const rate = parseFloat(ratePerPost) || 0;
    const posts = parseInt(numPosts, 10) || 0;
    const usage = parseFloat(usageFee) || 0;
    const total = rate * posts + usage;
    setResult(Number.isNaN(total) ? null : total);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <MedioraHeader showBack />
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontFamily: fontFamilies.heading.semibold,
            fontSize: fontSizes.xl,
            color: colors.text.primary,
            marginBottom: spacing.lg,
          }}
        >
          Pricing calculator
        </Text>

        <Card style={{ padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.lg }}>
          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.secondary,
              marginBottom: spacing.xs,
            }}
          >
            Rate per post (₹)
          </Text>
          <TextInput
            value={ratePerPost}
            onChangeText={setRatePerPost}
            placeholder="e.g. 15000"
            placeholderTextColor={colors.text.muted}
            keyboardType="numeric"
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.md,
              color: colors.text.primary,
              backgroundColor: colors.background.surface,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}
          />

          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.secondary,
              marginTop: spacing.md,
              marginBottom: spacing.xs,
            }}
          >
            Number of posts
          </Text>
          <TextInput
            value={numPosts}
            onChangeText={setNumPosts}
            placeholder="e.g. 3"
            placeholderTextColor={colors.text.muted}
            keyboardType="numeric"
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.md,
              color: colors.text.primary,
              backgroundColor: colors.background.surface,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}
          />

          <Text
            style={{
              fontFamily: fontFamilies.body.medium,
              fontSize: fontSizes.sm,
              color: colors.text.secondary,
              marginTop: spacing.md,
              marginBottom: spacing.xs,
            }}
          >
            Usage / licensing fee (₹)
          </Text>
          <TextInput
            value={usageFee}
            onChangeText={setUsageFee}
            placeholder="e.g. 5000"
            placeholderTextColor={colors.text.muted}
            keyboardType="numeric"
            style={{
              fontFamily: fontFamilies.mono.medium,
              fontSize: fontSizes.md,
              color: colors.text.primary,
              backgroundColor: colors.background.surface,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border.subtle,
            }}
          />

          <Button
            title="Calculate"
            variant="primary"
            onPress={handleCalculate}
            style={{ marginTop: spacing.xl }}
          />

          {result !== null && (
            <View
              style={{
                marginTop: spacing.lg,
                padding: spacing.md,
                backgroundColor: colors.teal.dim,
                borderRadius: radius.lg,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilies.body.regular,
                  fontSize: fontSizes.sm,
                  color: colors.text.muted,
                  marginBottom: spacing.xs,
                }}
              >
                Total fee
              </Text>
              <Text
                style={{
                  fontFamily: fontFamilies.mono.medium,
                  fontSize: fontSizes.xxl,
                  color: colors.teal.pure,
                }}
              >
                ₹{result.toLocaleString()}
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

export default PricingCalculator;
