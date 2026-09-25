import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';

import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_text.dart';

enum _PermState { idle, granted, denied }

class PermissionsScreen extends StatefulWidget {
  const PermissionsScreen({super.key});

  @override
  State<PermissionsScreen> createState() => _PermissionsScreenState();
}

class _PermissionsScreenState extends State<PermissionsScreen> {
  bool _busy = false;
  _PermState _location = _PermState.idle;
  _PermState _notifications = _PermState.idle;

  Future<void> _goHome(bool limited) async {
    await context.read<AppState>().completeOnboarding(limited);
    if (!mounted) return;
    context.go('/home');
  }

  Future<bool> _requestLocation() async {
    try {
      final current = await Permission.locationWhenInUse.status;
      if (current.isGranted) {
        setState(() => _location = _PermState.granted);
        return true;
      }

      final result = await Permission.locationWhenInUse.request();
      final ok = result.isGranted;
      setState(() => _location = ok ? _PermState.granted : _PermState.denied);
      return ok;
    } catch (_) {
      setState(() => _location = _PermState.denied);
      return false;
    }
  }

  Future<bool> _requestNotifications() async {
    try {
      final current = await Permission.notification.status;
      if (current.isGranted) {
        setState(() => _notifications = _PermState.granted);
        return true;
      }

      final result = await Permission.notification.request();
      final ok = result.isGranted;
      setState(() => _notifications = ok ? _PermState.granted : _PermState.denied);
      return ok;
    } catch (_) {
      setState(() => _notifications = _PermState.denied);
      return false;
    }
  }

  Future<void> _onAllowAll() async {
    setState(() => _busy = true);
    final loc = await _requestLocation();
    final notif = await _requestNotifications();
    setState(() => _busy = false);

    if (!loc && !notif) {
      if (!mounted) return;
      final action = await showDialog<String>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Permissions needed'),
          content: const Text(
            'DURGA works best with location and notifications. You can enable them later in phone Settings.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop('continue'),
              child: const Text('Continue anyway'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop('retry'),
              child: const Text('Try again'),
            ),
          ],
        ),
      );
      if (action == 'continue') {
        await _goHome(true);
      }
      return;
    }

    await _goHome(!(loc && notif));
  }

  Future<void> _onSkip() async {
    final action = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Continue with limited access?'),
        content: const Text(
          'SOS alerts and safer routes work better when GPS and notifications are on.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop('back'),
            child: const Text('Go back'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop('continue'),
            child: const Text('Continue'),
          ),
        ],
      ),
    );
    if (action == 'continue') {
      await _goHome(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top + 12;
    final bottom = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(24, top + 8, 24, bottom + 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.shield, size: 16, color: AppColors.maroon),
                        SizedBox(width: 8),
                        AppText(
                          'Safety permissions',
                          weight: AppFontWeight.semibold,
                          color: AppColors.maroon,
                          fontSize: 12,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  const AppText(
                    'Allow access',
                    weight: AppFontWeight.serifExtraBold,
                    color: AppColors.ink,
                    fontSize: 34,
                    letterSpacing: -0.4,
                  ),
                  const SizedBox(height: 10),
                  const AppText(
                    'DURGA needs GPS and notifications to warn you early, share live location in SOS, and reach your trusted circle.',
                    color: AppColors.muted,
                    fontSize: 15,
                    height: 22 / 15,
                  ),
                  const SizedBox(height: 22),
                  _PermCard(
                    icon: LucideIcons.mapPin,
                    title: 'Location (GPS)',
                    body: 'Nearby risk, safer routes, and emergency live sharing.',
                    state: _location,
                    onPress: _requestLocation,
                  ),
                  _PermCard(
                    icon: LucideIcons.bell,
                    title: 'Notifications',
                    body: 'SOS updates, safety alerts, and trusted-contact messages.',
                    state: _notifications,
                    onPress: _requestNotifications,
                  ),
                  const SizedBox(height: 8),
                  const AppText(
                    'You stay in control. Background location is only used during live sharing or SOS.',
                    color: AppColors.muted,
                    fontSize: 12,
                    height: 18 / 12,
                  ),
                ],
              ),
            ),
          ),
          Container(
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.line)),
            ),
            padding: EdgeInsets.fromLTRB(24, 12, 24, bottom > 16 ? bottom : 16),
            child: Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _busy ? null : _onAllowAll,
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.maroon,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: AppColors.maroon.withValues(alpha: 0.88),
                      minimumSize: const Size.fromHeight(54),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: const StadiumBorder(),
                    ),
                    child: _busy
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              color: Colors.white,
                            ),
                          )
                        : const AppText(
                            'Allow location & notifications',
                            weight: AppFontWeight.bold,
                            color: Colors.white,
                            fontSize: 16,
                          ),
                  ),
                ),
                const SizedBox(height: 4),
                TextButton(
                  onPressed: _busy ? null : _onSkip,
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const AppText(
                    'Not now — limited access',
                    weight: AppFontWeight.semibold,
                    color: AppColors.muted,
                    fontSize: 14,
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

class _PermCard extends StatelessWidget {
  const _PermCard({
    required this.icon,
    required this.title,
    required this.body,
    required this.state,
    required this.onPress,
  });

  final IconData icon;
  final String title;
  final String body;
  final _PermState state;
  final Future<bool> Function() onPress;

  @override
  Widget build(BuildContext context) {
    final granted = state == _PermState.granted;
    final denied = state == _PermState.denied;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          onTap: () => onPress(),
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: granted
                    ? AppColors.maroon
                    : denied
                        ? const Color(0xFFC45C5C)
                        : AppColors.line,
                width: 1.5,
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icon, size: 20, color: AppColors.maroon),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppText(
                        title,
                        weight: AppFontWeight.bold,
                        color: AppColors.ink,
                        fontSize: 16,
                      ),
                      const SizedBox(height: 4),
                      AppText(
                        body,
                        color: AppColors.muted,
                        fontSize: 13,
                        height: 19 / 13,
                      ),
                      const SizedBox(height: 8),
                      AppText(
                        granted
                            ? 'Allowed'
                            : denied
                                ? 'Denied — tap to retry'
                                : 'Tap to allow',
                        weight: AppFontWeight.semibold,
                        color: granted
                            ? const Color(0xFF2F6B4F)
                            : denied
                                ? AppColors.maroonSoft
                                : AppColors.maroon,
                        fontSize: 12,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 24,
                  height: 24,
                  margin: const EdgeInsets.only(top: 2),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: granted ? AppColors.maroon : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: granted ? AppColors.maroon : AppColors.line,
                      width: 1.5,
                    ),
                  ),
                  child: granted
                      ? const Icon(LucideIcons.check, size: 14, color: Colors.white)
                      : null,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
