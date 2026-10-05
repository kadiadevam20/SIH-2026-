import { CornerUpLeft, Flag, MapPin, Shield, Square } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';
import { cardShadow, softShadow } from '@/theme/elevation';

import { AppText } from '../ui/AppText';

type Props = {
  theme: AppTheme;
  instruction: string;
  detail?: string;
  minutes: number;
  eta: string;
  destination: string | null;
  safetyScore: number;
  routeRisk: 'Low' | 'Moderate';
  riskColor: string;
  onEnd: () => void;
  onReport: () => void;
};

export function NavigationTurnHud({
  theme,
  instruction,
  detail,
  minutes,
  eta,
}: Pick<Props, 'theme' | 'instruction' | 'detail' | 'minutes' | 'eta'>) {
  return (
    <View style={[styles.turnHud, cardShadow(theme, true), { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.turnIcon, { backgroundColor: theme.primarySoft }]}>
        <CornerUpLeft size={22} color={theme.primary} strokeWidth={2.4} />
      </View>
      <View style={styles.turnBody}>
        <AppText weight="semibold" style={{ color: theme.primary, fontSize: 11, letterSpacing: 0.6 }}>
          NEXT TURN
        </AppText>
        <AppText weight="bold" style={{ color: theme.text, fontSize: 17, lineHeight: 22, marginTop: 2 }}>
          {instruction}
        </AppText>
        {detail ? (
          <AppText style={{ color: theme.textSecondary, fontSize: 12, marginTop: 3 }}>
            {detail}
          </AppText>
        ) : null}
      </View>
      <View style={styles.turnEta}>
        <AppText weight="extraBold" style={{ color: theme.text, fontSize: 22 }}>
          {minutes}
        </AppText>
        <AppText weight="semibold" style={{ color: theme.textSecondary, fontSize: 11 }}>
          min
        </AppText>
        <AppText style={{ color: theme.textSecondary, fontSize: 10, marginTop: 2 }}>{eta}</AppText>
      </View>
    </View>
  );
}

export function NavigationBottomBar({
  theme,
  destination,
  safetyScore,
  routeRisk,
  riskColor,
  onEnd,
  onReport,
}: Pick<Props, 'theme' | 'destination' | 'safetyScore' | 'routeRisk' | 'riskColor' | 'onEnd' | 'onReport'>) {
  return (
    <View style={[styles.bottomBar, cardShadow(theme, true), { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.destRow}>
        <View style={[styles.destIcon, { backgroundColor: theme.primarySoft }]}>
          <Flag size={14} color={theme.primary} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText style={{ color: theme.textSecondary, fontSize: 11 }}>Heading to</AppText>
          <AppText weight="semibold" numberOfLines={1} style={{ color: theme.text, fontSize: 14 }}>
            {destination ?? 'Destination'}
          </AppText>
        </View>
        <View style={[styles.riskPill, { backgroundColor: `${riskColor}18` }]}>
          <Shield size={12} color={riskColor} strokeWidth={2.2} />
          <AppText weight="bold" style={{ color: riskColor, fontSize: 11 }}>
            {routeRisk}
          </AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: theme.surfaceMuted }]}>
          <MapPin size={13} color={theme.textSecondary} />
          <AppText weight="semibold" style={{ color: theme.text, fontSize: 12 }}>
            Safety {safetyScore}
          </AppText>
        </View>
        <Pressable onPress={onReport} style={[styles.stat, softShadow(theme), { backgroundColor: theme.moderateSoft, borderColor: theme.moderate, borderWidth: 1 }]}>
          <AppText weight="bold" style={{ color: theme.moderate, fontSize: 12 }}>
            Report area
          </AppText>
        </Pressable>
        <Pressable onPress={onEnd} style={[styles.endBtn, { backgroundColor: theme.primary }]}>
          <Square size={12} color="#fff" fill="#fff" />
          <AppText weight="bold" style={{ color: '#fff', fontSize: 12 }}>
            End
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  turnHud: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
  },
  turnIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnBody: { flex: 1, minWidth: 0 },
  turnEta: { alignItems: 'center', minWidth: 44 },
  bottomBar: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    gap: 12,
  },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  destIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 14,
  },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
});
