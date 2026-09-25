const double tabBarHeight = 56;
const double sosBarHeight = 46;
const double tabBarGap = 8;
const double tabBarTotalHeight = tabBarHeight + sosBarHeight + tabBarGap;

/// Bottom inset reserved for SOS strip + tab bar on tab screens.
double bottomChromeHeight(bool onTabs, double insetBottom) {
  final safe = insetBottom > 10 ? insetBottom : 10.0;
  if (onTabs) return tabBarTotalHeight + safe + 8;
  return sosBarHeight + safe + 16;
}
