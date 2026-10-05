import { router } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

export default function AccessibilityScreen() {
  const { theme, themePref, setThemePref } = useApp();
  const [large, setLarge] = useState(false);
  const [reduce, setReduce] = useState(false);

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Eye}
          status="Designed for stress moments"
          title="Accessibility"
          subtitle="One-hand use and clearer emergency reading."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <SectionLabel theme={theme} title="Comfort" />
        {(
          [
            ['Large emergency text', large, setLarge],
            ['Reduce motion', reduce, setReduce],
          ] as const
        ).map(([label, value, set]) => (
          <View
            key={label}
            style={[styles.row, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <AppText weight="medium" style={{ color: theme.text, flex: 1 }}>
              {label}
            </AppText>
            <Switch value={value} onValueChange={set} trackColor={{ true: theme.primary }} />
          </View>
        ))}
      </FadeIn>

      <FadeIn delay={140}>
        <SectionLabel theme={theme} title="Appearance" />
        {(['system', 'light', 'dark'] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setThemePref(item)}
            style={[
              styles.choice,
              softShadow(theme),
              {
                borderColor: themePref === item ? theme.primary : theme.border,
                backgroundColor: themePref === item ? theme.primarySoft : theme.surface,
              },
            ]}>
            <AppText weight="semibold" style={{ color: themePref === item ? theme.primary : theme.text, textTransform: 'capitalize' }}>
              {item}
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
