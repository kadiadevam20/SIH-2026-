import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { useApp } from '@/context/AppContext';

/** Stylized multi-armed Durga silhouette for home hero */
export function DurgaSilhouette({ size = 280 }: { size?: number }) {
  const { theme } = useApp();
  const c = theme.primary;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.glow, { backgroundColor: theme.primarySoft, width: size * 0.9, height: size * 0.9 }]} />
      <Svg width={size} height={size} viewBox="0 0 200 220">
        <Ellipse cx="100" cy="200" rx="70" ry="14" fill={c} opacity={0.18} />
        <Circle cx="100" cy="48" r="22" fill={c} />
        <Path d="M78 70 Q100 78 122 70 L130 150 Q100 168 70 150 Z" fill={c} />
        <Path d="M78 88 L28 70 L34 82 L72 100 Z" fill={c} />
        <Path d="M122 88 L172 70 L166 82 L128 100 Z" fill={c} />
        <Path d="M74 110 L22 120 L28 132 L78 122 Z" fill={c} />
        <Path d="M126 110 L178 120 L172 132 L122 122 Z" fill={c} />
        <Path d="M80 130 L40 168 L52 174 L88 140 Z" fill={c} />
        <Path d="M120 130 L160 168 L148 174 L112 140 Z" fill={c} />
        <Path d="M94 42 L90 18 L100 28 L110 18 L106 42 Z" fill={c} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.7,
  },
});
