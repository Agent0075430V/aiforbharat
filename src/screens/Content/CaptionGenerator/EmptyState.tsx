import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import Button from '../../../components/ui/Button';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

interface EmptyStateProps {
  onGenerate?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onGenerate }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl,
      }}
    >
      <LottieView
        source={require('../../../../assets/lottie/empty-state.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text
        style={{
          marginTop: spacing.lg,
          fontFamily: fontFamilies.heading.medium,
          fontSize: 18,
          color: colors.text.primary,
          textAlign: 'center',
        }}
      >
        No captions yet
      </Text>
      <Text
        style={{
          marginTop: spacing.sm,
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
          textAlign: 'center',
          paddingHorizontal: spacing.xl,
        }}
      >
        Describe your post above and tap Generate to get captions that sound like you.
      </Text>
      {onGenerate && (
        <Button
          title="Generate captions"
          onPress={onGenerate}
          style={{ marginTop: spacing.lg, width: '100%' }}
        />
      )}
    </View>
  );
};

export default EmptyState;
