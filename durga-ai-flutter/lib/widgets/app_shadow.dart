import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

List<BoxShadow> softShadow() => [
      BoxShadow(
        color: AppColors.maroon.withValues(alpha: 0.08),
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ];
