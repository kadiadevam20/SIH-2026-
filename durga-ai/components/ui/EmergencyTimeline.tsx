import { Check, Clock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';

export type TimelineItem = {
  id: string;
  label: string;
  status: 'done' | 'pending' | 'active';
};

export function EmergencyTimeline({ theme, items }: { theme: AppTheme; items: TimelineItem[] }) {
  return (
    <View style={styles.wrap}>
      {items.map((item, index) => {
        const done = item.status === 'done';
        const active = item.status === 'active';
        const color = done ? theme.safe : active ? theme.moderate : theme.textSecondary;
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.icon, { backgroundColor: done ? theme.safeSoft : active ? theme.moderateSoft : theme.surfaceMuted }]}>
                {done ? <Check size={14} color={theme.safe} /> : <Clock size={14} color={color} />}
              </View>
              {index < items.length - 1 ? <View style={[styles.line, { backgroundColor: theme.border }]} /> : null}
            </View>
            <AppText weight={done || active ? 'semibold' : 'regular'} style={{ color: theme.text, paddingBottom: 16 }}>
              {item.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  row: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', width: 28 },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { width: 2, flex: 1, minHeight: 16, marginVertical: 4 },
});
