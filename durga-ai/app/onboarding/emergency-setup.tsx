import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeIn } from '@/components/ui/FadeIn';
import { AppText } from '@/components/ui/AppText';
import { LivingPulse } from '@/components/ui/LivingPulse';
import { useApp } from '@/context/AppContext';
import { Relationship } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

const RELS: Relationship[] = ['Parent', 'Sibling', 'Friend', 'Partner', 'Other'];

export default function EmergencySetupScreen() {
  const { theme, addContact, completeOnboarding, contacts } = useApp();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rel, setRel] = useState<Relationship>('Sibling');
  const [primary, setPrimary] = useState(true);

  const finish = (limited: boolean, save: boolean) => {
    if (save && name.trim() && phone.trim()) {
      const exists = contacts.some((c) => c.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''));
      if (!exists) addContact({ name: name.trim(), phone: phone.trim(), relationship: rel, primary });
    }
    completeOnboarding(limited);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.fill}>
      <LinearGradient colors={['#DBEAFE', '#EEF4FF', theme.bg]} style={StyleSheet.absoluteFill} />
      <ScrollView
        style={styles.fill}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}>
        <FadeIn>
          <View style={styles.progress}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          </View>
          <View style={styles.statusLine}>
            <LivingPulse color={theme.safe} size={9} />
            <AppText weight="semibold" style={{ color: theme.safe, fontSize: 11 }}>
              Step 4 of 4
            </AppText>
          </View>
          <AppText weight="extraBold" style={{ color: theme.text, fontSize: 28 }}>
            Emergency Setup
          </AppText>
          <AppText style={{ color: theme.textSecondary, marginTop: 8, lineHeight: 22 }}>
            Add a trusted person we can notify if SOS is activated. You can add more later.
          </AppText>
        </FadeIn>

        <FadeIn delay={100}>
          <Field theme={theme} label="Full name" value={name} onChange={setName} />
          <Field theme={theme} label="Emergency phone number" value={phone} onChange={setPhone} keyboard="phone-pad" />

          <AppText weight="semibold" style={{ color: theme.text, marginTop: 18, marginBottom: 8 }}>
            Relationship
          </AppText>
          <View style={styles.chips}>
            {RELS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setRel(item)}
                style={[
                  styles.chip,
                  softShadow(theme),
                  {
                    borderColor: rel === item ? theme.primary : theme.border,
                    backgroundColor: rel === item ? theme.primarySoft : theme.surface,
                  },
                ]}>
                <AppText weight="medium" style={{ color: rel === item ? theme.primary : theme.text }}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => setPrimary((v) => !v)}
            style={[styles.toggle, softShadow(theme), { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <AppText weight="semibold" style={{ color: theme.text }}>
                Primary emergency contact
              </AppText>
              <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>Notified first during SOS</AppText>
            </View>
            <View style={[styles.switch, { backgroundColor: primary ? theme.primary : theme.border }]}>
              <View style={[styles.knob, { alignSelf: primary ? 'flex-end' : 'flex-start' }]} />
            </View>
          </Pressable>
        </FadeIn>

        <FadeIn delay={180}>
          <Pressable
            onPress={() => finish(false, true)}
            style={[styles.primary, softShadow(theme), { backgroundColor: theme.primary }]}>
            <AppText weight="bold" style={{ color: '#fff', fontSize: 16 }}>
              Finish setup
            </AppText>
          </Pressable>
          <Pressable onPress={() => finish(true, false)} style={{ alignItems: 'center', paddingVertical: 14 }}>
            <AppText weight="semibold" style={{ color: theme.textSecondary }}>
              Skip for now
            </AppText>
          </Pressable>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

function Field({
  theme,
  label,
  value,
  onChange,
  keyboard,
}: {
  theme: ReturnType<typeof useApp>['theme'];
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: 'phone-pad';
}) {
  return (
    <View style={{ marginTop: 18 }}>
      <AppText weight="semibold" style={{ color: theme.text, marginBottom: 8 }}>
        {label}
      </AppText>
      <View
        style={[
          styles.inputShell,
          softShadow(theme),
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  progress: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  dot: { width: 28, height: 4, borderRadius: 2 },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -4, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  toggle: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  switch: { width: 48, height: 28, borderRadius: 14, padding: 3 },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  primary: { borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  inputShell: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
});
