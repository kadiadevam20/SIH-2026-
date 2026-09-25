import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../providers/app_state.dart';
import '../theme/app_colors.dart';
import '../widgets/app_text.dart';
import '../widgets/emergency_timeline.dart';
import '../widgets/living_pulse.dart';

/// Full-screen emergency — red gradient, SOS orb, status grid, timeline, call actions.
class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({super.key});

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> with SingleTickerProviderStateMixin {
  bool _confirm = false;
  late final AnimationController _pulseController;
  late final Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
    _pulse = Tween<double>(begin: 1, end: 1.08).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOutSine),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _call(String number) async {
    final uri = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _endEmergency(BuildContext context) {
    context.read<AppState>().stopEmergency();
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final primaries = state.contacts.where((c) => c.primary);
    final primary = primaries.isEmpty ? null : primaries.first;
    final bottom = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      body: Stack(
        children: [
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF7F1D1D), Color(0xFF450A0A), Color(0xFF1C0508)],
              ),
            ),
            child: SizedBox.expand(),
          ),
          Column(
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(20, MediaQuery.paddingOf(context).top + 8, 20, 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AppText(
                            'EMERGENCY MODE',
                            weight: AppFontWeight.extraBold,
                            color: Colors.white,
                            fontSize: 20,
                            letterSpacing: 0.3,
                          ),
                          SizedBox(height: 4),
                          AppText(
                            'Help is being coordinated. Scroll for details.',
                            color: Color(0xC7FFFFFF),
                            fontSize: 13,
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _confirm = true),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.35),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                        ),
                        child: const Row(
                          children: [
                            Icon(LucideIcons.x, size: 16, color: Colors.white),
                            SizedBox(width: 4),
                            AppText('End', weight: AppFontWeight.bold, color: Colors.white, fontSize: 12),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.fromLTRB(20, 8, 20, bottom + 100),
                  child: Column(
                    children: [
                      ScaleTransition(
                        scale: _pulse,
                        child: Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 22),
                          decoration: BoxDecoration(
                            color: const Color(0x8CDC2626),
                            borderRadius: BorderRadius.circular(28),
                            border: Border.all(color: const Color(0x73FCA5A5)),
                          ),
                          child: const Column(
                            children: [
                              Icon(LucideIcons.shield, size: 28, color: Colors.white),
                              SizedBox(height: 8),
                              AppText(
                                'SOS ACTIVE',
                                weight: AppFontWeight.extraBold,
                                color: Colors.white,
                                fontSize: 22,
                                letterSpacing: 1.2,
                              ),
                              SizedBox(height: 8),
                              LivingPulse(color: Color(0xFFFCA5A5), size: 12),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          _StatusTile(
                            label: 'Live location',
                            value: state.locationSharing ? 'Sharing' : 'Activating',
                          ),
                          _StatusTile(
                            label: 'Trusted contacts',
                            value: primary != null ? '${primary.name} notified' : 'Pending',
                          ),
                          const _StatusTile(label: 'Police', value: 'Contacting 112'),
                          const _StatusTile(label: 'Ambulance', value: 'Ready · 108'),
                        ],
                      ),
                      const SizedBox(height: 12),
                      EmergencyTimeline(items: state.emergencySteps),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          _BigAction(
                            icon: LucideIcons.phone,
                            label: 'Call Police',
                            onTap: () => _call('112'),
                          ),
                          _BigAction(
                            icon: LucideIcons.phone,
                            label: 'Call Ambulance',
                            onTap: () => _call('108'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      GestureDetector(
                        onTap: () => setState(() => _confirm = true),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                          ),
                          alignment: Alignment.center,
                          child: const AppText(
                            "Stop SOS — I'm safe now",
                            weight: AppFontWeight.bold,
                            color: AppColors.maroon,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(20, 10, 20, bottom < 12 ? 12 : bottom),
              decoration: BoxDecoration(
                color: const Color(0xEB1C0508),
                border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.12))),
              ),
              child: GestureDetector(
                onTap: () => setState(() => _confirm = true),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Column(
                    children: [
                      AppText(
                        'Stop Emergency Mode',
                        weight: AppFontWeight.bold,
                        color: AppColors.maroon,
                        fontSize: 16,
                      ),
                      SizedBox(height: 2),
                      AppText(
                        'Tap if you no longer need help',
                        color: Color(0xFF991B1B),
                        fontSize: 12,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (_confirm)
            _StopModal(
              onKeep: () => setState(() => _confirm = false),
              onStop: () {
                setState(() => _confirm = false);
                _endEmergency(context);
              },
            ),
        ],
      ),
    );
  }
}

class _StatusTile extends StatelessWidget {
  const _StatusTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: (MediaQuery.sizeOf(context).width - 50) / 2,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppText(label, color: Colors.white.withValues(alpha: 0.7), fontSize: 12),
            const SizedBox(height: 4),
            AppText(value, weight: AppFontWeight.semibold, color: Colors.white),
          ],
        ),
      ),
    );
  }
}

class _BigAction extends StatelessWidget {
  const _BigAction({
    required this.icon,
    required this.label,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: (MediaQuery.sizeOf(context).width - 50) / 2,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.28),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Column(
            children: [
              Icon(icon, size: 18, color: Colors.white),
              const SizedBox(height: 6),
              AppText(label, weight: AppFontWeight.bold, color: Colors.white, fontSize: 13),
            ],
          ),
        ),
      ),
    );
  }
}

class _StopModal extends StatelessWidget {
  const _StopModal({
    required this.onKeep,
    required this.onStop,
  });

  final VoidCallback onKeep;
  final VoidCallback onStop;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withValues(alpha: 0.5),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppText(
                  'Stop emergency mode?',
                  weight: AppFontWeight.bold,
                  fontSize: 18,
                  color: Color(0xFF0F1020),
                ),
                const SizedBox(height: 8),
                const AppText(
                  'Contacts will be told that you are safe. Only stop if you no longer need help.',
                  color: Color(0xFF6B6685),
                  height: 1.43,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: onKeep,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEEDF7),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          alignment: Alignment.center,
                          child: const AppText(
                            'Keep SOS on',
                            weight: AppFontWeight.bold,
                            color: Color(0xFF0F1020),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: GestureDetector(
                        onTap: onStop,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F1020),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          alignment: Alignment.center,
                          child: const AppText(
                            'Stop SOS',
                            weight: AppFontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
