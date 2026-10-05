import { router } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { Relationship } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

const RELS: Relationship[] = ['Parent', 'Sibling', 'Friend', 'Partner', 'Other'];

export default function AddContactScreen() {
  const { theme, addContact } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rel, setRel] = useState<Relationship>('Friend');
  const [primary, setPrimary] = useState(false);

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={UserPlus}
          status="Expand your circle"
          title="Add Contact"
          subtitle="This person can be notified during SOS."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <View style={[styles.avatar, softShadow(theme), { backgroundColor: theme.primarySoft }]}>
          <AppText weight="bold" style={{ color: theme.primary, fontSize: 22 }}>
            {name.slice(0, 1).toUpperCase() || '+'}
          </AppText>
        </View>

        <SectionLabel theme={theme} title="Contact details" />
        <Label theme={theme} text="Full Name" />
        <Input theme={theme} value={name} onChange={setName} />
        <Label theme={theme} text="Phone Number" />
        <Input theme={theme} value={phone} onChange={setPhone} keyboard="phone-pad" />

        <Label theme={theme} text="Relationship" />
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
              <AppText style={{ color: rel === item ? theme.primary : theme.text }}>{item}</AppText>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setPrimary((v) => !v)}
          style={[styles.toggle, softShadow(theme), { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <View style={{ flex: 1 }}>
            <AppText weight="semibold" style={{ color: theme.text }}>
              Primary Emergency Contact
            </AppText>
            <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>Notified first during SOS</AppText>
          </View>
          <View style={{ width: 48, height: 28, borderRadius: 14, padding: 3, backgroundColor: primary ? theme.primary : theme.border }}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: '#fff',
                alignSelf: primary ? 'flex-end' : 'flex-start',
              }}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            if (!name.trim() || !phone.trim()) return;
            addContact({ name: name.trim(), phone: phone.trim(), relationship: rel, primary });
            router.back();
          }}
          style={[styles.save, softShadow(theme), { backgroundColor: theme.primary }]}>
          <AppText weight="bold" style={{ color: '#fff' }}>
            Save contact
          </AppText>
        </Pressable>
      </FadeIn>
    </Screen>
  );
}

function Label({ theme, text }: { theme: ReturnType<typeof useApp>['theme']; text: string }) {
  return (
    <AppText weight="semibold" style={{ color: theme.text, marginTop: 14, marginBottom: 8 }}>
      {text}
    </AppText>
  );
}

function Input({
  theme,
  value,
  onChange,
  keyboard,
}: {
  theme: ReturnType<typeof useApp>['theme'];
  value: string;
  onChange: (v: string) => void;
  keyboard?: 'phone-pad';
}) {
  return (
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
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  save: { marginTop: 24, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  inputShell: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  input: { padding: 14, fontSize: 16 },
});
