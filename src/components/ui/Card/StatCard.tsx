import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './Card.styles';
import colors from '../../../theme/colors';
import { fontFamilies, fontSizes } from '../../../theme/typography';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  style,
}) => {
  return (
    <View style={[styles.base, styles.stat, style]}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          fontFamily: fontFamilies.mono.medium,
          fontSize: fontSizes.lg,
          color: colors.gold.light,
        }}
      >
        {value}
      </Text>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: 4,
          fontFamily: fontFamilies.body.medium,
          fontSize: fontSizes.xs,
          color: colors.text.secondary,
        }}
      >
        {label}
      </Text>
      {sublabel ? (
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: 2,
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.xs,
            color: colors.text.muted,
          }}
        >
          {sublabel}
        </Text>
      ) : null}
    </View>
  );
};

export default StatCard;

