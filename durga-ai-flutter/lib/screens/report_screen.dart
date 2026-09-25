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

/// Report unsafe area — reason picker, optional note, submit.
class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  String _reason = 'lighting';
  String _note = '';
  bool _sent = false;

  @override
  Widget build(BuildContext context) {
    return DurgaScreen(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(
            child: PageHeader(
              icon: LucideIcons.flag,
              status: 'Helps everyone',
              title: 'Report Unsafe Area',
              subtitle: 'Your report helps keep routes safer. Location is attached to this pin.',
              onBack: () => context.pop(),
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 80),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SectionLabel(title: 'What did you notice?'),
                for (final item in reportReasons)
                  GestureDetector(
                    onTap: () => setState(() => _reason = item.id),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: _reason == item.id ? AppColors.primarySoft : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: _reason == item.id ? AppColors.maroon : AppColors.line,
                        ),
                        boxShadow: softShadow(),
                      ),
                      child: AppText(
                        item.label,
                        weight: AppFontWeight.medium,
                        color: _reason == item.id ? AppColors.maroon : AppColors.ink,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 140),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SectionLabel(title: 'Optional details'),
                Container(
                  margin: const EdgeInsets.only(bottom: 18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.line),
                    boxShadow: softShadow(),
                  ),
                  child: TextField(
                    onChanged: (value) => setState(() => _note = value),
                    maxLines: 4,
                    minLines: 4,
                    style: const TextStyle(color: AppColors.ink, fontSize: 16),
                    decoration: const InputDecoration(
                      hintText: 'Add anything that helps others stay safe',
                      hintStyle: TextStyle(color: AppColors.muted),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.all(14),
                    ),
                  ),
                ),
              ],
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 180),
            child: Column(
              children: [
                if (_sent)
                  const Padding(
                    padding: EdgeInsets.only(bottom: 12),
                    child: AppText(
                      'Report submitted. Thank you for helping others stay safe.',
                      weight: AppFontWeight.semibold,
                      color: AppColors.safe,
                      textAlign: TextAlign.center,
                    ),
                  ),
                GestureDetector(
                  onTap: () {
                    setState(() => _sent = true);
                    Future<void>.delayed(const Duration(milliseconds: 700), () {
                      if (mounted) context.pop();
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      color: AppColors.maroon,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: softShadow(),
                    ),
                    alignment: Alignment.center,
                    child: const AppText(
                      'Submit report',
                      weight: AppFontWeight.bold,
                      color: Colors.white,
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
