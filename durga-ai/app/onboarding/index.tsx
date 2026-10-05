import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DesignFooterArt } from '@/components/ui/DesignFooterArt';
import { MaroonField } from '@/components/ui/MaroonField';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { buildFullName } from '@/data/mock';

export default function LoginScreen() {
  const { theme, updateUserProfile, userProfile } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    if (!userProfile.firstName) {
      const name = email.split('@')[0] || 'Guardian';
      updateUserProfile({
        ...userProfile,
        firstName: name,
        fullName: buildFullName(name, ''),
      });
    }
    router.replace('/onboarding/permissions');
  };

  return (
    <View style={[styles.fill, { backgroundColor: theme.bg, paddingTop: insets.top + 28 }]}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: 200 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AppText weight="serif" style={styles.welcome}>
            Welcome
          </AppText>
          <AppText weight="serifExtraBold" style={[styles.brand, { color: theme.primary }]}>
            D.U.R.G.A
          </AppText>
          <AppText weight="serif" style={styles.tagline}>
            Your Digital Guardian
          </AppText>

          <View style={styles.form}>
            <MaroonField value={email} onChangeText={setEmail} placeholder="Enter Your Name" keyboardType="email-address" />
            <MaroonField value={password} onChangeText={setPassword} placeholder="Enter your Password" secureTextEntry />
            <Pressable onPress={() => Alert.alert('Forgot password', 'Password reset will be available soon.')}>
              <AppText style={styles.forgot}>forgot password ?</AppText>
            </Pressable>

            <Pressable
              onPress={onLogin}
              style={({ pressed }) => [styles.loginBtn, { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }]}>
              <AppText weight="bold" style={{ color: '#fff', fontSize: 16 }}>
                Log in
              </AppText>
            </Pressable>

            <Pressable onPress={() => router.push('/onboarding/signup' as never)} style={styles.signupLink}>
              <AppText style={{ color: theme.text, fontSize: 14 }}>
                New here? <AppText weight="bold" style={{ color: theme.primary }}>Sign up</AppText>
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DesignFooterArt source={require('../../assets/images/ui/login-women.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 42,
    color: '#0F0F0F',
    marginTop: 8,
  },
  brand: {
    fontSize: 36,
    letterSpacing: 2,
    marginTop: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#0F0F0F',
    marginTop: 4,
    marginBottom: 36,
  },
  form: {
    width: '100%',
    maxWidth: 360,
    gap: 14,
    alignItems: 'center',
  },
  forgot: {
    fontSize: 13,
    color: '#0F0F0F',
    marginTop: 4,
  },
  loginBtn: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  signupLink: { marginTop: 8, paddingVertical: 8 },
});
