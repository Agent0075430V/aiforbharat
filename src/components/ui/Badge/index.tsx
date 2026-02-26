import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './Badge.styles';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default Badge;

