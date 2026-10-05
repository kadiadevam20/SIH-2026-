import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';

const ZONES = [
  {
    color: '#DC2626',
    title: 'Red Zone – High Risk Area',
    points: [
      'App automatically starts audio recording',
      'Sends live location to emergency contacts',
      'Alerts the user and activates SOS',
    ],
  },
  {
    color: '#F59E0B',
    title: 'Orange Zone – Moderate Risk Area',
    points: [
      'Moderately risky locations — stay alert',
      'App may provide caution notifications',
    ],
  },
  {
    color: '#22C55E',
    title: 'Green Zone – Safe Area',
    points: [
      'Low or no safety risk',
      'Considered safer for travel',
    ],
  },
];

/** Instructions — Canva tutorials / risk-zone guide */
export default function TutorialsScreen() {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.fill, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: theme.primary }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.side}>
          <ArrowLeft size={22} color={theme.primary} />
        </Pressable>
        <AppText weight="serifBold" style={[styles.title, { color: theme.primary }]}>
          Instructions
        </AppText>
        <View style={styles.side} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}>
        <AppText weight="bold" style={[styles.section, { color: theme.text }]}>
          Smart Risk Zone Map
        </AppText>
        <AppText style={[styles.lead, { color: theme.text }]}>
          The DURGA app contains an interactive safety map that divides locations into three risk zones:
        </AppText>

        {ZONES.map((zone) => (
          <View key={zone.title} style={styles.zone}>
            <View style={styles.zoneHead}>
              <View style={[styles.dot, { backgroundColor: zone.color }]} />
              <AppText weight="bold" style={{ color: theme.text, fontSize: 15, flex: 1 }}>
                {zone.title}
              </AppText>
            </View>
            {zone.points.map((point) => (
              <AppText key={point} style={[styles.point, { color: theme.text }]}>
                • {point}
              </AppText>
            ))}
          </View>
        ))}

        <AppText weight="bold" style={[styles.section, { color: theme.text, marginTop: 18 }]}>
          3. Smart Route Suggestion
        </AppText>
        <AppText style={[styles.lead, { color: theme.text }]}>
          If a user’s path passes through a Red Zone, the app suggests an alternate safer route and can open navigation
          on the Map tab.
        </AppText>

        <Pressable
          onPress={() => router.push('/(tabs)/map')}
          style={[styles.cta, { backgroundColor: theme.primary }]}>
          <AppText weight="bold" style={{ color: '#fff' }}>
            Open safety map
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
  },
  side: { width: 36, alignItems: 'center' },
  title: { fontSize: 26 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { fontSize: 17, marginBottom: 8 },
  lead: { fontSize: 14, lineHeight: 21, marginBottom: 16 },
  zone: { marginBottom: 18 },
  zoneHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  point: { fontSize: 14, lineHeight: 22, paddingLeft: 24 },
  cta: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
});
