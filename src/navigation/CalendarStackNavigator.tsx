import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CalendarStackParamList } from '../types/navigation.types';
import CalendarScreen from '../screens/Calendar';

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
};

export default CalendarStackNavigator;

