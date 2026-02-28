import React from 'react';
import { Text, TextProps } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../../theme/gradients';

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <MaskedView
      maskElement={
        <Text {...rest} style={[style, { backgroundColor: 'transparent' }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={gradients.goldVertical.colors}
        start={gradients.goldVertical.start}
        end={gradients.goldVertical.end}
      >
        <Text {...rest} style={[style, { opacity: 0 }]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;

