import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../data/models.dart';
import '../theme/app_colors.dart';
import 'app_text.dart';

class AIMessageBubble extends StatelessWidget {
  const AIMessageBubble({
    super.key,
    required this.message,
    this.onAction,
  });

  final ChatMessage message;
  final ValueChanged<String>? onAction;

  @override
  Widget build(BuildContext context) {
    final mine = message.role == ChatRole.user;

    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: mine ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!mine)
            Container(
              width: 28,
              height: 28,
              margin: const EdgeInsets.only(top: 18, right: 8),
              decoration: BoxDecoration(
                color: AppColors.maroon,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(LucideIcons.shield, size: 13, color: Colors.white),
            ),
          Flexible(
            flex: mine ? 0 : 1,
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * (mine ? 0.78 : 0.84)),
              child: Column(
                crossAxisAlignment: mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                children: [
                  if (!mine)
                    const Padding(
                      padding: EdgeInsets.only(left: 2, bottom: 6),
                      child: AppText(
                        'DURGA',
                        weight: AppFontWeight.bold,
                        fontSize: 11,
                        color: AppColors.maroon,
                        letterSpacing: 0.5,
                      ),
                    ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: mine ? AppColors.maroon : Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(18),
                        topRight: const Radius.circular(18),
                        bottomLeft: Radius.circular(mine ? 18 : 6),
                        bottomRight: Radius.circular(mine ? 6 : 18),
                      ),
                      border: mine ? null : Border.all(color: AppColors.line),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        AppText(
                          message.text,
                          fontSize: 15,
                          height: 22 / 15,
                          color: mine ? Colors.white : AppColors.ink,
                        ),
                        const SizedBox(height: 8),
                        Align(
                          alignment: Alignment.centerRight,
                          child: AppText(
                            message.time,
                            fontSize: 11,
                            color: mine ? Colors.white.withValues(alpha: 0.7) : AppColors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (!mine && message.actions != null && message.actions!.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: message.actions!.map((action) {
                        final danger = action.variant == ChatActionVariant.emergency;
                        return SizedBox(
                          width: (MediaQuery.sizeOf(context).width * 0.84 - 8) / 2,
                          child: GestureDetector(
                            onTap: () => onAction?.call(action.id),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                              decoration: BoxDecoration(
                                color: danger ? AppColors.highSoft : AppColors.primarySoft,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: danger ? AppColors.high : AppColors.maroon),
                              ),
                              alignment: Alignment.center,
                              child: AppText(
                                action.label,
                                weight: AppFontWeight.bold,
                                fontSize: 12,
                                color: danger ? AppColors.high : AppColors.maroon,
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class TypingBubble extends StatelessWidget {
  const TypingBubble({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            margin: const EdgeInsets.only(top: 18, right: 8),
            decoration: BoxDecoration(
              color: AppColors.maroon,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(LucideIcons.shield, size: 13, color: Colors.white),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 2, bottom: 6),
                child: AppText(
                  'DURGA',
                  weight: AppFontWeight.bold,
                  fontSize: 11,
                  color: AppColors.maroon,
                  letterSpacing: 0.5,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.line),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        _dot(1),
                        const SizedBox(width: 4),
                        _dot(0.7),
                        const SizedBox(width: 4),
                        _dot(0.45),
                      ],
                    ),
                    const SizedBox(width: 8),
                    const AppText('thinking…', fontSize: 12, color: AppColors.muted),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _dot(double opacity) => Container(
        width: 6,
        height: 6,
        decoration: BoxDecoration(
          color: AppColors.muted.withValues(alpha: opacity),
          shape: BoxShape.circle,
        ),
      );
}
