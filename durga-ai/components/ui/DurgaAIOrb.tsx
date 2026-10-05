import { LinearGradient } from 'expo-linear-gradient';
import { Shield } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  status?: string;
  size?: 'sm' | 'md' | 'lg';
};

/** DURGA AI identity orb — static (no breathe loop). */
export function DurgaAIOrb({ theme, status = 'Safety Monitoring Active', size = 'md' }: Props) {
  const dim = size === 'lg' ? 96 : size === 'sm' ? 52 : 72;

  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { width: dim * 1.45, height: dim * 1.45, opacity: 0.35, backgroundColor: theme.primary }]} />
      <LinearGradient colors={[theme.primary, '#A13F3C', '#6D2323']} style={[styles.orb, { width: dim, height: dim, borderRadius: dim / 2.6 }]}>
        <Shield size={size === 'lg' ? 36 : size === 'sm' ? 20 : 28} color="#fff" strokeWidth={2.2} />
      </LinearGradient>
      {size !== 'sm' ? (
        <>
          <AppText weight="extraBold" style={[styles.title, { color: theme.text }]}>
            DURGA AI
          </AppText>
          <AppText style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>Your Intelligent Safety Guardian</AppText>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: theme.safe }]} />
            <AppText weight="semibold" style={{ color: theme.safe, fontSize: 12 }}>
              {status}
            </AppText>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  glow: { position: 'absolute', borderRadius: 999 },
  orb: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, letterSpacing: -0.4, marginTop: 14 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
