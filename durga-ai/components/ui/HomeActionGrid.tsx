import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from './AppText';

export type HomeAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  soft: string;
  onPress: () => void;
};

type Props = {
  theme: AppTheme;
  actions: HomeAction[];
};

export function HomeActionGrid({ theme, actions }: Props) {
  return (
    <View style={styles.grid}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Pressable
            key={action.id}
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.tile,
              softShadow(theme),
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                opacity: pressed ? 0.94 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}>
            <View style={[styles.icon, { backgroundColor: action.soft }]}>
              <Icon size={20} color={action.accent} strokeWidth={2.3} />
            </View>
            <AppText weight="bold" style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {action.title}
            </AppText>
            <AppText style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={2}>
              {action.subtitle}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '48.2%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    minHeight: 124,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 14, marginBottom: 4 },
  sub: { fontSize: 12, lineHeight: 16 },
});
