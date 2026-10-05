import { router } from 'expo-router';
import { Languages } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

const LANGS = ['English', 'हिन्दी', 'ગુજરાતી'];

export default function LanguageScreen() {
  const { theme } = useApp();
  const [lang, setLang] = useState('English');

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Languages}
          status="App language"
          title="Language"
          subtitle="Choose the language used across DURGA AI."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <SectionLabel theme={theme} title="Available languages" />
        {LANGS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setLang(item)}
            style={[
              styles.choice,
              softShadow(theme),
              {
                borderColor: lang === item ? theme.primary : theme.border,
                backgroundColor: lang === item ? theme.primarySoft : theme.surface,
              },
            ]}>
            <AppText weight="semibold" style={{ color: lang === item ? theme.primary : theme.text }}>
              {item}
            </AppText>
          </Pressable>
        ))}
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  choice: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
});
