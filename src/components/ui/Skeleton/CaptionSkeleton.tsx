import React from 'react';
import { View } from 'react-native';
import Skeleton from './index';
import { spacing, radius } from '../../../theme/spacing';

export const CaptionSkeleton: React.FC = () => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        padding: spacing.md,
        borderRadius: radius.lg,
      }}
    >
      <Skeleton width="40%" height={14} />
      <View style={{ height: spacing.sm }} />
      <Skeleton width="90%" height={14} />
      <View style={{ height: spacing.xs }} />
      <Skeleton width="80%" height={14} />
      <View style={{ height: spacing.xs }} />
      <Skeleton width="65%" height={14} />
    </View>
  );
};

export default CaptionSkeleton;

