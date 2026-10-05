import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppTheme } from '@/theme';
import { cardShadow } from '@/theme/elevation';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  onActivate: () => void;
  label?: string;
};

const native = Platform.OS !== 'web';
const SIZE = 72;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/** Hold-to-SOS with circular progress (prevents accidents) */
export function SOSButton({ theme, onActivate, label = 'HOLD FOR SOS' }: Props) {
  const [holding, setHolding] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [offset, setOffset] = useState(C);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 900, useNativeDriver: native }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setOffset(C * (1 - value)));
    return () => progress.removeListener(id);
  }, [progress]);

  const startHold = () => {
    setHolding(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    }
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 1800, useNativeDriver: false }).start();
    timer.current = setTimeout(() => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
      onActivate();
      setHolding(false);
      progress.setValue(0);
    }, 1800);
  };

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    setHolding(false);
    progress.stopAnimation();
    progress.setValue(0);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: pulse }] }, cardShadow(theme)]}>
      <Pressable onPressIn={startHold} onPressOut={cancelHold} style={[styles.btn, { backgroundColor: theme.high }]}>
        <View style={styles.ringWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke="#fff"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${C} ${C}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
        </View>
        <View style={styles.copy}>
          <AppText weight="extraBold" style={styles.label}>
            {holding ? 'KEEP HOLDING…' : label}
          </AppText>
          <AppText style={styles.hint}>{holding ? 'Release to cancel' : 'Long-press to prevent accidents'}</AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 88,
    borderRadius: 26,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  ringWrap: { width: SIZE, height: SIZE },
  copy: { flex: 1 },
  label: { color: '#fff', fontSize: 18, letterSpacing: 0.8 },
  hint: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 3 },
});
