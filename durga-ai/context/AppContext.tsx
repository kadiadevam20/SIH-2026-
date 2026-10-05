import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

import {
  ChatMessage,
  Contact,
  defaultUserProfile,
  initialContacts,
  initialMessages,
  RiskLevel,
  UserProfile,
  welcomeMessage,
} from '@/data/mock';
import { AppTheme, darkTheme, lightTheme } from '@/theme';

type ThemePref = 'system' | 'light' | 'dark';

type DeviceSettings = {
  connected: boolean;
  name: string;
  battery: number;
  connection: string;
  sosButton: boolean;
  fallDetection: boolean;
  locationTracking: boolean;
  emergencyAlert: boolean;
};

type EmergencyStep = {
  id: string;
  label: string;
  status: 'done' | 'pending' | 'active';
};

type AppState = {
  theme: AppTheme;
  themePref: ThemePref;
  colorScheme: ColorSchemeName;
  ready: boolean;
  onboarded: boolean;
  limitedAccess: boolean;
  userProfile: UserProfile;
  userName: string;
  locationSharing: boolean;
  offline: boolean;
  safetyLevel: RiskLevel;
  safetyScore: number;
  contacts: Contact[];
  device: DeviceSettings;
  emergencyActive: boolean;
  emergencyCountdown: number;
  emergencySteps: EmergencyStep[];
  messages: ChatMessage[];
  isTyping: boolean;
  setThemePref: (pref: ThemePref) => void;
  completeOnboarding: (limited: boolean) => void;
  updateUserProfile: (profile: UserProfile) => void;
  logout: () => void;
  setLocationSharing: (value: boolean) => void;
  setOffline: (value: boolean) => void;
  setSafetyLevel: (level: RiskLevel) => void;
  addContact: (contact: Omit<Contact, 'id' | 'initials' | 'color'>) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  toggleDeviceSetting: (key: keyof Omit<DeviceSettings, 'connected' | 'name' | 'battery' | 'connection'>) => void;
  setDeviceConnected: (value: boolean) => void;
  startEmergency: () => void;
  stopEmergency: () => void;
  sendMessage: (text: string) => void;
};

const AppContext = createContext<AppState | null>(null);
const STORAGE_KEY = 'durga.onboarded';
const PROFILE_KEY = 'durga.profile';

const AVATAR_COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#1D4ED8', '#64748B'];

