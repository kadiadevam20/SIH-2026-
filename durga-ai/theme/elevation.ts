import { Platform, ViewStyle } from 'react-native';

import { AppTheme } from '@/theme';

export function cardShadow(theme: AppTheme, elevated = false): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: elevated
        ? '0 14px 32px rgba(122, 29, 29, 0.12)'
        : '0 6px 18px rgba(122, 29, 29, 0.08)',
    } as ViewStyle;
  }
  return {
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: elevated ? 8 : 4 },
    shadowOpacity: 0.14,
    shadowRadius: elevated ? 16 : 10,
    elevation: elevated ? 6 : 3,
  };
}

export function softShadow(theme: AppTheme): ViewStyle {
  if (Platform.OS === 'web') {
    return { boxShadow: '0 4px 14px rgba(122, 29, 29, 0.08)' } as ViewStyle;
  }
  return {
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  };
}
