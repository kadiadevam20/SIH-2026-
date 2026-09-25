import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../data/mock_data.dart';
import '../data/models.dart';
import '../theme/app_colors.dart';
import 'app_shadow.dart';
import 'app_text.dart';

class UnsafeZoneAlert extends StatelessWidget {
  const UnsafeZoneAlert({
    super.key,
    required this.zone,
    this.onPress,
    this.onAvoid,
    this.compact = false,
  });

  final SafetyZone zone;
  final VoidCallback? onPress;
  final VoidCallback? onAvoid;
  final bool compact;

  Color get _color => zone.level == RiskLevel.moderate ? AppColors.moderate : AppColors.high;

  Color get _bg => zone.level == RiskLevel.moderate ? AppColors.moderateSoft : AppColors.highSoft;

  IconData get _icon => zone.level == RiskLevel.high ? LucideIcons.shieldAlert : LucideIcons.alertTriangle;

  @override
  Widget build(BuildContext context) {
    if (compact) {
      return GestureDetector(
        onTap: onPress,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: _bg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: _color),
            boxShadow: softShadow(),
          ),
          child: Row(
            children: [
              Icon(_icon, size: 16, color: _color),
              const SizedBox(width: 8),
              Expanded(
                child: AppText(
                  '${zone.alert ?? riskLabel(zone.level)} · ${zone.label}',
                  weight: AppFontWeight.bold,
                  color: _color,
                  fontSize: 12,
                ),
              ),
              Icon(LucideIcons.chevronRight, size: 16, color: _color),
            ],
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _color),
        boxShadow: softShadow(),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: _color.withValues(alpha: 0.13),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(_icon, size: 18, color: _color),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppText(zone.alert ?? riskLabel(zone.level), weight: AppFontWeight.bold, color: _color, fontSize: 13),
                    AppText(zone.label, weight: AppFontWeight.semibold, color: AppColors.ink),
                  ],
                ),
              ),
            ],
          ),
          if (zone.reason != null)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: AppText(zone.reason!, color: AppColors.muted, fontSize: 13, height: 1.46),
            ),
          if (onAvoid != null || onPress != null)
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Row(
                children: [
                  if (onAvoid != null)
                    Expanded(
                      child: GestureDetector(
                        onTap: onAvoid,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 11),
                          decoration: BoxDecoration(
                            color: AppColors.maroon,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          alignment: Alignment.center,
                          child: AppText('Avoid this area', weight: AppFontWeight.bold, color: Colors.white, fontSize: 13),
                        ),
                      ),
                    ),
                  if (onAvoid != null && onPress != null) const SizedBox(width: 8),
                  if (onPress != null)
                    Expanded(
                      child: GestureDetector(
                        onTap: onPress,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 11),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppColors.line),
                          ),
                          alignment: Alignment.center,
                          child: AppText('View on map', weight: AppFontWeight.bold, color: AppColors.ink, fontSize: 13),
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