function initialsFrom(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function durgaReply(text: string): ChatMessage {
  const lower = text.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (lower.includes('follow')) {
    return {
      id: `d-${Date.now()}`,
      role: 'durga',
      time,
      text: 'Stay calm. I recommend moving toward a well-lit and populated area. I can guide you to the nearest safe location.',
      actions: [
        { id: 'help', label: 'Nearby Help' },
        { id: 'share', label: 'Share Live Location' },
        { id: 'alert', label: 'Alert Contacts', variant: 'emergency' },
        { id: 'call', label: 'Emergency Call', variant: 'emergency' },
      ],
    };
  }
  if (lower.includes('unsafe') || lower.includes('scared')) {
    return {
      id: `d-${Date.now()}`,
      role: 'durga',
      time,
      text: 'I am with you. Stay on a main road if you can. Would you like me to share your live location with Priya and guide you to the nearest safe place?',
      actions: [
        { id: 'share', label: 'Share Live Location' },
        { id: 'help', label: 'Nearby Help' },
        { id: 'alert', label: 'Alert Trusted Contacts', variant: 'emergency' },
      ],
    };
  }
  if (lower.includes('police')) {
    return {
      id: `d-${Date.now()}`,
      role: 'durga',
      time,
      text: 'Navrangpura Police Station is 0.8 km away and open 24 hours. I can open nearby help, or place a call to 100.',
      actions: [
        { id: 'nav-police', label: 'Open Nearby Help' },
        { id: 'call', label: 'Call 100', variant: 'emergency' },
      ],
    };
  }
  if (lower.includes('route') || lower.includes('navigate')) {
    return {
      id: `d-${Date.now()}`,
      role: 'durga',
      time,
      text: 'The map shows safety zones around you. Open it to check nearby risk, or use nearby help for police and hospitals.',
      actions: [{ id: 'help', label: 'Nearby Help' }, { id: 'safest', label: 'Open Safety Map' }],
    };
  }
  if (lower.includes('location') || lower.includes('share')) {
    return {
      id: `d-${Date.now()}`,
      role: 'durga',
      time,
      text: 'Live location sharing is ready. Priya Patel (primary contact) will see your location until you stop sharing.',
      actions: [{ id: 'share', label: 'Share with Priya' }, { id: 'share-all', label: 'Share with all contacts' }],
    };
  }
  if (lower.includes('emergency') || lower.includes('instruction')) {
    return {
      id: `d-${Date.now()}`,
      role: 'durga',
      time,
      text: 'If you cannot speak, hold SOS. I will share location, notify Priya, and keep a 112 call ready. Move toward light and people. Do not head home if you think you are being followed.',
      actions: [{ id: 'sos', label: 'Open Emergency Mode', variant: 'emergency' }],
    };
  }
  return {
    id: `d-${Date.now()}`,
    role: 'durga',
    time,
    text: 'I am monitoring your safety. Tell me if you feel unsafe, need nearby help, or want me to alert someone.',
    actions: [
      { id: 'help', label: 'Nearby Help' },
      { id: 'share', label: 'Share Live Location' },
    ],
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [themePref, setThemePref] = useState<ThemePref>('light');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');
  const [onboarded, setOnboarded] = useState(false);
  const [limitedAccess, setLimitedAccess] = useState(false);
  const [userProfileState, setUserProfileState] = useState<UserProfile>(defaultUserProfile);
  const [locationSharing, setLocationSharing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [safetyLevel, setSafetyLevel] = useState<RiskLevel>('safe');
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [device, setDevice] = useState<DeviceSettings>({
    connected: true,
    name: 'DURGA Safety Band',
    battery: 82,
    connection: 'Bluetooth',
    sosButton: true,
    fallDetection: true,
    locationTracking: true,
    emergencyAlert: true,
  });
  const [emergencySteps, setEmergencySteps] = useState<EmergencyStep[]>([
    { id: 'sos', label: 'SOS Activated', status: 'pending' },
    { id: 'loc', label: 'Live location shared', status: 'pending' },
    { id: 'priya', label: 'Priya notified', status: 'pending' },
    { id: 'services', label: 'Contacting emergency services', status: 'pending' },
  ]);

  const colorScheme: ColorSchemeName =
    themePref === 'system' ? systemScheme : themePref === 'dark' ? 'dark' : 'light';
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const safetyScore = safetyLevel === 'safe' ? 82 : safetyLevel === 'moderate' ? 58 : 31;

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme: next }) => setSystemScheme(next));
    Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(PROFILE_KEY)])
      .then(([onboardedValue, profileValue]) => {
        if (onboardedValue === '1' || onboardedValue === 'limited') {
          setOnboarded(true);
          setLimitedAccess(onboardedValue === 'limited');
        }
        if (profileValue) {
          try {
            const parsed = JSON.parse(profileValue) as UserProfile;
            setUserProfileState(parsed);
            if (parsed.firstName.trim()) {
              setMessages([welcomeMessage(parsed.firstName)]);
            }
          } catch {
            /* ignore corrupt profile */
          }
        }
      })
      .finally(() => setReady(true));
    return () => sub.remove();
  }, []);

  const updateUserProfile = useCallback((profile: UserProfile) => {
    setUserProfileState(profile);
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    if (profile.firstName.trim()) {
      setMessages([welcomeMessage(profile.firstName)]);
    }
  }, []);

  const completeOnboarding = useCallback((limited: boolean) => {
    setLimitedAccess(limited);
    setOnboarded(true);
    AsyncStorage.setItem(STORAGE_KEY, limited ? 'limited' : '1');
  }, []);

  const logout = useCallback(() => {
    AsyncStorage.multiRemove([STORAGE_KEY, PROFILE_KEY]);
    setOnboarded(false);
    setLimitedAccess(false);
    setUserProfileState(defaultUserProfile);
    setLocationSharing(false);
    setEmergencyActive(false);
    setEmergencyCountdown(0);
    setMessages(initialMessages);
    setContacts(initialContacts);
  }, []);

  const addContact = useCallback((contact: Omit<Contact, 'id' | 'initials' | 'color'>) => {
    setContacts((prev) => {
      const next = contact.primary ? prev.map((item) => ({ ...item, primary: false })) : prev;
      return [
        ...next,
        {
          ...contact,
          id: `c-${Date.now()}`,
          initials: initialsFrom(contact.name),
          color: AVATAR_COLORS[next.length % AVATAR_COLORS.length],
        },
      ];
    });
  }, []);

  const updateContact = useCallback((id: string, patch: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((item) => {
        if (patch.primary && item.id !== id) return { ...item, primary: false };
        if (item.id !== id) return item;
        const merged = { ...item, ...patch };
        if (patch.name) merged.initials = initialsFrom(patch.name);
        return merged;
      })
    );
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleDeviceSetting = useCallback(
    (key: keyof Omit<DeviceSettings, 'connected' | 'name' | 'battery' | 'connection'>) => {
      setDevice((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const startEmergency = useCallback(() => {
    setEmergencyActive(true);
    setEmergencyCountdown(5);
    setLocationSharing(true);
    setEmergencySteps([
      { id: 'sos', label: 'SOS Activated', status: 'done' },
      { id: 'loc', label: 'Live location shared', status: 'active' },
      { id: 'priya', label: 'Priya notified', status: 'pending' },
      { id: 'services', label: 'Contacting emergency services', status: 'pending' },
    ]);
  }, []);

  const stopEmergency = useCallback(() => {
    setEmergencyActive(false);
    setEmergencyCountdown(0);
    setEmergencySteps((prev) => prev.map((step) => ({ ...step, status: 'pending' as const })));
  }, []);

  useEffect(() => {
    if (!emergencyActive) return;
    const timer = setInterval(() => {
      setEmergencySteps((prev) => {
        const activeIndex = prev.findIndex((step) => step.status === 'active');
        if (activeIndex === -1) return prev;
        return prev.map((step, index) => {
          if (index === activeIndex) return { ...step, status: 'done' };
          if (index === activeIndex + 1) return { ...step, status: 'active' };
          return step;
        });
      });
      setEmergencyCountdown((value) => Math.max(0, value - 1));
    }, 900);
    return () => clearInterval(timer);
  }, [emergencyActive]);

  const sendMessage = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, time };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, durgaReply(text)]);
      setIsTyping(false);
    }, 900);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      theme,
      themePref,
      colorScheme,
      ready,
      onboarded,
      limitedAccess,
      userProfile: userProfileState,
      userName: userProfileState.firstName.trim() || 'there',
      locationSharing,
      offline,
      safetyLevel,
      safetyScore,
      contacts,
      device,
      emergencyActive,
      emergencyCountdown,
      emergencySteps,
      messages,
      isTyping,
      setThemePref,
      completeOnboarding,
      updateUserProfile,
      logout,
      setLocationSharing,
      setOffline,
      setSafetyLevel,
      addContact,
      updateContact,
      removeContact,
      toggleDeviceSetting,
      setDeviceConnected: (connected) => setDevice((prev) => ({ ...prev, connected })),
      startEmergency,
      stopEmergency,
      sendMessage,
    }),
    [
      theme,
      themePref,
      colorScheme,
      ready,
      onboarded,
      limitedAccess,
      userProfileState,
      locationSharing,
      offline,
      safetyLevel,
      safetyScore,
      contacts,
      device,
      emergencyActive,
      emergencyCountdown,
      emergencySteps,
      messages,
      isTyping,
      completeOnboarding,
      updateUserProfile,
      logout,
      addContact,
      updateContact,
      removeContact,
      toggleDeviceSetting,
      startEmergency,
      stopEmergency,
      sendMessage,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
