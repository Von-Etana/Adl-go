import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useFonts } from 'expo-font';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  const [fontsLoaded] = useFonts({
    // Load custom fonts here if needed
  });

  // if (!fontsLoaded) {
  //   return null; // Or a loading splash screen
  // }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
