import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { BrandSplash } from '@/components/ui/BrandSplash';
import { AppProvider, useApp } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

const BRAND_MS = 1400;

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
  });
  const [minSplashDone, setMinSplashDone] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    const t = setTimeout(() => setMinSplashDone(true), BRAND_MS);
    return () => clearTimeout(t);
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AppProvider>
      <BootShell minSplashDone={minSplashDone} />
    </AppProvider>
  );
}

function BootShell({ minSplashDone }: { minSplashDone: boolean }) {
  const { theme, ready } = useApp();
  const showBrand = !ready || !minSplashDone;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style="dark" />
      <RootNav />
      {showBrand ? <BrandSplash theme={theme} /> : null}
    </View>
  );
}

function RootNav() {
  const { theme } = useApp();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sos" options={{ animation: 'fade' }} />
      <Stack.Screen name="emergency" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="nearby-help" options={{ presentation: 'modal' }} />
      <Stack.Screen name="offline" />
      <Stack.Screen name="report" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="settings"
        options={{
          animation: 'none',
          presentation: 'transparentModal',
          gestureEnabled: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen name="trusted-contact" />
    </Stack>
  );
}
