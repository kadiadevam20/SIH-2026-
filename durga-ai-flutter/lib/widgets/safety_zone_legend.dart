import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import 'app_text.dart';

class SafetyZoneLegend extends StatelessWidget {
  const SafetyZoneLegend({super.key});

  @override
  Widget build(BuildContext context) {
    const items = [
      (AppColors.safe, 'Safe Area'),
      (AppColors.moderate, 'Moderate Risk'),
      (AppColors.high, 'High Risk'),
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.line),
      ),
      child: Row(
        children: [
          for (final item in items) ...[
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(color: item.$1, shape: BoxShape.circle),
                ),
                const SizedBox(width: 6),
                AppText(item.$2, weight: AppFontWeight.medium, fontSize: 11, color: AppColors.ink),
              ],
            ),
            if (item != items.last) const SizedBox(width: 14),
          ],
        ],
      ),
    );
  }
}
