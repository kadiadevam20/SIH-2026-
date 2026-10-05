import { Stack } from 'expo-router';

import { DiagonalSlideScreen } from '@/components/ui/DiagonalSlideScreen';
import { useApp } from '@/context/AppContext';

export default function SettingsLayout() {
  const { theme } = useApp();

  return (
    <DiagonalSlideScreen backgroundColor={theme.bg}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'fade',
        }}
      />
    </DiagonalSlideScreen>
  );
}
