import { MoreHorizontal, Phone, Star } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Contact } from '@/data/mock';
import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from './AppText';

type Props = {
  contact: Contact;
  theme: AppTheme;
  onCall: () => void;
  onMessage: () => void;
  onMore: () => void;
};

export function TrustedContactCard({ contact, theme, onCall, onMessage, onMore }: Props) {
  return (
    <View style={[styles.card, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.avatar, { backgroundColor: contact.color }]}>
        <AppText weight="bold" style={styles.initials}>
          {contact.initials}
        </AppText>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.nameRow}>
          <AppText weight="semibold" style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {contact.name}
          </AppText>
          {contact.primary ? (
            <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
              <Star size={11} color={theme.primary} fill={theme.primary} />
              <AppText weight="semibold" style={[styles.badgeText, { color: theme.primary }]}>
                PRIMARY
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
          {contact.relationship} · {contact.phone}
        </AppText>
      </View>
      <Pressable onPress={onCall} style={[styles.iconBtn, { backgroundColor: theme.safeSoft }]}>
        <Phone size={16} color={theme.safe} />
      </Pressable>
      <Pressable onPress={onMessage} style={[styles.iconBtn, { backgroundColor: theme.primarySoft }]}>
        <AppText weight="bold" style={{ color: theme.primary, fontSize: 12 }}>
          SMS
        </AppText>
      </Pressable>
      <Pressable onPress={onMore} hitSlop={8} style={[styles.more, { backgroundColor: theme.surfaceMuted }]}>
        <MoreHorizontal size={18} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontSize: 15 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontSize: 15 },
  meta: { fontSize: 12, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10 },
  iconBtn: {
    height: 36,
    minWidth: 36,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
