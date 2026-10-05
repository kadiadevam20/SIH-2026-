import { AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { SafetyZone, riskLabel } from '@/data/mock';
import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from '../ui/AppText';

type Props = {
  theme: AppTheme;
  zone: SafetyZone;
  onPress?: () => void;
  onAvoid?: () => void;
  compact?: boolean;
};

function zoneColor(level: string, theme: AppTheme) {
  if (level === 'moderate') return theme.moderate;
  return theme.high;
}

function zoneBg(level: string, theme: AppTheme) {
  if (level === 'moderate') return theme.moderateSoft;
  return theme.highSoft;
}

export function UnsafeZoneAlert({ theme, zone, onPress, onAvoid, compact }: Props) {
  const color = zoneColor(zone.level, theme);
  const bg = zoneBg(zone.level, theme);
  const Icon = zone.level === 'high' ? ShieldAlert : AlertTriangle;

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.compact, softShadow(theme), { backgroundColor: bg, borderColor: color }]}>
        <Icon size={16} color={color} strokeWidth={2.2} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="bold" style={{ color, fontSize: 12 }}>
            {zone.alert ?? riskLabel(zone.level)} · {zone.label}
          </AppText>
        </View>
        <ChevronRight size={16} color={color} />
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, softShadow(theme), { backgroundColor: bg, borderColor: color }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
          <Icon size={18} color={color} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="bold" style={{ color, fontSize: 13 }}>
            {zone.alert ?? riskLabel(zone.level)}
          </AppText>
          <AppText weight="semibold" style={{ color: theme.text, marginTop: 2 }}>
            {zone.label}
          </AppText>
        </View>
      </View>
      {zone.reason ? (
        <AppText style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 10 }}>
          {zone.reason}
        </AppText>
      ) : null}
      <View style={styles.actions}>
        {onAvoid ? (
          <Pressable onPress={onAvoid} style={[styles.btn, { backgroundColor: theme.primary }]}>
            <AppText weight="bold" style={{ color: '#fff', fontSize: 13 }}>
              Avoid this area
            </AppText>
          </Pressable>
        ) : null}
        {onPress ? (
          <Pressable onPress={onPress} style={[styles.btn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
            <AppText weight="bold" style={{ color: theme.text, fontSize: 13 }}>
              View on map
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 14 },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
