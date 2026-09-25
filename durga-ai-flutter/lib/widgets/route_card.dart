import 'package:flutter/material.dart';

import '../data/models.dart';
import '../theme/app_colors.dart';
import 'app_text.dart';
import 'risk_indicator.dart';

class RouteCard extends StatelessWidget {
  const RouteCard({
    super.key,
    required this.title,
    required this.minutes,
    required this.risk,
    this.detail,
    this.recommended = false,
    this.selected = false,
    required this.onTap,
  });

  final String title;
  final int minutes;
  final RiskLevel risk;
  final String? detail;
  final bool recommended;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final borderColor = selected
        ? AppColors.maroon
        : recommended
            ? AppColors.maroon.withValues(alpha: 0.35)
            : AppColors.line;
    final backgroundColor = selected
        ? const Color(0xFFF3E4E0)
        : recommended
            ? const Color(0xFFF8F4EE)
            : Colors.white;

    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: 148),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: borderColor, width: selected ? 2 : 1),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (recommended)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.maroon,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: const AppText(
                    'Recommended',
                    weight: AppFontWeight.bold,
                    fontSize: 10,
                    color: Colors.white,
                    letterSpacing: 0.2,
                  ),
                )
              else
                const SizedBox(height: 22),
              const SizedBox(height: 8),
              AppText(title, weight: AppFontWeight.semibold, fontSize: 14, color: AppColors.ink),
              const SizedBox(height: 6),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: '$minutes',
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: AppColors.ink,
                        height: 1.1,
                      ),
                    ),
                    const TextSpan(
                      text: ' min',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.muted,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              RiskIndicator(level: risk, small: true),
              if (detail != null && detail!.isNotEmpty) ...[
                const SizedBox(height: 6),
                AppText(
                  detail!,
                  fontSize: 11,
                  color: AppColors.muted,
                  maxLines: 2,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
