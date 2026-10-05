import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Shield } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { RiskLevel, riskLabel } from '@/data/mock';
import { AppTheme } from '@/theme';
import { cardShadow } from '@/theme/elevation';

import { AnimatedSafetyRing } from './AnimatedSafetyRing';
import { AppText } from './AppText';
import { LivingPulse } from './LivingPulse';

type Props = {
  theme: AppTheme;
  level: RiskLevel;
  score: number;
  area: string;
  lighting?: string;
  crowd?: string;
  updatedAt?: string;
  explanation?: string;
};

/** Large premium safety status — answers “How safe am I?” */
export function SafetyScoreCard({
  theme,
  level,
  score,
  area,
  explanation = 'Your surroundings currently appear relatively safe.',
}: Props) {
  const accent = level === 'safe' ? theme.safe : level === 'moderate' ? theme.moderate : theme.high;

  return (
    <View style={[styles.wrap, cardShadow(theme, true), { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <LinearGradient colors={['#F1EEFF', '#FFFFFF']} style={styles.inner}>
        <View style={styles.live}>
          <LivingPulse color={accent} size={9} />
          <AppText weight="semibold" style={{ color: theme.textSecondary, fontSize: 11 }}>
            Live safety check
          </AppText>
        </View>

        <View style={styles.center}>
          <View style={styles.ringShell}>
            <AnimatedSafetyRing theme={theme} score={score} accent={accent} size={148} />
          </View>
          <View style={[styles.shieldBadge, { backgroundColor: theme.primarySoft }]}>
            <Shield size={16} color={theme.primary} />
          </View>
        </View>

        <AppText weight="extraBold" style={[styles.level, { color: accent }]}>
          {riskLabel(level)}
        </AppText>
        <AppText weight="bold" style={{ color: theme.text, fontSize: 18, marginTop: 4 }}>
          {score} / 100
        </AppText>
        <AppText style={{ color: theme.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20, paddingHorizontal: 8 }}>
          {explanation}
        </AppText>

        <View style={styles.place}>
          <MapPin size={13} color={theme.primary} />
          <AppText weight="medium" style={{ color: theme.text, fontSize: 12 }} numberOfLines={1}>
            {area}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 28, borderWidth: 1, overflow: 'hidden' },
  inner: { padding: 20, alignItems: 'center' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start', marginLeft: -4 },
  center: { marginTop: 8, marginBottom: 8, alignItems: 'center', justifyContent: 'center' },
  ringShell: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: 6 },
  shieldBadge: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: { fontSize: 22, letterSpacing: 1, marginTop: 4 },
  place: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
});
