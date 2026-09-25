import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../data/mock_data.dart';
import '../data/models.dart';
import '../theme/app_colors.dart';
import 'app_text.dart';

class SafetyMap extends StatelessWidget {
  const SafetyMap({
    super.key,
    this.highlightedZoneId,
    this.selectedRoute,
    this.onZonePress,
  });

  final String? highlightedZoneId;
  final String? selectedRoute;
  final ValueChanged<SafetyZone>? onZonePress;

  Color _zoneColor(RiskLevel level) {
    switch (level) {
      case RiskLevel.safe:
        return AppColors.safe;
      case RiskLevel.moderate:
        return AppColors.moderate;
      case RiskLevel.high:
        return AppColors.high;
    }
  }

  Color _zoneFill(RiskLevel level) {
    switch (level) {
      case RiskLevel.safe:
        return AppColors.safe.withValues(alpha: 0.19);
      case RiskLevel.moderate:
        return AppColors.moderate.withValues(alpha: 0.28);
      case RiskLevel.high:
        return AppColors.high.withValues(alpha: 0.31);
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final h = constraints.maxHeight;

        return ClipRRect(
          borderRadius: BorderRadius.circular(22),
          child: Stack(
            fit: StackFit.expand,
            children: [
              const ColoredBox(color: Color(0xFFE8E4F8)),
              ..._roads(w, h),
              if (selectedRoute == 'safest' || selectedRoute == 'fastest')
                Positioned(
                  left: w * (selectedRoute == 'safest' ? 0.40 : 0.46),
                  top: h * (selectedRoute == 'safest' ? 0.28 : 0.48),
                  child: Transform.rotate(
                    angle: selectedRoute == 'safest' ? 0.31 : -0.21,
                    child: Container(
                      width: 8,
                      height: h * (selectedRoute == 'safest' ? 0.38 : 0.28),
                      decoration: BoxDecoration(
                        color: selectedRoute == 'safest' ? AppColors.safe : AppColors.moderate,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ...safetyZones.map((zone) => _zoneTile(zone, w, h)),
              Positioned(
                left: w * 0.46,
                top: h * 0.42,
                child: Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: AppColors.maroon,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                  ),
                  child: Center(
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: 12,
                bottom: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: AppColors.line),
                  ),
                  child: AppText(
                    'Ahmedabad safety map',
                    weight: AppFontWeight.semibold,
                    color: AppColors.muted,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  List<Widget> _roads(double w, double h) {
    Widget roadH(double top) => Positioned(
          left: 0,
          right: 0,
          top: h * top,
          child: Container(height: 10, color: Colors.white.withValues(alpha: 0.95)),
        );
    Widget roadV(double left) => Positioned(
          top: 0,
          bottom: 0,
          left: w * left,
          child: Container(width: 10, color: Colors.white.withValues(alpha: 0.95)),
        );

    return [
      roadH(0.34),
      roadH(0.58),
      roadH(0.76),
      roadV(0.28),
      roadV(0.52),
      roadV(0.72),
      Positioned(
        left: w * 0.18,
        top: h * 0.30,
        child: Transform.rotate(
          angle: 24 * math.pi / 180,
          child: Container(
            width: 8,
            height: h * 0.42,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.9),
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ),
      ),
    ];
  }

  Widget _zoneTile(SafetyZone zone, double w, double h) {
    final color = _zoneColor(zone.level);
    final isAlert = zone.level == RiskLevel.high || zone.level == RiskLevel.moderate;
    final highlighted = highlightedZoneId == zone.id;
    final icon = zone.level == RiskLevel.high ? LucideIcons.shieldAlert : LucideIcons.alertTriangle;

    return Positioned(
      left: w * zone.x / 100,
      top: h * zone.y / 100,
      width: w * zone.w / 100,
      height: h * zone.h / 100,
      child: GestureDetector(
        onTap: () => onZonePress?.call(zone),
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: _zoneFill(zone.level),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: color,
              width: zone.level == RiskLevel.high ? 2 : 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isAlert && highlighted)
                _Pulse(color: color),
              Row(
                children: [
                  if (isAlert) Icon(icon, size: 12, color: color),
                  if (isAlert) const SizedBox(width: 4),
                  Flexible(
                    child: AppText(zone.label, weight: AppFontWeight.bold, color: color, fontSize: 11),
                  ),
                ],
              ),
              if (isAlert)
                AppText(
                  zone.level == RiskLevel.high ? 'Not safe' : 'Use caution',
                  color: AppColors.muted,
                  fontSize: 9,
                ),
            ],
          ),
        ),
      ),
    );
  }
}


class _Pulse extends StatelessWidget {
  const _Pulse({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 28,
      height: 28,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
          ),
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
        ],
      ),
    );
  }
}
