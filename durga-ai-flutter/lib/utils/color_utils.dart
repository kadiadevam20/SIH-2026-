import 'package:flutter/material.dart';

Color parseHexColor(String hex, {Color fallback = const Color(0xFF7A1D1D)}) {
  try {
    final value = hex.replaceFirst('#', '');
    return Color(int.parse('FF$value', radix: 16));
  } catch (_) {
    return fallback;
  }
}
