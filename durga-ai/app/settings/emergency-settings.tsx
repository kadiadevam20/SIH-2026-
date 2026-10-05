import { router } from 'expo-router';
import { Siren } from 'lucide-react-native';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

export default function EmergencySettingsScreen() {
  const { theme, locationSharing, setLocationSharing, setSafetyLevel, safetyLevel } = useApp();

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Siren}
          status="SOS preferences"
          statusColor={theme.high}
          title="Emergency Settings"
          subtitle="Control what happens when SOS is activated."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <SectionLabel theme={theme} title="Sharing" />
        <View style={[styles.row, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <AppText weight="medium" style={{ color: theme.text, flex: 1 }}>
            Live location sharing
          </AppText>
          <Switch value={locationSharing} onValueChange={setLocationSharing} trackColor={{ true: theme.primary }} />
        </View>
        <AppText style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8, lineHeight: 19 }}>
          When sharing is on, your primary contact can see your live location. Stop it anytime from Home.
        </AppText>
      </FadeIn>

      <FadeIn delay={140}>
        <SectionLabel theme={theme} title="Demo area risk" subtitle="Preview how Home and Map respond" />
        {(['safe', 'moderate', 'high'] as const).map((level) => (
          <Pressable
            key={level}
            onPress={() => setSafetyLevel(level)}
            style={[
              styles.choice,
              softShadow(theme),
              {
                borderColor: safetyLevel === level ? theme.primary : theme.border,
                backgroundColor: safetyLevel === level ? theme.primarySoft : theme.surface,
              },
            ]}>
            <AppText weight="semibold" style={{ color: safetyLevel === level ? theme.primary : theme.text }}>
              {level === 'safe' ? 'SAFE' : level === 'moderate' ? 'MODERATE RISK' : 'HIGH RISK'}
            </AppText>
          </Pressable>
        ))}
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  choice: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
});
