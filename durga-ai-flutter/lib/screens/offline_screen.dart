import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../data/mock_data.dart';
import '../theme/app_colors.dart';
import '../widgets/app_shadow.dart';
import '../widgets/app_text.dart';
import '../widgets/durga_screen.dart';
import '../widgets/fade_in.dart';
import '../widgets/page_header.dart';

/// Offline safety mode — banner and capability list.
class OfflineScreen extends StatelessWidget {
  const OfflineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DurgaScreen(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(
            child: PageHeader(
              icon: LucideIcons.wifiOff,
              status: 'Still protected',
              statusColor: AppColors.safe,
              title: 'Offline Safety Mode',
              subtitle: "Don't worry. Important safety features are still available.",
              onBack: () => context.pop(),
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 80),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.maroon),
                boxShadow: softShadow(),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  AppText(
                    'Offline Safety Mode Active',
                    weight: AppFontWeight.bold,
                    color: AppColors.maroon,
                    fontSize: 15,
                  ),
                  SizedBox(height: 6),
                  AppText(
                    'DURGA keeps critical tools working without internet.',
                    color: AppColors.muted,
                    fontSize: 13,
                    height: 1.38,
                  ),
                ],
              ),
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 120),
            child: Column(
              children: [
                for (final item in offlineCapabilities) ...[
                  Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.line),
                      boxShadow: softShadow(),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const AppText('✓', weight: AppFontWeight.bold, color: AppColors.safe, fontSize: 16),
                        const SizedBox(width: 10),
                        Expanded(
                          child: AppText(item, color: AppColors.ink, height: 1.43),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
