import 'package:durga_ai/theme/app_colors.dart';
import 'package:durga_ai/widgets/app_shadow.dart';
import 'package:durga_ai/widgets/app_text.dart';
import 'package:durga_ai/widgets/layout_metrics.dart';
import 'package:durga_ai/widgets/sos_bar.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

export 'package:durga_ai/widgets/layout_metrics.dart' show tabBarTotalHeight;

class _TabItem {
  const _TabItem({
    required this.route,
    required this.label,
    required this.icon,
  });

  final String route;
  final String label;
  final IconData icon;
}

const _tabs = [
  _TabItem(route: '/home', label: 'Home', icon: LucideIcons.home),
  _TabItem(route: '/map', label: 'Map', icon: LucideIcons.map),
  _TabItem(route: '/durga', label: 'DURGA', icon: LucideIcons.messageCircle),
  _TabItem(route: '/contacts', label: 'Contacts', icon: LucideIcons.contact),
  _TabItem(route: '/hardware', label: 'Device', icon: LucideIcons.watch),
];

/// Tab shell with SOS strip and five-tab bottom navigation.
class CustomTabShell extends StatelessWidget {
  const CustomTabShell({super.key, required this.child});

  final Widget child;

  String _activeRoute(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    for (final tab in _tabs) {
      if (location == tab.route || location.startsWith('${tab.route}/')) {
        return tab.route;
      }
    }
    return location;
  }

  @override
  Widget build(BuildContext context) {
    final active = _activeRoute(context);
    final bottomInset = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          child,
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                12,
                0,
                12,
                bottomInset > 10 ? bottomInset : 10,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SOSBar(),
                  const SizedBox(height: tabBarGap),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppColors.line),
                      boxShadow: softShadow(),
                    ),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(minHeight: tabBarHeight),
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(4, 8, 4, 6),
                        child: Row(
                          children: [
                            for (final tab in _tabs)
                              Expanded(
                                child: _TabButton(
                                  tab: tab,
                                  focused: active == tab.route,
                                  onTap: () {
                                    if (active != tab.route) {
                                      context.go(tab.route);
                                    }
                                  },
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TabButton extends StatelessWidget {
  const _TabButton({
    required this.tab,
    required this.focused,
    required this.onTap,
  });

  final _TabItem tab;
  final bool focused;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = focused ? AppColors.maroon : AppColors.tabInactive;

    return Semantics(
      button: true,
      selected: focused,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(tab.icon, size: 22, color: color),
                const SizedBox(height: 2),
                AppText(
                  tab.label,
                  weight: focused ? AppFontWeight.bold : AppFontWeight.medium,
                  color: color,
                  fontSize: 10,
                ),
                const SizedBox(height: 2),
                Container(
                  width: 4,
                  height: 4,
                  decoration: BoxDecoration(
                    color: focused ? AppColors.maroon : Colors.transparent,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
