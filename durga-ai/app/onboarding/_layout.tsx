import { Stack } from 'expo-router';

import { useApp } from '@/context/AppContext';

export default function OnboardingLayout() {
  const { theme } = useApp();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
