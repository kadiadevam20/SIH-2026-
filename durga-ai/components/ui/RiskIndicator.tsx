import { RiskLevel, riskLabel } from '@/data/mock';
import { AppTheme } from '@/theme';
import { View, StyleSheet } from 'react-native';

import { AppText } from './AppText';

type Props = {
  level: RiskLevel;
  theme: AppTheme;
  size?: 'sm' | 'md';
};

export function RiskIndicator({ level, theme, size = 'md' }: Props) {
  const color = level === 'safe' ? theme.safe : level === 'moderate' ? theme.moderate : theme.high;
  const bg = level === 'safe' ? theme.safeSoft : level === 'moderate' ? theme.moderateSoft : theme.highSoft;
  return (
    <View style={[styles.wrap, { backgroundColor: bg }, size === 'sm' && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AppText weight="bold" style={[styles.label, { color }, size === 'sm' && styles.labelSm]}>
        {riskLabel(level)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  sm: { paddingHorizontal: 8, paddingVertical: 4, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, letterSpacing: 0.6 },
  labelSm: { fontSize: 10, letterSpacing: 0.4 },
});
