import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../utils/color_utils.dart';
import '../../widgets/layout_metrics.dart';
import '../../widgets/app_text.dart';
import '../../widgets/quote_backdrop.dart';

const _quotes = [
  'A girl with a voice can change the world.',
  'She is not just a girl — she is strength, courage, and fire.',
  'Girls are not meant to be quiet. They are meant to lead.',
  'Every girl deserves to walk free, speak loud, and dream big.',
  'Her power is not borrowed — it was always hers.',
  'Raise her, don\'t restrict her. She will rise anyway.',
  'A brave girl is a light for every girl who comes after her.',
  'She doesn\'t wait for permission. She creates her own path.',
  'Strong girls build safer worlds.',
  'Be the girl who never dims her light for anyone.',
];

const _safetyTips = [
  'Share your live route when traveling alone at night.',
  'Keep your trusted circle updated — even one guardian helps.',
  'If something feels wrong, trust it. DURGA is one hold away.',
  'Safe spots on the map are marked for you — learn a few nearby.',
  'Test your SOS once, so muscle memory is ready when it matters.',
];

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, this.isActive = true});

  final bool isActive;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _quoteIndex = 0;
  int _tipIndex = 0;
  Timer? _quoteTimer;
  Timer? _tipTimer;

  @override
  void initState() {
    super.initState();
    _startTimers();
  }

  @override
  void didUpdateWidget(covariant HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isActive != widget.isActive) {
      if (widget.isActive) {
        _startTimers();
      } else {
        _stopTimers();
      }
    }
  }

  void _startTimers() {
    if (!widget.isActive) return;
    _stopTimers();
    _quoteTimer = Timer.periodic(const Duration(seconds: 9), (_) {
      if (!mounted) return;
      setState(() => _quoteIndex = (_quoteIndex + 1) % _quotes.length);
    });
    _tipTimer = Timer.periodic(const Duration(seconds: 12), (_) {
      if (!mounted) return;
      setState(() => _tipIndex = (_tipIndex + 1) % _safetyTips.length);
    });
  }

  void _stopTimers() {
    _quoteTimer?.cancel();
    _tipTimer?.cancel();
    _quoteTimer = null;
    _tipTimer = null;
  }

  void _nextQuote() {
    setState(() => _quoteIndex = (_quoteIndex + 1) % _quotes.length);
  }

  @override
  void dispose() {
    _stopTimers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final insets = MediaQuery.paddingOf(context);
    final bottomPad = bottomChromeHeight(true, insets.bottom);
    final circle = app.contacts.take(4).toList();
    final extra = app.contacts.length > 4 ? app.contacts.length - 4 : 0;
    final greeting = app.userName != 'there' ? 'Hi, ${app.userName}' : 'Welcome';

    return ColoredBox(
      color: AppColors.cream,
      child: Column(
        children: [
          SizedBox(height: insets.top + 6),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Wrap(
                    crossAxisAlignment: WrapCrossAlignment.end,
                    spacing: 8,
                    runSpacing: 4,
                    children: [
                      const AppText(
                        'दुर्गा',
                        weight: AppFontWeight.serifExtraBold,
                        fontSize: 40,
                        color: AppColors.maroon,
                        letterSpacing: 0.5,
                      ),
                      AppText(
                        '~ She is Enough',
                        weight: AppFontWeight.serif,
                        fontSize: 17,
                        color: AppColors.maroon,
                        style: const TextStyle(fontStyle: FontStyle.italic, color: AppColors.maroon),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () => context.push('/settings'),
                  child: const Padding(
                    padding: EdgeInsets.only(top: 6, left: 8),
                    child: Icon(LucideIcons.menu, size: 26, color: AppColors.menuIcon),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.fromLTRB(16, 8, 16, bottomPad + 12),
              children: [
                AppText(greeting, weight: AppFontWeight.semibold, fontSize: 13, color: AppColors.muted),
                const SizedBox(height: 4),
                const AppText(
                  'Your safety space',
                  weight: AppFontWeight.serifBold,
                  fontSize: 22,
                  color: AppColors.ink,
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: _nextQuote,
                  child: Container(
                    height: 360,
                    clipBehavior: Clip.antiAlias,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: AppColors.maroon.withValues(alpha: 0.14)),
                    ),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        QuoteBackdrop(maroon: AppColors.maroon, active: widget.isActive),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 24),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              AppText(
                                '“',
                                weight: AppFontWeight.serif,
                                fontSize: 48,
                                height: 1,
                                color: AppColors.maroon.withValues(alpha: 0.3),
                              ),
                              Transform.translate(
                                offset: const Offset(0, -8),
                                child: AnimatedSwitcher(
                                  duration: const Duration(milliseconds: 420),
                                  switchInCurve: Curves.easeOut,
                                  switchOutCurve: Curves.easeIn,
                                  child: AppText(
                                    _quotes[_quoteIndex],
                                    key: ValueKey(_quoteIndex),
                                    weight: AppFontWeight.serifMedium,
                                    fontSize: 22,
                                    height: 32 / 22,
                                    textAlign: TextAlign.center,
                                    letterSpacing: 0.15,
                                    color: AppColors.ink,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: const BoxDecoration(
                          color: AppColors.maroon,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(LucideIcons.shield, size: 16, color: AppColors.warmWhite),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            AppText(
                              app.userName != 'there' ? '${app.userName}, you\'re covered' : 'You\'re covered',
                              weight: AppFontWeight.semibold,
                              fontSize: 14,
                              color: AppColors.ink,
                            ),
                            const SizedBox(height: 2),
                            const AppText(
                              'DURGA is watching with you',
                              weight: AppFontWeight.medium,
                              fontSize: 12,
                              color: AppColors.muted,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: () => context.go('/contacts'),
                  child: _card(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(LucideIcons.users, size: 16, color: AppColors.maroon),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: AppText(
                                'Your safety circle',
                                weight: AppFontWeight.bold,
                                fontSize: 14,
                                color: AppColors.ink,
                              ),
                            ),
                            AppText(
                              '${app.contacts.length} ready',
                              weight: AppFontWeight.medium,
                              fontSize: 12,
                              color: AppColors.muted,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 34,
                          child: circle.isEmpty
                              ? const AppText(
                                  'Add trusted contacts so help reaches faster',
                                  weight: AppFontWeight.medium,
                                  fontSize: 13,
                                  color: AppColors.muted,
                                )
                              : SizedBox(
                                  width: 34 + (circle.length + (extra > 0 ? 1 : 0) - 1) * 24.0,
                                  child: Stack(
                                    clipBehavior: Clip.none,
                                    children: [
                                      for (var i = 0; i < circle.length; i++)
                                        Positioned(
                                          left: i * 24.0,
                                          child: _avatar(circle[i].initials, parseHexColor(circle[i].color)),
                                        ),
                                      if (extra > 0)
                                        Positioned(
                                          left: circle.length * 24.0,
                                          child: Container(
                                            width: 34,
                                            height: 34,
                                            alignment: Alignment.center,
                                            decoration: BoxDecoration(
                                              color: AppColors.primarySoft,
                                              shape: BoxShape.circle,
                                              border: Border.all(color: AppColors.cream, width: 2),
                                            ),
                                            child: AppText(
                                              '+$extra',
                                              weight: AppFontWeight.bold,
                                              fontSize: 11,
                                              color: AppColors.maroon,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const AppText('Quick tools', weight: AppFontWeight.bold, fontSize: 15, color: AppColors.ink),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _tool('Safety map', LucideIcons.mapPin, () => context.go('/map')),
                    const SizedBox(width: 10),
                    _tool('Instructions', LucideIcons.bookOpen, () => context.push('/settings/tutorials')),
                    const SizedBox(width: 10),
                    _tool('Nearby help', LucideIcons.navigation, () => context.push('/nearby-help')),
                  ],
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: () => app.setLocationSharing(!app.locationSharing),
                  child: _card(
                    backgroundColor: app.locationSharing ? AppColors.primarySoft : Colors.white,
                    borderColor: app.locationSharing ? AppColors.maroon : AppColors.line,
                    child: Row(
                      children: [
                        const Icon(LucideIcons.navigation, size: 16, color: AppColors.maroon),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const AppText(
                                'Live location sharing',
                                weight: AppFontWeight.bold,
                                fontSize: 14,
                                color: AppColors.ink,
                              ),
                              const SizedBox(height: 2),
                              AppText(
                                app.locationSharing
                                    ? 'On — trusted contacts can follow you'
                                    : 'Off — tap to share with your circle',
                                weight: AppFontWeight.medium,
                                fontSize: 12,
                                color: AppColors.muted,
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: app.locationSharing ? AppColors.maroon : AppColors.creamDeep,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: AppText(
                            app.locationSharing ? 'ON' : 'OFF',
                            weight: AppFontWeight.bold,
                            fontSize: 11,
                            color: app.locationSharing ? AppColors.warmWhite : AppColors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: () => context.go('/hardware'),
                  child: _card(
                    child: Row(
                      children: [
                        const Icon(LucideIcons.watch, size: 16, color: AppColors.maroon),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              AppText(
                                app.device.name,
                                weight: AppFontWeight.bold,
                                fontSize: 14,
                                color: AppColors.ink,
                              ),
                              const SizedBox(height: 2),
                              AppText(
                                app.device.connected
                                    ? 'Connected · ${app.device.battery}% battery'
                                    : 'Not connected · tap to manage',
                                weight: AppFontWeight.medium,
                                fontSize: 12,
                                color: AppColors.muted,
                              ),
                            ],
                          ),
                        ),
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: app.device.connected ? AppColors.safe : AppColors.moderate,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.maroon.withValues(alpha: 0.12)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppText(
                        'SAFETY TIP',
                        weight: AppFontWeight.bold,
                        fontSize: 12,
                        color: AppColors.maroon,
                        letterSpacing: 0.4,
                      ),
                      const SizedBox(height: 6),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child: AppText(
                          _safetyTips[_tipIndex],
                          key: ValueKey(_tipIndex),
                          weight: AppFontWeight.medium,
                          fontSize: 14,
                          height: 21 / 14,
                          color: AppColors.ink,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                GestureDetector(
                  onTap: () => context.go('/durga'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: AppColors.maroon,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.messageCircle, size: 18, color: AppColors.warmWhite),
                        SizedBox(width: 8),
                        AppText(
                          'Talk to DURGA',
                          weight: AppFontWeight.bold,
                          fontSize: 15,
                          color: AppColors.warmWhite,
                        ),
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

  Widget _card({
    required Widget child,
    Color backgroundColor = Colors.white,
    Color borderColor = AppColors.line,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: borderColor),
      ),
      child: child,
    );
  }

  Widget _avatar(String initials, Color color) => Container(
        width: 34,
        height: 34,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.cream, width: 2),
        ),
        child: AppText(initials, weight: AppFontWeight.bold, fontSize: 10, color: AppColors.warmWhite),
      );

  Widget _tool(String label, IconData icon, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 6),
          decoration: BoxDecoration(
            color: AppColors.primarySoft,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.line),
          ),
          child: Column(
            children: [
              Icon(icon, size: 20, color: AppColors.maroon),
              const SizedBox(height: 8),
              AppText(
                label,
                weight: AppFontWeight.semibold,
                fontSize: 12,
                color: AppColors.maroon,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
