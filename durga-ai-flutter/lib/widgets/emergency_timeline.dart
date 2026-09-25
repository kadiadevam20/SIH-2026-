import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../data/models.dart';
import 'app_text.dart';

class EmergencyTimeline extends StatelessWidget {
  const EmergencyTimeline({
    super.key,
    required this.items,
    this.textColor = Colors.white,
    this.textSecondary = const Color(0xB3FFFFFF),
    this.borderColor = const Color(0x33FFFFFF),
    this.safeColor = const Color(0xFF34D399),
    this.safeSoft = const Color(0x4010B981),
    this.moderateColor = const Color(0xFFFBBF24),
    this.moderateSoft = const Color(0x33FBBF24),
    this.surfaceMuted = const Color(0x14FFFFFF),
  });

  final List<EmergencyStep> items;
  final Color textColor;
  final Color textSecondary;
  final Color borderColor;
  final Color safeColor;
  final Color safeSoft;
  final Color moderateColor;
  final Color moderateSoft;
  final Color surfaceMuted;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < items.length; i++) _TimelineRow(
          item: items[i],
          showLine: i < items.length - 1,
          textColor: textColor,
          textSecondary: textSecondary,
          borderColor: borderColor,
          safeColor: safeColor,
          safeSoft: safeSoft,
          moderateColor: moderateColor,
          moderateSoft: moderateSoft,
          surfaceMuted: surfaceMuted,
        ),
      ],
    );
  }
}

class _TimelineRow extends StatelessWidget {
  const _TimelineRow({
    required this.item,
    required this.showLine,
    required this.textColor,
    required this.textSecondary,
    required this.borderColor,
    required this.safeColor,
    required this.safeSoft,
    required this.moderateColor,
    required this.moderateSoft,
    required this.surfaceMuted,
  });

  final EmergencyStep item;
  final bool showLine;
  final Color textColor;
  final Color textSecondary;
  final Color borderColor;
  final Color safeColor;
  final Color safeSoft;
  final Color moderateColor;
  final Color moderateSoft;
  final Color surfaceMuted;

  @override
  Widget build(BuildContext context) {
    final done = item.status == EmergencyStepStatus.done;
    final active = item.status == EmergencyStepStatus.active;
    final iconColor = done ? safeColor : active ? moderateColor : textSecondary;
    final bg = done ? safeSoft : active ? moderateSoft : surfaceMuted;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 28,
            child: Column(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
                  child: Icon(
                    done ? LucideIcons.check : LucideIcons.clock,
                    size: 14,
                    color: iconColor,
                  ),
                ),
                if (showLine)
                  Expanded(
                    child: Container(
                      width: 2,
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      color: borderColor,
                    ),
                  ),
              ],
            ),
          ),
        const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: AppText(
                item.label,
                weight: done || active ? AppFontWeight.semibold : AppFontWeight.regular,
                color: textColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
