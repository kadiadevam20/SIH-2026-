import { router } from 'expo-router';
import { WifiOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { useApp } from '@/context/AppContext';
import { offlineCapabilities } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

export default function OfflineScreen() {
  const { theme } = useApp();

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={WifiOff}
          status="Still protected"
          statusColor={theme.safe}
          title="Offline Safety Mode"
          subtitle="Don't worry. Important safety features are still available."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <View style={[styles.banner, softShadow(theme), { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
          <AppText weight="bold" style={{ color: theme.primary, fontSize: 15 }}>
            Offline Safety Mode Active
          </AppText>
          <AppText style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6, lineHeight: 18 }}>
            DURGA keeps critical tools working without internet.
          </AppText>
        </View>
      </FadeIn>

      <FadeIn delay={120}>
        <View style={{ gap: 10, marginTop: 8 }}>
          {offlineCapabilities.map((item) => (
            <View key={item} style={[styles.row, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <AppText weight="bold" style={{ color: theme.safe, fontSize: 16 }}>
                ✓
              </AppText>
              <AppText style={{ color: theme.text, flex: 1, lineHeight: 20 }}>{item}</AppText>
            </View>
          ))}
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
});
