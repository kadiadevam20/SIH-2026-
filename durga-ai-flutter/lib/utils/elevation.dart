import 'package:flutter/material.dart';

List<BoxShadow> softShadow() => [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.06),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ];

List<BoxShadow> cardShadow({bool strong = false}) => [
      BoxShadow(
        color: Colors.black.withValues(alpha: strong ? 0.12 : 0.08),
        blurRadius: strong ? 20 : 16,
        offset: Offset(0, strong ? 8 : 6),
      ),
    ];
