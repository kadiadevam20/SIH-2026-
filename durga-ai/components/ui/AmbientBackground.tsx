import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

type Props = { theme: AppTheme };

/** Soft cream mist — Canva warm canvas */
export function AmbientBackground({ theme }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#F8F3EA', theme.bg, '#EFE6D8']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={[styles.orb, styles.a]} />
      <View style={[styles.orb, styles.b]} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: { position: 'absolute', borderRadius: 999 },
  a: { width: 280, height: 280, top: -100, right: -90, backgroundColor: 'rgba(122,29,29,0.06)' },
  b: { width: 200, height: 200, top: 280, left: -80, backgroundColor: 'rgba(161,63,60,0.05)' },
});
