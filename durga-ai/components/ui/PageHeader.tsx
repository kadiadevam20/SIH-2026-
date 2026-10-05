import { ChevronLeft, LucideIcon } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';
import { LivingPulse } from './LivingPulse';

type Props = {
  theme: AppTheme;
  title: string;
  subtitle?: string;
  status?: string;
  statusColor?: string;
  icon?: LucideIcon;
  onBack?: () => void;
  right?: ReactNode;
};

export function PageHeader({
  theme,
  title,
  subtitle,
  status,
  statusColor,
  icon: Icon,
  onBack,
  right,
}: Props) {
  const tone = statusColor ?? theme.safe;

  return (
    <View style={styles.wrap}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back}>
          <ChevronLeft size={20} color={theme.text} />
          <AppText weight="semibold" style={{ color: theme.text, fontSize: 14 }}>
            Back
          </AppText>
        </Pressable>
      ) : null}

      <View style={styles.row}>
        {Icon ? (
          <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
            <Icon size={18} color={theme.primary} />
          </View>
        ) : null}
        <View style={styles.copy}>
          {status ? (
            <View style={styles.status}>
              <LivingPulse color={tone} size={8} />
              <AppText weight="semibold" style={{ color: tone, fontSize: 11 }}>
                {status}
              </AppText>
            </View>
          ) : null}
          <AppText weight="extraBold" style={{ color: theme.text, fontSize: 28, letterSpacing: -0.6 }}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText style={{ color: theme.textSecondary, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

export function SectionLabel({
  theme,
  title,
  subtitle,
}: {
  theme: AppTheme;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.section}>
      <AppText weight="bold" style={{ color: theme.text, fontSize: 16 }}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText style={{ color: theme.textSecondary, fontSize: 13, marginTop: 3 }}>{subtitle}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  copy: { flex: 1, minWidth: 0 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: -4,
    marginBottom: 4,
  },
  section: { marginTop: 8, marginBottom: 12 },
});
