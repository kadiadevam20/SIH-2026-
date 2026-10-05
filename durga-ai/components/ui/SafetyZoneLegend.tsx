import { StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';

export function SafetyZoneLegend({ theme }: { theme: AppTheme }) {
  const items = [
    { color: theme.safe, label: 'Safe Area' },
    { color: theme.moderate, label: 'Moderate Risk' },
    { color: theme.high, label: 'High Risk' },
  ];
  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <AppText weight="medium" style={[styles.label, { color: theme.text }]}>
            {item.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 11 },
});
