import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ContentStackParamList } from '../types/navigation.types';
import ContentScreen from '../screens/Content';
import CaptionGeneratorScreen from '../screens/Content/CaptionGenerator';
import HashtagStudioScreen from '../screens/Content/HashtagStudio';
import ScriptWriterScreen from '../screens/Content/ScriptWriter';
import DraftsListScreen from '../screens/Content/Drafts';
import DraftDetailScreen from '../screens/Content/Drafts/DraftDetail';

const Stack = createNativeStackNavigator<ContentStackParamList>();

export const ContentStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ContentHub" component={ContentScreen} />
      <Stack.Screen name="CaptionGenerator" component={CaptionGeneratorScreen} />
      <Stack.Screen name="HashtagStudio" component={HashtagStudioScreen} />
      <Stack.Screen name="ScriptWriter" component={ScriptWriterScreen} />
      <Stack.Screen name="DraftsList" component={DraftsListScreen} />
      <Stack.Screen name="DraftDetail" component={DraftDetailScreen} />
    </Stack.Navigator>
  );
};

export default ContentStackNavigator;

