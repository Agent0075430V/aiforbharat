import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './Avatar.styles';
import colors from '../../../theme/colors';

interface AvatarProps {
  size?: number;
  uri?: string;
  initials?: string;
  ringColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 48,
  uri,
  initials,
  ringColor = colors.teal.pure,
}) => {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[styles.ring, { borderColor: ringColor }, dimensionStyle]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, dimensionStyle]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, dimensionStyle]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
    </View>
  );
};

export default Avatar;

