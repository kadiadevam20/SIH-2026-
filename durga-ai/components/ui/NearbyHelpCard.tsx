import { LucideIcon, MapPinned, Phone } from 'lucide-react-native';
import { Building2, HeartPulse, Shield, Store, Trees } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { NearbyPlace } from '@/data/mock';
import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from './AppText';

const ICONS: Record<NearbyPlace['type'], LucideIcon> = {
  police: Shield,
  hospital: HeartPulse,
  pharmacy: Store,
  'help-center': Building2,
  'safe-place': Trees,
};

type Props = {
  place: NearbyPlace;
  theme: AppTheme;
  onNavigate: () => void;
  onCall: () => void;
};

export function NearbyHelpCard({ place, theme, onNavigate, onCall }: Props) {
  const Icon = ICONS[place.type];
  return (
    <View style={[styles.card, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.preview, { backgroundColor: theme.primarySoft }]}>
        <Icon size={22} color={theme.primary} />
        <View style={styles.mapHint}>
          <MapPinned size={12} color={theme.primary} />
        </View>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText weight="semibold" style={{ color: theme.text, fontSize: 15 }} numberOfLines={1}>
          {place.name}
        </AppText>
        <AppText style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
          {place.distance} · {place.address}
        </AppText>
        <AppText weight="medium" style={{ color: place.open ? theme.safe : theme.high, fontSize: 12, marginTop: 4 }}>
          {place.open ? 'Open' : 'Closed'} · {place.hours}
        </AppText>
        <View style={styles.actions}>
          <Pressable onPress={onNavigate} style={[styles.btn, { backgroundColor: theme.primary }]}>
              <MapPinned size={14} color="#fff" />
              <AppText weight="semibold" style={{ color: '#fff', fontSize: 12 }}>
                Open map
              </AppText>
          </Pressable>
          {place.phone ? (
            <Pressable onPress={onCall} style={[styles.btn, { backgroundColor: theme.safeSoft }]}>
              <Phone size={14} color={theme.safe} />
              <AppText weight="semibold" style={{ color: theme.safe, fontSize: 12 }}>
                Call
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
  },
  preview: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapHint: { position: 'absolute', right: 8, bottom: 8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
