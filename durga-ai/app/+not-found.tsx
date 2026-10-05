import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';

export default function NotFoundScreen() {
  const { theme } = useApp();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <AppText weight="bold" style={{ color: theme.text, fontSize: 20 }}>This screen does not exist.</AppText>
        <Link href="/" style={{ marginTop: 16 }}>
          <AppText weight="semibold" style={{ color: theme.primary }}>Go home</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
