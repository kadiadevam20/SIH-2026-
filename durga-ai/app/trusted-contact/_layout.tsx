import { Stack } from 'expo-router';

import { useApp } from '@/context/AppContext';

export default function TrustedContactLayout() {
  const { theme } = useApp();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }} />;
}
