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

export default function SignupScreen() {
  const { theme, updateUserProfile } = useApp();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const onSignup = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Complete signup', 'Please fill name, email, phone, and password.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords differ', 'Confirm password must match.');
      return;
    }
    const firstName = name.trim();
    updateUserProfile({
      firstName,
      lastName: '',
      fullName: buildFullName(firstName, ''),
      phone: phone.trim(),
      city: 'Ahmedabad',
      state: 'Gujarat',
      area: 'Ahmedabad',
    });
    router.replace('/onboarding/permissions');
  };

  return (
    <View style={[styles.fill, { backgroundColor: theme.bg, paddingTop: insets.top + 28 }]}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: 200 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AppText weight="serif" style={styles.title}>
            Signup
          </AppText>

          <View style={styles.form}>
            <MaroonField value={name} onChangeText={setName} placeholder="Enter Your Name" autoCapitalize="words" />
            <MaroonField value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />
            <MaroonField value={phone} onChangeText={setPhone} placeholder="Enter your Phone No." keyboardType="phone-pad" />
            <MaroonField value={password} onChangeText={setPassword} placeholder="Enter Your Password" secureTextEntry />
            <MaroonField value={confirm} onChangeText={setConfirm} placeholder="Confirm Password" secureTextEntry />

            <Pressable
              onPress={onSignup}
              style={({ pressed }) => [styles.cta, { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }]}>
              <AppText weight="bold" style={{ color: '#fff', fontSize: 16 }}>
                Create account
              </AppText>
            </Pressable>

            <Pressable onPress={() => router.back()} style={{ paddingVertical: 10 }}>
              <AppText style={{ color: theme.text, fontSize: 14 }}>
                Already have an account? <AppText weight="bold" style={{ color: theme.primary }}>Log in</AppText>
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DesignFooterArt source={require('../../assets/images/ui/signup-women.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: '#0F0F0F',
    marginBottom: 28,
    marginTop: 8,
  },
  form: {
    width: '100%',
    maxWidth: 360,
    gap: 14,
    alignItems: 'center',
  },
  cta: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
});
