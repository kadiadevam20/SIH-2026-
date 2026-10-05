import { router } from 'expo-router';
import { ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { useDiagonalBackInterceptor, useDiagonalDismiss } from '@/components/ui/DiagonalSlideScreen';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

const SECTIONS = [
  {
    title: 'Personal',
    subtitle: 'You and how the app feels',
    items: [
      { label: 'Profile', href: '/settings/profile' },
      { label: 'Instructions', href: '/settings/tutorials' },
      { label: 'Language', href: '/settings/language' },
      { label: 'Accessibility', href: '/settings/accessibility' },
    ],
  },
  {
    title: 'Safety',
    subtitle: 'People and emergency preferences',
    items: [
      { label: 'Trusted Contacts', href: '/(tabs)/contacts' },
      { label: 'Emergency Settings', href: '/settings/emergency-settings' },
      { label: 'Location Sharing', href: '/settings/emergency-settings' },
    ],
  },
  {
    title: 'Device',
    subtitle: 'Hardware and sync',
    items: [
      { label: 'Connected Hardware', href: '/(tabs)/hardware' },
      { label: 'Device Settings', href: '/(tabs)/hardware' },
    ],
  },
  {
    title: 'Privacy',
    subtitle: 'Data you control',
    items: [
      { label: 'Data Permissions', href: '/settings/privacy' },
      { label: 'Location History', href: '/settings/privacy' },
      { label: 'AI Data Controls', href: '/settings/privacy' },
    ],
  },
];

export default function SettingsHome() {
  const { theme, setOffline, offline, logout, userProfile } = useApp();
  const dismiss = useDiagonalDismiss();
  useDiagonalBackInterceptor();

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You will return to the login screen. Your local session will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
          // Leave the settings modal stack and land on login
          if (router.canDismiss()) {
            router.dismissAll();
          }
          router.replace('/onboarding');
        },
      },
    ]);
  };

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={SettingsIcon}
          status="Account active"
          title="Settings"
          subtitle={userProfile.fullName || 'Complete your profile'}
          onBack={dismiss}
        />
      </FadeIn>

      {SECTIONS.map((section, sIndex) => (
        <FadeIn key={section.title} delay={70 + sIndex * 40}>
          <SectionLabel theme={theme} title={section.title} subtitle={section.subtitle} />
          <View style={[styles.group, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {section.items.map((item, index) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.href as never)}
                style={[
                  styles.row,
                  index < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}>
                <AppText weight="medium" style={{ color: theme.text }}>
                  {item.label}
                </AppText>
                <ChevronRight size={16} color={theme.textSecondary} />
              </Pressable>
            ))}
          </View>
        </FadeIn>
      ))}

      <FadeIn delay={260}>
        <Pressable
          onPress={() => {
            setOffline(!offline);
            router.push('/offline');
          }}
          style={[styles.offlineLink, softShadow(theme), { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
          <AppText weight="semibold" style={{ color: theme.primary }}>
            {offline ? 'Offline mode is on — manage it' : 'Open offline safety mode'}
          </AppText>
        </Pressable>

        <Pressable
          onPress={confirmLogout}
          style={[styles.logout, softShadow(theme), { borderColor: theme.highSoft, backgroundColor: theme.highSoft }]}>
          <LogOut size={18} color={theme.high} />
          <AppText weight="bold" style={{ color: theme.high, fontSize: 16 }}>
            Log out
          </AppText>
        </Pressable>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineLink: {
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  logout: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
});
