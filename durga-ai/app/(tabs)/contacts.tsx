import { router } from 'expo-router';
import { Phone, Plus, Search, UserRound } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomChromeHeight } from '@/components/navigation/layoutMetrics';
import { TabIconEnterView } from '@/components/navigation/TabIconEnterView';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';

/** Contacts — cream/maroon list with clear Add button */
export default function ContactsScreen() {
  const { theme, contacts, removeContact } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const bottomPad = bottomChromeHeight(true, insets.bottom);

  const filtered = useMemo(
    () =>
      contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.replace(/\s/g, '').includes(query.replace(/\s/g, '')),
      ),
    [contacts, query],
  );

  const more = (id: string, name: string) => {
    Alert.alert(name, 'Choose an action', [
      {
        text: 'Edit',
        onPress: () => router.push({ pathname: '/trusted-contact/edit', params: { id } }),
      },
      {
        text: 'Call',
        onPress: () => {
          const phone = contacts.find((c) => c.id === id)?.phone;
          if (phone) Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
        },
      },
      { text: 'Remove', style: 'destructive', onPress: () => removeContact(id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <TabIconEnterView tab="contacts" style={{ backgroundColor: theme.bg }}>
    <View style={[styles.fill, { backgroundColor: theme.bg, paddingTop: insets.top + 4 }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText weight="serifBold" style={[styles.title, { color: theme.primary }]}>
            Contacts
          </AppText>
          <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
            Your trusted safety circle
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push('/trusted-contact/add')}
          style={[styles.headerAdd, { backgroundColor: theme.primary }]}
          accessibilityLabel="Add contact">
          <Plus size={20} color="#FFF8F2" strokeWidth={2.4} />
        </Pressable>
      </View>

      <View
        style={[
          styles.searchWrap,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <Search size={18} color={theme.textSecondary} strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or number"
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 72 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {filtered.length === 0 ? (
          <View style={[styles.empty, { borderColor: theme.border, backgroundColor: theme.primarySoft }]}>
            <UserRound size={28} color={theme.primary} strokeWidth={1.8} />
            <AppText weight="semibold" style={{ color: theme.text, fontSize: 16, marginTop: 10 }}>
              {query ? 'No matches' : 'No contacts yet'}
            </AppText>
            <AppText
              weight="medium"
              style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 6 }}>
              {query
                ? 'Try a different name or number'
                : 'Add people who should be reached in an emergency'}
            </AppText>
          </View>
        ) : (
          filtered.map((contact) => (
            <Pressable
              key={contact.id}
              onPress={() => more(contact.id, contact.name)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}>
              <View style={[styles.avatar, { backgroundColor: contact.color || theme.primary }]}>
                <AppText weight="bold" style={styles.avatarText}>
                  {contact.initials}
                </AppText>
              </View>
              <View style={styles.meta}>
                <View style={styles.nameRow}>
                  <AppText weight="bold" style={{ color: theme.text, fontSize: 16, flex: 1 }} numberOfLines={1}>
                    {contact.name}
                  </AppText>
                  {contact.primary ? (
                    <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
                      <AppText weight="semibold" style={{ color: theme.primary, fontSize: 10 }}>
                        Primary
                      </AppText>
                    </View>
                  ) : null}
                </View>
                <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                  {contact.relationship}
                </AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                  {contact.phone}
                </AppText>
              </View>
              <Pressable
                onPress={() => Linking.openURL(`tel:${contact.phone.replace(/\s/g, '')}`)}
                hitSlop={10}
                style={[styles.callBtn, { backgroundColor: theme.primarySoft }]}>
                <Phone size={18} color={theme.primary} strokeWidth={2.2} />
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/trusted-contact/add')}
        style={[
          styles.fab,
          {
            backgroundColor: theme.primary,
            bottom: bottomPad + 8,
          },
        ]}>
        <Plus size={22} color="#FFF8F2" strokeWidth={2.4} />
        <AppText weight="bold" style={{ color: '#FFF8F2', fontSize: 15 }}>
          Add contact
        </AppText>
      </Pressable>
    </View>
    </TabIconEnterView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 12,
  },
  title: { fontSize: 28 },
  headerAdd: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    marginHorizontal: 18,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  list: {
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 10,
  },
  empty: {
    marginTop: 24,
    borderRadius: 22,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
  },
  row: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF8F2', fontSize: 14 },
  meta: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
    elevation: 4,
    shadowColor: '#7A1D1D',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
