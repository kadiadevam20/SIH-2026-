import 'package:flutter/material.dart';

class LivingPulse extends StatelessWidget {
  const LivingPulse({
    super.key,
    required this.color,
    this.size = 14,
  });

  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    final core = size * 0.55;
    return SizedBox(
      width: size * 2.6,
      height: size * 2.6,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: size * 1.55,
            height: size * 1.55,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.22),
              shape: BoxShape.circle,
            ),
          ),
          Container(
            width: core,
            height: core,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
        ],
      ),
    );
  }
}
