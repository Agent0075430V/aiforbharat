import React from 'react';
import { Text, View } from 'react-native';
import ProgressBar from '../../ui/ProgressBar';
import colors from '../../../theme/colors';
import { fontFamilies, fontSizes } from '../../../theme/typography';

interface EngagementMeterProps {
  score: number; // 0–100
}

export const EngagementMeter: React.FC<EngagementMeterProps> = ({ score }) => {
  let color = colors.semantic.error;
  if (score >= 80) color = colors.semantic.success;
  else if (score >= 60) color = colors.semantic.warning;

  return (
    <View>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.xs,
            color: colors.text.secondary,
          }}
        >
          Engagement score
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.mono.medium,
            fontSize: fontSizes.xs,
            color,
          }}
        >
          {score}/100
        </Text>
      </View>
      <ProgressBar progress={score} />
    </View>
  );
};

export default EngagementMeter;

