import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AnalyticsStackParamList } from '../types/navigation.types';
import AnalyticsScreen from '../screens/Analytics';

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

export const AnalyticsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
};

export default AnalyticsStackNavigator;

