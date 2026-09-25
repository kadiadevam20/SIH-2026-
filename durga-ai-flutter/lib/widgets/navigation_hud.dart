import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../theme/app_colors.dart';
import '../utils/elevation.dart';
import 'app_text.dart';

class NavigationTurnHud extends StatelessWidget {
  const NavigationTurnHud({
    super.key,
    required this.instruction,
    this.detail,
    required this.minutes,
    required this.eta,
  });

  final String instruction;
  final String? detail;
  final int minutes;
  final String eta;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.line),
        boxShadow: cardShadow(strong: true),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primarySoft,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(LucideIcons.cornerUpLeft, size: 22, color: AppColors.maroon),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppText(
                  'NEXT TURN',
                  weight: AppFontWeight.semibold,
                  fontSize: 11,
                  color: AppColors.maroon,
                  letterSpacing: 0.6,
                ),
                const SizedBox(height: 2),
                AppText(
                  instruction,
                  weight: AppFontWeight.bold,
                  fontSize: 17,
                  height: 22 / 17,
                  color: AppColors.ink,
                ),
                if (detail != null) ...[
                  const SizedBox(height: 3),
                  AppText(detail!, fontSize: 12, color: AppColors.muted),
                ],
              ],
            ),
          ),
          Column(
            children: [
              AppText('$minutes', weight: AppFontWeight.extraBold, fontSize: 22, color: AppColors.ink),
              const AppText('min', weight: AppFontWeight.semibold, fontSize: 11, color: AppColors.muted),
              const SizedBox(height: 2),
              AppText(eta, fontSize: 10, color: AppColors.muted),
            ],
          ),
        ],
      ),
    );
  }
}

class NavigationBottomBar extends StatelessWidget {
  const NavigationBottomBar({
    super.key,
    required this.destination,
    required this.safetyScore,
    required this.routeRisk,
    required this.riskColor,
    required this.onEnd,
    required this.onReport,
  });

  final String? destination;
  final int safetyScore;
  final String routeRisk;
  final Color riskColor;
  final VoidCallback onEnd;
  final VoidCallback onReport;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.line),
        boxShadow: cardShadow(strong: true),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(LucideIcons.flag, size: 14, color: AppColors.maroon),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const AppText('Heading to', fontSize: 11, color: AppColors.muted),
                    AppText(
                      destination ?? 'Destination',
                      weight: AppFontWeight.semibold,
                      fontSize: 14,
                      color: AppColors.ink,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                decoration: BoxDecoration(
                  color: riskColor.withValues(alpha: 0.09),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(LucideIcons.shield, size: 12, color: riskColor),
                    const SizedBox(width: 4),
                    AppText(routeRisk, weight: AppFontWeight.bold, fontSize: 11, color: riskColor),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.creamDeep,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(LucideIcons.mapPin, size: 13, color: AppColors.muted),
                      const SizedBox(width: 5),
                      AppText(
                        'Safety $safetyScore',
                        weight: AppFontWeight.semibold,
                        fontSize: 12,
                        color: AppColors.ink,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: GestureDetector(
                  onTap: onReport,
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: AppColors.moderateSoft,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.moderate),
                      boxShadow: softShadow(),
                    ),
                    alignment: Alignment.center,
                    child: const AppText(
                      'Report area',
                      weight: AppFontWeight.bold,
                      fontSize: 12,
                      color: AppColors.moderate,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: onEnd,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.maroon,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(LucideIcons.square, size: 12, color: Colors.white),
                      SizedBox(width: 5),
                      AppText('End', weight: AppFontWeight.bold, fontSize: 12, color: Colors.white),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
