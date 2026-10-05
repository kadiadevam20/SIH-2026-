import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTheme, radius } from '@/theme';
import { cardShadow } from '@/theme/elevation';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function SectionHeader({ theme, title, subtitle, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <AppText weight="bold" style={[styles.title, { color: theme.text }]}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText style={[styles.sub, { color: theme.textSecondary }]}>{subtitle}</AppText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

type CardProps = {
  theme: AppTheme;
  children: ReactNode;
  elevated?: boolean;
  padding?: number;
};

export function SurfaceCard({ theme, children, elevated, padding = 16 }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border, padding },
        cardShadow(theme, elevated),
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 17, letterSpacing: -0.2 },
  sub: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: radius.lg, borderWidth: 1 },
});
