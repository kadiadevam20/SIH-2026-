import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/app_shadow.dart';
import '../widgets/app_text.dart';
import '../widgets/durga_screen.dart';
import '../widgets/fade_in.dart';
import '../widgets/page_header.dart';

class _SettingsItem {
  const _SettingsItem({required this.label, required this.route});

  final String label;
  final String route;
}

class _SettingsSection {
  const _SettingsSection({
    required this.title,
    required this.subtitle,
    required this.items,
  });

  final String title;
  final String subtitle;
  final List<_SettingsItem> items;
}

const _sections = <_SettingsSection>[
  _SettingsSection(
    title: 'Personal',
    subtitle: 'You and how the app feels',
    items: [
      _SettingsItem(label: 'Profile', route: '/settings/profile'),
      _SettingsItem(label: 'Instructions', route: '/settings/tutorials'),
      _SettingsItem(label: 'Language', route: '/settings/language'),
      _SettingsItem(label: 'Accessibility', route: '/settings/accessibility'),
    ],
  ),
  _SettingsSection(
    title: 'Safety',
    subtitle: 'People and emergency preferences',
    items: [
      _SettingsItem(label: 'Trusted Contacts', route: '/contacts'),
      _SettingsItem(label: 'Emergency Settings', route: '/settings/emergency-settings'),
      _SettingsItem(label: 'Location Sharing', route: '/settings/emergency-settings'),
    ],
  ),
  _SettingsSection(
    title: 'Device',
    subtitle: 'Hardware and sync',
    items: [
      _SettingsItem(label: 'Connected Hardware', route: '/hardware'),
      _SettingsItem(label: 'Device Settings', route: '/hardware'),
    ],
  ),
  _SettingsSection(
    title: 'Privacy',
    subtitle: 'Data you control',
    items: [
      _SettingsItem(label: 'Data Permissions', route: '/settings/privacy'),
      _SettingsItem(label: 'Location History', route: '/settings/privacy'),
      _SettingsItem(label: 'AI Data Controls', route: '/settings/privacy'),
    ],
  ),
];

/// Settings home — grouped links, offline toggle, logout.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  Future<void> _confirmLogout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const AppText('Log out?', weight: AppFontWeight.bold),
        content: const AppText(
          'You will return to the login screen. Your local session will be cleared.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const AppText('Cancel', weight: AppFontWeight.medium),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const AppText('Log out', weight: AppFontWeight.bold, color: AppColors.high),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await context.read<AppState>().logout();
      context.go('/onboarding');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return DurgaScreen(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(
            child: PageHeader(
              icon: LucideIcons.settings,
              status: 'Account active',
              title: 'Settings',
              subtitle: state.userProfile.fullName.isNotEmpty
                  ? state.userProfile.fullName
                  : 'Complete your profile',
              onBack: () => context.pop(),
            ),
          ),
          for (var i = 0; i < _sections.length; i++)
            FadeIn(
              delay: Duration(milliseconds: 70 + i * 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  SectionLabel(
                    title: _sections[i].title,
                    subtitle: _sections[i].subtitle,
                  ),
                  Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.line),
                      boxShadow: softShadow(),
                    ),
                    child: Column(
                      children: [
                        for (var j = 0; j < _sections[i].items.length; j++)
                          _SettingsRow(
                            label: _sections[i].items[j].label,
                            showDivider: j < _sections[i].items.length - 1,
                            onTap: () => context.push(_sections[i].items[j].route),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          FadeIn(
            delay: const Duration(milliseconds: 260),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    state.setOffline(!state.offline);
                    context.push('/offline');
                  },
                  child: Container(
                    margin: const EdgeInsets.only(top: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.maroon),
                      boxShadow: softShadow(),
                    ),
                    alignment: Alignment.center,
                    child: AppText(
                      state.offline ? 'Offline mode is on — manage it' : 'Open offline safety mode',
                      weight: AppFontWeight.semibold,
                      color: AppColors.maroon,
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                GestureDetector(
                  onTap: () => _confirmLogout(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      color: AppColors.highSoft,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.highSoft),
                      boxShadow: softShadow(),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.logOut, size: 18, color: AppColors.high),
                        SizedBox(width: 8),
                        AppText('Log out', weight: AppFontWeight.bold, color: AppColors.high, fontSize: 16),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  const _SettingsRow({
    required this.label,
    required this.showDivider,
    required this.onTap,
  });

  final String label;
  final bool showDivider;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 15),
        decoration: BoxDecoration(
          border: showDivider
              ? const Border(bottom: BorderSide(color: AppColors.line))
              : null,
        ),
        child: Row(
          children: [
            Expanded(
              child: AppText(label, weight: AppFontWeight.medium, color: AppColors.ink),
            ),
            const Icon(LucideIcons.chevronRight, size: 16, color: AppColors.muted),
          ],
        ),
      ),
    );
  }
}
