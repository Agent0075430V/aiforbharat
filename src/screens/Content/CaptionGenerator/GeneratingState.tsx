import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import CaptionSkeleton from '../../../components/ui/Skeleton/CaptionSkeleton';
import Card from '../../../components/ui/Card';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

const MESSAGES = [
  'Matching your tone...',
  'Crafting the hook...',
  'Scoring engagement potential...',
];

const aiThinkingLottie = require('../../../../assets/lottie/ai-thinking.json');

export const GeneratingState: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ alignItems: 'center' }}>
        <LottieView
          source={aiThinkingLottie}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text
          style={{
            marginTop: spacing.sm,
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
          }}
        >
          {MESSAGES[index]}
        </Text>
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Card style={{ marginBottom: spacing.md, borderRadius: radius.lg }}>
          <CaptionSkeleton />
        </Card>
        <Card style={{ marginBottom: spacing.md, borderRadius: radius.lg }}>
          <CaptionSkeleton />
        </Card>
        <Card style={{ borderRadius: radius.lg }}>
          <CaptionSkeleton />
        </Card>
      </View>
    </View>
  );
};

export default GeneratingState;
