import React from 'react';
import { View } from 'react-native';
import Skeleton from './index';
import { spacing } from '../../../theme/spacing';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <View>
      <Skeleton width="50%" height={18} />
      <View style={{ height: spacing.md }} />
      <Skeleton width="100%" height={120} />
      <View style={{ height: spacing.md }} />
      <Skeleton width="100%" height={80} />
    </View>
  );
};

export default AnalyticsSkeleton;

