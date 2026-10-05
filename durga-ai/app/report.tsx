import { router } from 'expo-router';
import { Flag } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { reportReasons } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

export default function ReportScreen() {
  const { theme } = useApp();
  const [reason, setReason] = useState('lighting');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Flag}
          status="Helps everyone"
          title="Report Unsafe Area"
          subtitle="Your report helps keep routes safer. Location is attached to this pin."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <SectionLabel theme={theme} title="What did you notice?" />
        {reportReasons.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setReason(item.id)}
            style={[
              styles.row,
              softShadow(theme),
              {
                borderColor: reason === item.id ? theme.primary : theme.border,
                backgroundColor: reason === item.id ? theme.primarySoft : theme.surface,
              },
            ]}>
            <AppText weight="medium" style={{ color: reason === item.id ? theme.primary : theme.text }}>
              {item.label}
            </AppText>
          </Pressable>
        ))}
      </FadeIn>

      <FadeIn delay={140}>
        <SectionLabel theme={theme} title="Optional details" />
        <View
          style={[
            styles.inputShell,
            softShadow(theme),
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add anything that helps others stay safe"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[styles.input, { color: theme.text }]}
          />
        </View>
      </FadeIn>

      <FadeIn delay={180}>
        {sent ? (
          <AppText weight="semibold" style={{ color: theme.safe, textAlign: 'center', marginBottom: 12 }}>
            Report submitted. Thank you for helping others stay safe.
          </AppText>
        ) : null}
        <Pressable
          onPress={() => {
            setSent(true);
            setTimeout(() => router.back(), 700);
          }}
          style={[styles.submit, softShadow(theme), { backgroundColor: theme.primary }]}>
          <AppText weight="bold" style={{ color: '#fff' }}>
            Submit report
          </AppText>
        </Pressable>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 8 },
  inputShell: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
  },
  input: {
    minHeight: 100,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submit: { borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
});
