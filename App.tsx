import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          {/* Navigation stacks will be added here */}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}