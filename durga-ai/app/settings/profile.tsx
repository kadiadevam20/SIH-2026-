import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

function profileInitials(fullName: string, firstName: string) {
  const source = fullName.trim() || firstName.trim();
  if (!source) return '?';
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function emergencyId(firstName: string, phone: string) {
  const tag = firstName.trim().toUpperCase().replace(/\s+/g, '').slice(0, 8) || 'USER';
  const digits = phone.replace(/\D/g, '').slice(-3) || '000';
  return `DURGA-${tag}-${digits}`;
}

export default function ProfileScreen() {
  const { theme, userProfile } = useApp();
  const initials = profileInitials(userProfile.fullName, userProfile.firstName);
  const id = emergencyId(userProfile.firstName, userProfile.phone);

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={User}
          status="Your profile"
          title="Profile"
          subtitle="Personal details used for safety assistance"
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={80}>
        <View style={styles.avatarBlock}>
          <View style={[styles.avatar, softShadow(theme), { backgroundColor: theme.primary }]}>
            <AppText weight="bold" style={{ color: '#fff', fontSize: 28 }}>
              {initials}
            </AppText>
          </View>
          <AppText weight="bold" style={{ color: theme.text, fontSize: 20, marginTop: 12 }}>
            {userProfile.fullName || 'Add your name in onboarding'}
          </AppText>
          <AppText style={{ color: theme.textSecondary }}>
            {userProfile.phone || 'No phone saved'}
          </AppText>
        </View>
      </FadeIn>

      <FadeIn delay={140}>
        <SectionLabel theme={theme} title="Details" />
        {[
          ['City', userProfile.city ? `${userProfile.city}, ${userProfile.state}` : 'Not set'],
          ['Home area', userProfile.area || 'Not set'],
          ['Emergency ID', id],
        ].map(([k, v]) => (
          <View
            key={k}
            style={[styles.card, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>{k}</AppText>
            <AppText weight="semibold" style={{ color: theme.text, marginTop: 4 }}>
              {v}
            </AppText>
          </View>
        ))}
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarBlock: { alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
});
