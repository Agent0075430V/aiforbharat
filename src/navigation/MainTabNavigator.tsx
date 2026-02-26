import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import ContentStackNavigator from './ContentStackNavigator';
import CalendarStackNavigator from './CalendarStackNavigator';
import AnalyticsStackNavigator from './AnalyticsStackNavigator';
import BrandStackNavigator from './BrandStackNavigator';
import TabBar from './components/TabBar';
import VoiceFAB from './components/VoiceFAB';

export type MainTabParamList = {
  HomeStack: undefined;
  ContentStack: undefined;
  CalendarStack: undefined;
  AnalyticsStack: undefined;
  BrandStack: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
        <Tab.Screen name="ContentStack" component={ContentStackNavigator} />
        <Tab.Screen name="CalendarStack" component={CalendarStackNavigator} />
        <Tab.Screen name="AnalyticsStack" component={AnalyticsStackNavigator} />
        <Tab.Screen name="BrandStack" component={BrandStackNavigator} />
      </Tab.Navigator>
      <VoiceFAB />
    </View>
  );
};

export default MainTabNavigator;

