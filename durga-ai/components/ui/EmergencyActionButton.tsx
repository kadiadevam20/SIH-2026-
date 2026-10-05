import { Phone, ShieldAlert } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  label: string;
  icon?: 'alert' | 'phone';
  variant?: 'primary' | 'danger' | 'ghost' | 'dark';
  onPress: () => void;
};

export function EmergencyActionButton({ theme, label, icon = 'alert', variant = 'primary', onPress }: Props) {
  const bg =
    variant === 'danger' ? theme.high : variant === 'ghost' ? theme.surface : variant === 'dark' ? '#111827' : theme.primary;
  const color = variant === 'ghost' ? theme.text : '#fff';
  const Icon = icon === 'phone' ? Phone : ShieldAlert;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, borderColor: theme.border, opacity: pressed ? 0.88 : 1 }]}>
      <View style={styles.row}>
        <Icon size={18} color={color} />
        <AppText weight="bold" style={[styles.label, { color }]}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontSize: 14 },
});
