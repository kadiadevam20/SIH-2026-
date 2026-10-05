import { WifiOff } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  onPress?: () => void;
};

export function OfflineStatusBanner({ theme, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.banner, { backgroundColor: theme.moderateSoft, borderColor: theme.moderate }]}>
      <WifiOff size={16} color={theme.moderate} />
      <View style={styles.textWrap}>
        <AppText weight="bold" style={{ color: theme.moderate, fontSize: 13 }}>
          Offline Safety Mode Active
        </AppText>
        <AppText style={{ color: theme.text, fontSize: 12 }} numberOfLines={2}>
          SOS, contacts, and cached maps still work.
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
});
