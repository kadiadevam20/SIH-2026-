export const TAB_BAR_HEIGHT = 72;
export const SOS_BAR_HEIGHT = 46;
export const TAB_BAR_GAP = 8;

/** Total bottom chrome on tab screens: SOS strip + gap + tab bar */
export const TAB_BAR_TOTAL_HEIGHT = TAB_BAR_HEIGHT + SOS_BAR_HEIGHT + TAB_BAR_GAP;

const STACK_PREFIXES = ['settings', 'trusted-contact', 'nearby-help', 'offline', 'report', 'onboarding', 'emergency'] as const;

export function isStackScreen(pathname: string) {
  return STACK_PREFIXES.some((segment) => pathname.includes(segment));
}

export function isOnTabs(pathname: string | null) {
  if (!pathname || pathname === '/') return false;
  return !isStackScreen(pathname);
}

export function bottomChromeHeight(onTabs: boolean, insetBottom: number) {
  const safe = Math.max(insetBottom, 10);
  if (onTabs) return TAB_BAR_TOTAL_HEIGHT + safe + 8;
  return SOS_BAR_HEIGHT + safe + 16;
}
