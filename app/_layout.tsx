import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoCollectionProvider } from '../src/state/DemoCollectionContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoCollectionProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" options={{ presentation: 'modal', animation: 'slide_from_right' }} />
          <Stack.Screen name="pack/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="reveal/[id]" options={{ presentation: 'modal', animation: 'fade' }} />
        </Stack>
      </DemoCollectionProvider>
    </SafeAreaProvider>
  );
}
