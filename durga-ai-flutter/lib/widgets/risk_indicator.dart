import 'package:flutter/material.dart';

import '../data/mock_data.dart';
import '../data/models.dart';
import '../theme/app_colors.dart';
import 'app_text.dart';

class RiskIndicator extends StatelessWidget {
  const RiskIndicator({
    super.key,
    required this.level,
    this.small = false,
  });

  final RiskLevel level;
  final bool small;

  @override
  Widget build(BuildContext context) {
    final color = switch (level) {
      RiskLevel.safe => AppColors.safe,
      RiskLevel.moderate => AppColors.moderate,
      RiskLevel.high => AppColors.high,
    };
    final bg = switch (level) {
      RiskLevel.safe => AppColors.safeSoft,
      RiskLevel.moderate => AppColors.moderateSoft,
      RiskLevel.high => AppColors.highSoft,
    };

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 8 : 12,
        vertical: small ? 4 : 6,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          SizedBox(width: small ? 6 : 8),
          AppText(
            riskLabel(level),
            weight: AppFontWeight.bold,
            fontSize: small ? 10 : 12,
            color: color,
            letterSpacing: small ? 0.4 : 0.6,
          ),
        ],
      ),
    );
  }
}
