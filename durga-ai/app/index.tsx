import { Redirect } from 'expo-router';

import { useApp } from '@/context/AppContext';

/** Boot splash is handled in root layout; this only routes once ready */
export default function Index() {
  const { onboarded, ready } = useApp();

  if (!ready) return null;
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
