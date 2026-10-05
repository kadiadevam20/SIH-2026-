import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Alert, Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { AppTheme } from '@/theme';

export const SOS_BAR_HEIGHT = 46;
const HOLD_MS = 1200;

type Props = {
  theme: AppTheme;
  style?: ViewStyle;
};

/** Hold-to-activate emergency strip — short taps do nothing */
export function SOSBar({ theme, style }: Props) {
  const { startEmergency } = useApp();
  const [holding, setHolding] = useState(false);
  const fill = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anim = useRef<Animated.CompositeAnimation | null>(null);
  const activated = useRef(false);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      anim.current?.stop();
    };
  }, []);

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    anim.current?.stop();
    setHolding(false);
    fill.setValue(0);
  };

  const startHold = () => {
    cancelHold();
    setHolding(true);
    anim.current = Animated.timing(fill, {
      toValue: 1,
      duration: HOLD_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    anim.current.start();
    timer.current = setTimeout(() => {
      activated.current = true;
      cancelHold();
      startEmergency();
      router.replace('/emergency' as never);
    }, HOLD_MS);
  };

  const onShortPress = () => {
    if (activated.current) {
      activated.current = false;
      return;
    }
    if (Platform.OS === 'web') {
      Alert.alert('Hold to activate SOS', 'Press and hold the bar for about 1 second to start emergency mode.');
    }
  };

  return (
    <Pressable
      onPress={onShortPress}
      onPressIn={startHold}
      onPressOut={cancelHold}
      style={({ pressed }) => [
        styles.bar,
        style,
        {
          backgroundColor: theme.highSoft,
          borderColor: holding || pressed ? theme.primary : '#E2C8C4',
          opacity: pressed ? 0.96 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS. Hold to activate.">
      <Animated.View style={[styles.fill, { width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: `${theme.primary}33` }]} />
      <View style={[styles.icon, { backgroundColor: theme.primary }]}>
        <ShieldAlert size={16} color="#fff" strokeWidth={2.4} />
      </View>
      <View style={styles.copy}>
        <AppText weight="bold" style={{ color: theme.primary, fontSize: 13 }}>
          Emergency SOS
        </AppText>
        <AppText style={{ color: theme.textSecondary, fontSize: 11 }}>
          {holding ? 'Keep holding…' : 'Hold 1s to activate'}
        </AppText>
      </View>
      <View style={[styles.badge, { backgroundColor: theme.primary }]}>
        <AppText weight="bold" style={{ color: '#fff', fontSize: 10 }}>
          HOLD
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: SOS_BAR_HEIGHT,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, minWidth: 0 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
});
