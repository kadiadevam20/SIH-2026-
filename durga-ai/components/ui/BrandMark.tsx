import { Shield } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from './AppText';
import { LivingPulse } from './LivingPulse';

type Props = {
  theme: AppTheme;
  size?: 'sm' | 'md';
  style?: ViewStyle;
};

/** Shared DURGA shield mark — same brand signal on every key surface. */
export function BrandMark({ theme, size = 'md', style }: Props) {
  const dim = size === 'sm' ? 36 : 44;
  return (
    <View
      style={[
        styles.mark,
        softShadow(theme),
        {
          width: dim,
          height: dim,
          borderRadius: size === 'sm' ? 13 : 16,
          backgroundColor: theme.primary,
        },
        style,
      ]}>
      <Shield size={size === 'sm' ? 16 : 18} color="#fff" strokeWidth={2.4} />
    </View>
  );
}

type BrandRowProps = {
  theme: AppTheme;
  title?: string;
  status: string;
  statusColor?: string;
  right?: ReactNode;
};

export function BrandRow({ theme, title = 'DURGA AI', status, statusColor, right }: BrandRowProps) {
  const tone = statusColor ?? theme.safe;
  return (
    <View style={styles.row}>
      <BrandMark theme={theme} />
      <View style={styles.copy}>
          <AppText weight="extraBold" style={{ color: theme.text, fontSize: 20 }} numberOfLines={1}>
            {title}
          </AppText>
        <View style={styles.status}>
          <LivingPulse color={tone} size={9} />
          <AppText weight="semibold" style={{ color: tone, fontSize: 11 }} numberOfLines={1}>
            {status}
          </AppText>
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: { flex: 1, minWidth: 0 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -4,
    marginTop: 2,
  },
});
