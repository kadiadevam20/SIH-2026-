export const palette = {
  white: '#FFFFFF',
  cream: '#F5F1E8',
  creamDeep: '#EBE1CF',
  maroon: '#7A1D1D',
  maroonSoft: '#A13F3C',
  maroonMuted: '#6D2323',
  ink: '#0F0F0F',
  muted: '#6B5E55',
  line: '#D9CFC0',
  safe: '#22C55E',
  safeSoft: '#DCFCE7',
  moderate: '#F59E0B',
  moderateSoft: '#FEF3C7',
  high: '#C0392B',
  highSoft: '#FCE8E6',
  emergency: '#7A1D1D',
  navy: '#1A1210',
  navyCard: '#2A1C18',
  navySoft: '#3A2A24',
};

export const lightTheme = {
  mode: 'light' as const,
  bg: palette.cream,
  bgElevated: palette.white,
  surface: palette.white,
  surfaceMuted: palette.creamDeep,
  text: palette.ink,
  textSecondary: palette.muted,
  textInverse: palette.white,
  primary: palette.maroon,
  primarySoft: '#F3E4E0',
  accent: palette.maroonSoft,
  border: palette.line,
  tabBar: 'rgba(245,241,232,0.96)',
  overlay: 'rgba(26,18,16,0.45)',
  shadow: '#8A7A6A',
  safe: palette.safe,
  safeSoft: palette.safeSoft,
  moderate: palette.moderate,
  moderateSoft: palette.moderateSoft,
  high: palette.high,
  highSoft: palette.highSoft,
  mapBase: '#EDE6D8',
  navy: palette.navy,
  navyCard: palette.navyCard,
  navySoft: palette.navySoft,
  maroon: palette.maroon,
  cream: palette.cream,
  creamDeep: palette.creamDeep,
};

export const darkTheme = {
  ...lightTheme,
  mode: 'dark' as const,
  bg: palette.navy,
  bgElevated: palette.navyCard,
  surface: palette.navyCard,
  surfaceMuted: palette.navySoft,
  text: '#F5F1E8',
  textSecondary: '#C4B5A8',
  border: '#4A3830',
};

export type AppTheme = typeof lightTheme | typeof darkTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
};

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
  serif: 'PlayfairDisplay_400Regular',
  serifMedium: 'PlayfairDisplay_500Medium',
  serifBold: 'PlayfairDisplay_700Bold',
  serifExtraBold: 'PlayfairDisplay_800ExtraBold',
};
