import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../types/navigation.types';
import QuizIntro from '../screens/Onboarding/QuizIntro';
import QuizStep from '../screens/Onboarding/QuizStep';
import QuizAnalyzing from '../screens/Onboarding/QuizAnalyzing';
import QuizResult from '../screens/Onboarding/QuizResult';
import ProfileConfirm from '../screens/Onboarding/ProfileConfirm';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="QuizIntro"
    >
      <Stack.Screen name="QuizIntro" component={QuizIntro} />
      <Stack.Screen name="QuizStep" component={QuizStep} />
      <Stack.Screen name="QuizAnalyzing" component={QuizAnalyzing} />
      <Stack.Screen name="QuizResult" component={QuizResult} />
      <Stack.Screen name="ProfileConfirm" component={ProfileConfirm} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;

