import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

interface OrbParticlesProps {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
}

export const OrbParticles: React.FC<OrbParticlesProps> = ({
  visible,
  style,
}) => {
  if (!visible) return null;

  return (
    <View pointerEvents="none" style={style}>
      <LottieView
        source={require('../../../../assets/lottie/ai-thinking.json')}
        autoPlay
        loop
      />
    </View>
  );
};

export default OrbParticles;

