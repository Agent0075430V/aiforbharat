import React from 'react';
import { mockMediaKit } from '../../constants/mockData.constants';
import MediaKitScreen from './MediaKitScreen';

export const MediaKitScreenWrapper: React.FC = () => {
  return <MediaKitScreen mediaKit={mockMediaKit} />;
};

export default MediaKitScreenWrapper;
