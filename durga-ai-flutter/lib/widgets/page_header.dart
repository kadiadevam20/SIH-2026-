import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../theme/app_colors.dart';
import 'app_text.dart';
import 'living_pulse.dart';

class PageHeader extends StatelessWidget {
  const PageHeader({
    super.key,
    this.icon,
    required this.title,
    this.subtitle,
    this.status,
    this.statusColor,
    this.onBack,
    this.right,
  });

  final IconData? icon;
  final String title;
  final String? subtitle;
  final String? status;
  final Color? statusColor;
  final VoidCallback? onBack;
  final Widget? right;

  @override
  Widget build(BuildContext context) {
    final tone = statusColor ?? AppColors.safe;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (onBack != null)
            GestureDetector(
              onTap: onBack,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(LucideIcons.chevronLeft, size: 20, color: AppColors.ink),
                    const SizedBox(width: 2),
                    const AppText('Back', weight: AppFontWeight.semibold, fontSize: 14, color: AppColors.ink),
                  ],
                ),
              ),
            ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon != null)
                Container(
                  width: 40,
                  height: 40,
                  margin: const EdgeInsets.only(top: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primarySoft,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, size: 18, color: AppColors.maroon),
                ),
              if (icon != null) const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (status != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 4),
                        child: Row(
                          children: [
                            LivingPulse(color: tone, size: 8),
                            const SizedBox(width: 6),
                            AppText(status!, weight: AppFontWeight.semibold, fontSize: 11, color: tone),
                          ],
                        ),
                      ),
                    AppText(
                      title,
                      weight: AppFontWeight.extraBold,
                      fontSize: 28,
                      color: AppColors.ink,
                      letterSpacing: -0.6,
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 6),
                      AppText(
                        subtitle!,
                        fontSize: 14,
                        height: 20 / 14,
                        color: AppColors.muted,
                      ),
                    ],
                  ],
                ),
              ),
              if (right != null) right!,
            ],
          ),
        ],
      ),
    );
  }
}

class SectionLabel extends StatelessWidget {
  const SectionLabel({
    super.key,
    required this.title,
    this.subtitle,
  });

  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppText(title, weight: AppFontWeight.bold, fontSize: 16, color: AppColors.ink),
          if (subtitle != null) ...[
            const SizedBox(height: 3),
            AppText(subtitle!, fontSize: 13, color: AppColors.muted),
          ],
        ],
      ),
    );
  }
}
