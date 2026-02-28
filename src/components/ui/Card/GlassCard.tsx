import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Card from './index';
import { styles } from './Card.styles';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
}) => {
  return (
    <Card onPress={onPress} style={[styles.base, styles.glass, style]}>
      {children}
    </Card>
  );
};

export default GlassCard;

