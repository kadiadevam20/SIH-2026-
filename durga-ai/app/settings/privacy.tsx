import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

export default function PrivacyScreen() {
  const { theme } = useApp();
  const [history, setHistory] = useState(true);
  const [ai, setAi] = useState(true);
  const [precise, setPrecise] = useState(true);

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Lock}
          status="You stay in control"
          title="Privacy"
          subtitle="DURGA only uses your information for safety assistance and emergency support."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <SectionLabel theme={theme} title="Data controls" />
        <Toggle theme={theme} label="Precise location" value={precise} onChange={setPrecise} />
        <Toggle theme={theme} label="Save location history (7 days)" value={history} onChange={setHistory} />
        <Toggle theme={theme} label="Improve DURGA with anonymized chats" value={ai} onChange={setAi} />
      </FadeIn>

      <FadeIn delay={140}>
        <View style={[styles.note, softShadow(theme), { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
          <AppText weight="semibold" style={{ color: theme.primary, lineHeight: 20 }}>
            You can delete location history anytime. Emergency recordings are never sold.
          </AppText>
        </View>
      </FadeIn>
    </Screen>
  );
}

function Toggle({
  theme,
  label,
  value,
  onChange,
}: {
  theme: ReturnType<typeof useApp>['theme'];
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View
      style={[
        styles.row,
        softShadow(theme),
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <AppText weight="medium" style={{ color: theme.text, flex: 1, paddingRight: 12 }}>
        {label}
      </AppText>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: theme.primary }} />
    </View>
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
  note: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    marginTop: 8,
  },
});
