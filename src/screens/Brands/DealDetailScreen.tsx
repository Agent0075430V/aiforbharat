import React, { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BrandStackParamList } from '../../types/navigation.types';
import { mockBrandDeals } from '../../constants/mockData.constants';
import DealDetail from './DealDetail';

type DealDetailRouteProp = RouteProp<BrandStackParamList, 'DealDetail'>;
type Nav = NativeStackNavigationProp<BrandStackParamList, 'DealDetail'>;

export const DealDetailScreen: React.FC = () => {
  const route = useRoute<DealDetailRouteProp>();
  const navigation = useNavigation<Nav>();
  const { dealId } = route.params;
  const deal = mockBrandDeals.find((d) => d.id === dealId);

  useEffect(() => {
    if (!deal && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [deal, navigation]);

  if (!deal) {
    return null;
  }

  return <DealDetail deal={deal} />;
};

export default DealDetailScreen;
