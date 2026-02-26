import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AppStoreProvider from './src/store';
import RootNavigation from './src/navigation';
import MedioraToast from './src/components/ui/Toast';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Show all logs and errors in Metro/console
LogBox.ignoreAllLogs(false);

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  useEffect(() => {
    console.log('[Mediora] App mounted');
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular: require('@expo-google-fonts/cormorant-garamond/CormorantGaramond_400Regular.ttf'),
    CormorantGaramond_500Medium: require('@expo-google-fonts/cormorant-garamond/CormorantGaramond_500Medium.ttf'),
    CormorantGaramond_600SemiBold: require('@expo-google-fonts/cormorant-garamond/CormorantGaramond_600SemiBold.ttf'),
    Syne_400Regular: require('@expo-google-fonts/syne/Syne_400Regular.ttf'),
    Syne_500Medium: require('@expo-google-fonts/syne/Syne_500Medium.ttf'),
    Syne_600SemiBold: require('@expo-google-fonts/syne/Syne_600SemiBold.ttf'),
    Syne_700Bold: require('@expo-google-fonts/syne/Syne_700Bold.ttf'),
    DMSans_400Regular: require('@expo-google-fonts/dm-sans/DMSans_400Regular.ttf'),
    DMSans_500Medium: require('@expo-google-fonts/dm-sans/DMSans_500Medium.ttf'),
    DMSans_700Bold: require('@expo-google-fonts/dm-sans/DMSans_700Bold.ttf'),
    JetBrainsMono_400Regular: require('@expo-google-fonts/jetbrains-mono/JetBrainsMono_400Regular.ttf'),
    JetBrainsMono_500Medium: require('@expo-google-fonts/jetbrains-mono/JetBrainsMono_500Medium.ttf'),
    JetBrainsMono_700Bold: require('@expo-google-fonts/jetbrains-mono/JetBrainsMono_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontError) {
      console.error('[Mediora] Font load error:', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      console.log('[Mediora] Fonts loaded, hiding splash');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    console.log('[Mediora] Waiting for fonts...');
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppStoreProvider>
            <StatusBar style="light" />
            <RootNavigation />
            <MedioraToast />
          </AppStoreProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

