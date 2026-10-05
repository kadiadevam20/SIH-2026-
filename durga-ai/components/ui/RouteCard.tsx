import { Pressable, StyleSheet, View } from 'react-native';

import { RiskLevel } from '@/data/mock';
import { AppTheme } from '@/theme';

import { AppText } from './AppText';
import { RiskIndicator } from './RiskIndicator';

type Props = {
  theme: AppTheme;
  title: string;
  minutes: number;
  risk: RiskLevel;
  detail?: string;
  recommended?: boolean;
  selected?: boolean;
  onPress: () => void;
};

/** Route choice card — recommended safest is marked clearly for the demo */
export function RouteCard({
  theme,
  title,
  minutes,
  risk,
  detail,
  recommended,
  selected,
  onPress,
}: Props) {
  const borderColor = selected ? theme.primary : recommended ? `${theme.primary}55` : theme.border;
  const backgroundColor = selected
    ? theme.primarySoft
    : recommended
      ? '#F8F4EE'
      : theme.surface;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={`${title}, ${minutes} minutes${recommended ? ', recommended' : ''}`}
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          borderWidth: selected ? 2 : 1,
        },
      ]}>
      {recommended ? (
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <AppText weight="bold" style={styles.badgeText}>
            Recommended
          </AppText>
        </View>
      ) : (
        <View style={styles.badgeSpacer} />
      )}

      <AppText weight="semibold" style={[styles.title, { color: theme.text }]}>
        {title}
      </AppText>
      <AppText weight="extraBold" style={[styles.time, { color: theme.text }]}>
        {minutes}
        <AppText weight="semibold" style={{ color: theme.textSecondary, fontSize: 13 }}>
          {' '}
          min
        </AppText>
      </AppText>
      <RiskIndicator level={risk} theme={theme} size="sm" />
      {detail ? (
        <AppText style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={2}>
          {detail}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    gap: 8,
    minHeight: 148,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeSpacer: {
    height: 22,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  title: { fontSize: 14 },
  time: { fontSize: 26, lineHeight: 30 },
  detail: { fontSize: 11, lineHeight: 15, marginTop: 2 },
});
