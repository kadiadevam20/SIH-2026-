import 'dart:async';

import 'package:durga_ai/providers/app_state.dart';
import 'package:durga_ai/theme/app_colors.dart';
import 'package:durga_ai/widgets/app_text.dart';
import 'package:durga_ai/widgets/layout_metrics.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

const int _holdMs = 1200;

/// Hold-to-activate emergency strip — short taps do nothing.
class SOSBar extends StatefulWidget {
  const SOSBar({super.key});

  @override
  State<SOSBar> createState() => _SOSBarState();
}

class _SOSBarState extends State<SOSBar> with SingleTickerProviderStateMixin {
  bool _holding = false;
  bool _activated = false;
  Timer? _timer;
  late final AnimationController _fill;

  @override
  void initState() {
    super.initState();
    _fill = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: _holdMs),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _fill.dispose();
    super.dispose();
  }

  void _cancelHold() {
    _timer?.cancel();
    _fill.stop();
    _fill.value = 0;
    if (_holding) {
      setState(() => _holding = false);
    }
  }

  void _startHold() {
    _cancelHold();
    setState(() => _holding = true);
    _fill.forward(from: 0);
    _timer = Timer(const Duration(milliseconds: _holdMs), () {
      if (!mounted) return;
      _activated = true;
      _cancelHold();
      context.read<AppState>().startEmergency();
      context.push('/emergency');
    });
  }

  void _onShortPress() {
    if (_activated) {
      _activated = false;
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Hold to activate SOS — press and hold the bar for about 1 second.'),
        duration: Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final borderColor = _holding ? AppColors.maroon : AppColors.sosBorder;

    return Semantics(
      button: true,
      label: 'Emergency SOS. Hold to activate.',
      child: GestureDetector(
        onTapDown: (_) => _startHold(),
        onTapUp: (_) => _cancelHold(),
        onTapCancel: _cancelHold,
        onTap: _onShortPress,
        child: LayoutBuilder(
          builder: (context, constraints) {
            return AnimatedBuilder(
              animation: _fill,
              builder: (context, child) {
                return Container(
                  height: sosBarHeight,
                  decoration: BoxDecoration(
                    color: AppColors.highSoft,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor, width: 1.5),
                  ),
                  clipBehavior: Clip.hardEdge,
                  child: Stack(
                    alignment: Alignment.centerLeft,
                    children: [
                      Positioned(
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: constraints.maxWidth * _fill.value.clamp(0, 1),
                        child: ColoredBox(
                          color: AppColors.maroon.withValues(alpha: 0.2),
                        ),
                      ),
                      child!,
                    ],
                  ),
                );
              },
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  children: [
                    Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        color: AppColors.maroon,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        LucideIcons.shieldAlert,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const AppText(
                            'Emergency SOS',
                            weight: AppFontWeight.bold,
                            color: AppColors.maroon,
                            fontSize: 13,
                          ),
                          AppText(
                            _holding ? 'Keep holding…' : 'Hold 1s to activate',
                            color: AppColors.muted,
                            fontSize: 11,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppColors.maroon,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: const AppText(
                        'HOLD',
                        weight: AppFontWeight.bold,
                        color: Colors.white,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
