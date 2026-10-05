import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Bell, Check, MapPin, Shield } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';

type PermKey = 'location' | 'notifications';
type PermState = Record<PermKey, 'idle' | 'granted' | 'denied'>;

/** Ask GPS + notifications before entering the app */
export default function PermissionsScreen() {
  const { theme, completeOnboarding } = useApp();
  const insets = useSafeAreaInsets();
  const maroon = theme.primary;
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<PermState>({
    location: 'idle',
    notifications: 'idle',
  });

  const goHome = (limited: boolean) => {
    completeOnboarding(limited);
    router.replace('/(tabs)');
  };

  const requestLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        setStatus((s) => ({ ...s, location: 'granted' }));
        return true;
      }
      const { status: current } = await Location.getForegroundPermissionsAsync();
      if (current === 'granted') {
        setStatus((s) => ({ ...s, location: 'granted' }));
        return true;
      }
      const { status: next } = await Location.requestForegroundPermissionsAsync();
      const ok = next === 'granted';
      setStatus((s) => ({ ...s, location: ok ? 'granted' : 'denied' }));
      return ok;
    } catch {
      setStatus((s) => ({ ...s, location: 'denied' }));
      return false;
    }
  };

  const requestNotifications = async () => {
    try {
      if (Platform.OS === 'web') {
        setStatus((s) => ({ ...s, notifications: 'granted' }));
        return true;
      }

      // Android 13+ needs runtime POST_NOTIFICATIONS
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        const ok = result === PermissionsAndroid.RESULTS.GRANTED;
        setStatus((s) => ({ ...s, notifications: ok ? 'granted' : 'denied' }));
        return ok;
      }

      // iOS / older Android — system prompt handled by OS / Expo Go settings
      setStatus((s) => ({ ...s, notifications: 'granted' }));
      return true;
    } catch {
      setStatus((s) => ({ ...s, notifications: 'denied' }));
      return false;
    }
  };

  const onAllowAll = async () => {
    setBusy(true);
    const loc = await requestLocation();
    const notif = await requestNotifications();
    setBusy(false);

    if (!loc && !notif) {
      Alert.alert(
        'Permissions needed',
        'DURGA works best with location and notifications. You can enable them later in phone Settings.',
        [
          { text: 'Continue anyway', onPress: () => goHome(true) },
          { text: 'Try again', style: 'cancel' },
        ],
      );
      return;
    }

    goHome(!(loc && notif));
  };

  const onSkip = () => {
    Alert.alert(
      'Continue with limited access?',
      'SOS alerts and safer routes work better when GPS and notifications are on.',
      [
        { text: 'Go back', style: 'cancel' },
        { text: 'Continue', onPress: () => goHome(true) },
      ],
    );
  };

  return (
    <View style={[styles.fill, { backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
          <Shield size={16} color={maroon} strokeWidth={2.4} />
          <AppText weight="semibold" style={{ color: maroon, fontSize: 12 }}>
            Safety permissions
          </AppText>
        </View>

        <AppText weight="serifExtraBold" style={[styles.title, { color: theme.text }]}>
          Allow access
        </AppText>
        <AppText style={[styles.lead, { color: theme.textSecondary }]}>
          DURGA needs GPS and notifications to warn you early, share live location in SOS, and reach your trusted circle.
        </AppText>

        <PermCard
          icon={MapPin}
          title="Location (GPS)"
          body="Nearby risk, safer routes, and emergency live sharing."
          state={status.location}
          maroon={maroon}
          soft={theme.primarySoft}
          border={theme.border}
          surface={theme.surface}
          text={theme.text}
          muted={theme.textSecondary}
          onPress={requestLocation}
        />

        <PermCard
          icon={Bell}
          title="Notifications"
          body="SOS updates, safety alerts, and trusted-contact messages."
          state={status.notifications}
          maroon={maroon}
          soft={theme.primarySoft}
          border={theme.border}
          surface={theme.surface}
          text={theme.text}
          muted={theme.textSecondary}
          onPress={requestNotifications}
        />

        <AppText style={[styles.note, { color: theme.textSecondary }]}>
          You stay in control. Background location is only used during live sharing or SOS.
        </AppText>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), borderTopColor: theme.border }]}>
        <Pressable
          onPress={onAllowAll}
          disabled={busy}
          style={({ pressed }) => [
            styles.primary,
            { backgroundColor: maroon, opacity: pressed || busy ? 0.88 : 1 },
          ]}>
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText weight="bold" style={{ color: '#fff', fontSize: 16 }}>
              Allow location & notifications
            </AppText>
          )}
        </Pressable>

        <Pressable onPress={onSkip} disabled={busy} style={styles.link}>
          <AppText weight="semibold" style={{ color: theme.textSecondary, fontSize: 14 }}>
            Not now — limited access
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

function PermCard({
  icon: Icon,
  title,
  body,
  state,
  maroon,
  soft,
  border,
  surface,
  text,
  muted,
  onPress,
}: {
  icon: typeof MapPin;
  title: string;
  body: string;
  state: 'idle' | 'granted' | 'denied';
  maroon: string;
  soft: string;
  border: string;
  surface: string;
  text: string;
  muted: string;
  onPress: () => void | Promise<boolean>;
}) {
  const granted = state === 'granted';
  const denied = state === 'denied';

  return (
    <Pressable
      onPress={() => void onPress()}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: surface,
          borderColor: granted ? maroon : denied ? '#C45C5C' : border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: soft }]}>
        <Icon size={20} color={maroon} strokeWidth={2.3} />
      </View>
      <View style={styles.cardCopy}>
        <AppText weight="bold" style={{ color: text, fontSize: 16 }}>
          {title}
        </AppText>
        <AppText style={{ color: muted, fontSize: 13, lineHeight: 19, marginTop: 4 }}>{body}</AppText>
        <AppText
          weight="semibold"
          style={{
            color: granted ? '#2F6B4F' : denied ? '#A13F3C' : maroon,
            fontSize: 12,
            marginTop: 8,
          }}>
          {granted ? 'Allowed' : denied ? 'Denied — tap to retry' : 'Tap to allow'}
        </AppText>
      </View>
      <View
        style={[
          styles.check,
          {
            backgroundColor: granted ? maroon : 'transparent',
            borderColor: granted ? maroon : border,
          },
        ]}>
        {granted ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    letterSpacing: -0.4,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1, minWidth: 0 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 4,
  },
  primary: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  link: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
