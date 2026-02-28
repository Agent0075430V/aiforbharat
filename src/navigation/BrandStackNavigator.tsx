import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BrandStackParamList } from '../types/navigation.types';
import BrandsScreen from '../screens/Brands';
import DealDetailScreen from '../screens/Brands/DealDetailScreen';
import MediaKitScreenWrapper from '../screens/Brands/MediaKitScreenWrapper';
import PricingCalculator from '../screens/Brands/PricingCalculator';

const Stack = createNativeStackNavigator<BrandStackParamList>();

export const BrandStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="DealDetail" component={DealDetailScreen} />
      <Stack.Screen name="MediaKit" component={MediaKitScreenWrapper} />
      <Stack.Screen name="PricingCalculator" component={PricingCalculator} />
    </Stack.Navigator>
  );
};

export default BrandStackNavigator;

