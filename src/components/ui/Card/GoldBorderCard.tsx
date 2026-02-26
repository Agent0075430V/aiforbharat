import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Card from './index';
import { styles } from './Card.styles';

interface GoldBorderCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const GoldBorderCard: React.FC<GoldBorderCardProps> = ({
  children,
  style,
  onPress,
}) => {
  return (
    <Card onPress={onPress} style={[styles.base, styles.goldBorder, style]}>
      {children}
    </Card>
  );
};

export default GoldBorderCard;

