import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../theme/app_colors.dart';
import '../../widgets/app_text.dart';

class _RiskZone {
  const _RiskZone({
    required this.color,
    required this.title,
    required this.points,
  });

  final Color color;
  final String title;
  final List<String> points;
}

const _zones = <_RiskZone>[
  _RiskZone(
    color: Color(0xFFDC2626),
    title: 'Red Zone – High Risk Area',
    points: [
      'App automatically starts audio recording',
      'Sends live location to emergency contacts',
      'Alerts the user and activates SOS',
    ],
  ),
  _RiskZone(
    color: Color(0xFFF59E0B),
    title: 'Orange Zone – Moderate Risk Area',
    points: [
      'Moderately risky locations — stay alert',
      'App may provide caution notifications',
    ],
  ),
  _RiskZone(
    color: Color(0xFF22C55E),
    title: 'Green Zone – Safe Area',
    points: [
      'Low or no safety risk',
      'Considered safer for travel',
    ],
  ),
];

/// Instructions — red/orange/green zone risk guide.
class TutorialsScreen extends StatelessWidget {
  const TutorialsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.only(top: MediaQuery.paddingOf(context).top),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.maroon, width: 2)),
              ),
              child: Row(
                children: [
                  SizedBox(
                    width: 36,
                    child: IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(LucideIcons.arrowLeft, size: 22, color: AppColors.maroon),
                    ),
                  ),
                  const Expanded(
                    child: AppText(
                      'Instructions',
                      weight: AppFontWeight.serifBold,
                      color: AppColors.maroon,
                      fontSize: 26,
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(width: 36),
                ],
              ),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(20, 20, 20, bottom + 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const AppText(
                    'Smart Risk Zone Map',
                    weight: AppFontWeight.bold,
                    color: AppColors.ink,
                    fontSize: 17,
                  ),
                  const SizedBox(height: 8),
                  const AppText(
                    'The DURGA app contains an interactive safety map that divides locations into three risk zones:',
                    color: AppColors.ink,
                    fontSize: 14,
                    height: 1.5,
                  ),
                  const SizedBox(height: 16),
                  for (final zone in _zones) ...[
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 14,
                          height: 14,
                          margin: const EdgeInsets.only(top: 3),
                          decoration: BoxDecoration(color: zone.color, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              AppText(zone.title, weight: AppFontWeight.bold, color: AppColors.ink, fontSize: 15),
                              const SizedBox(height: 8),
                              for (final point in zone.points)
                                Padding(
                                  padding: const EdgeInsets.only(left: 14, bottom: 2),
                                  child: AppText('• $point', color: AppColors.ink, fontSize: 14, height: 1.57),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                  ],
                  const AppText(
                    '3. Smart Route Suggestion',
                    weight: AppFontWeight.bold,
                    color: AppColors.ink,
                    fontSize: 17,
                  ),
                  const SizedBox(height: 8),
                  const AppText(
                    "If a user's path passes through a Red Zone, the app suggests an alternate safer route and can open navigation on the Map tab.",
                    color: AppColors.ink,
                    fontSize: 14,
                    height: 1.5,
                  ),
                  const SizedBox(height: 12),
                  GestureDetector(
                    onTap: () => context.go('/map'),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: AppColors.maroon,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      alignment: Alignment.center,
                      child: const AppText(
                        'Open safety map',
                        weight: AppFontWeight.bold,
                        color: Colors.white,
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
