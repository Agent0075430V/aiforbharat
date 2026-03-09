import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../../theme/gradients';

/**
 * GradientText — renders text with a gold gradient colour.
 *
 * NOTE: @react-native-masked-view/masked-view is not installed, so we use a
 * LinearGradient background with a semi-transparent text overlay as a fallback.
 * The text will appear gold-tinted rather than a true per-character gradient.
 */

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <LinearGradient
        colors={gradients.goldVertical.colors}
        start={gradients.goldVertical.start}
        end={gradients.goldVertical.end}
        style={{ borderRadius: 4 }}
      >
        <Text
          {...rest}
          style={[
            style,
            { color: 'transparent', backgroundColor: 'transparent' },
          ]}
        >
          {children}
        </Text>
      </LinearGradient>
      {/* Absolute text overlay so it appears gold */}
      <Text
        {...rest}
        style={[
          style,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            color: '#C8A96E',
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

export default GradientText;
