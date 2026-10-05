import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress: () => void;
  accent?: string;
};

export function QuickActionCard({ theme, icon: Icon, title, subtitle, onPress, accent }: Props) {
  const tone = accent ?? theme.primary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        softShadow(theme),
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          opacity: pressed ? 0.96 : 1,
        },
      ]}>
      <View style={[styles.icon, { backgroundColor: `${tone}18` }]}>
        <Icon size={18} color={tone} strokeWidth={2.35} />
      </View>
      <View style={styles.copy}>
        <AppText weight="semibold" style={[styles.title, { color: theme.text }]}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.chevron, { backgroundColor: theme.surfaceMuted }]}>
        <AppText weight="bold" style={{ color: tone, fontSize: 16, marginTop: -1 }}>
          ›
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  title: { fontSize: 14.5, lineHeight: 19 },
  sub: { fontSize: 12, lineHeight: 16 },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
