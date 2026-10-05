import { router, useLocalSearchParams } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { Relationship } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

const RELS: Relationship[] = ['Parent', 'Sibling', 'Friend', 'Partner', 'Other'];

export default function EditContactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, contacts, updateContact, removeContact } = useApp();
  const existing = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);
  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [rel, setRel] = useState<Relationship>(existing?.relationship ?? 'Friend');
  const [primary, setPrimary] = useState(existing?.primary ?? false);

  if (!existing) {
    return (
      <Screen theme={theme}>
        <PageHeader theme={theme} title="Contact" subtitle="Not found" onBack={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Pencil}
          status="Update details"
          title="Edit Contact"
          subtitle={existing.name}
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <SectionLabel theme={theme} title="Contact details" />
        <AppText weight="semibold" style={{ color: theme.text, marginBottom: 8 }}>
          Full Name
        </AppText>
        <TextInput value={name} onChangeText={setName} style={input(theme)} />
        <AppText weight="semibold" style={{ color: theme.text, marginTop: 14, marginBottom: 8 }}>
          Phone Number
        </AppText>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={input(theme)} />

        <AppText weight="semibold" style={{ color: theme.text, marginTop: 14, marginBottom: 8 }}>
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
              <AppText style={{ color: rel === item ? theme.primary : theme.text }}>{item}</AppText>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setPrimary((v) => !v)}
          style={[styles.toggle, softShadow(theme), { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <AppText weight="semibold" style={{ color: theme.text }}>
            Primary Emergency Contact {primary ? '· On' : '· Off'}
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => {
            updateContact(existing.id, { name, phone, relationship: rel, primary });
            router.back();
          }}
          style={[styles.save, softShadow(theme), { backgroundColor: theme.primary }]}>
          <AppText weight="bold" style={{ color: '#fff' }}>
            Save changes
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => {
            removeContact(existing.id);
            router.back();
          }}
          style={{ marginTop: 12, alignItems: 'center', paddingVertical: 12 }}>
          <AppText weight="semibold" style={{ color: theme.high }}>
            Remove contact
          </AppText>
        </Pressable>
      </FadeIn>
    </Screen>
  );
}

function input(theme: ReturnType<typeof useApp>['theme']) {
  return {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    color: theme.text,
  };
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  toggle: { marginTop: 16, padding: 14, borderRadius: 16, borderWidth: 1 },
  save: { marginTop: 24, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
});
