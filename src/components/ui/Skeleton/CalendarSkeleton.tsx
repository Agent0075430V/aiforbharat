import React from 'react';
import { View } from 'react-native';
import Skeleton from './index';
import { spacing } from '../../../theme/spacing';

export const CalendarSkeleton: React.FC = () => {
  return (
    <View>
      <Skeleton width="60%" height={18} />
      <View style={{ height: spacing.md }} />
      {[0, 1, 2].map((row) => (
        <View
          key={row}
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <Skeleton key={col} width={36} height={36} borderRadius={12} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default CalendarSkeleton;

