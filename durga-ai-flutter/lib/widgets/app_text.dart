import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum AppFontWeight {
  regular,
  medium,
  semibold,
  bold,
  extraBold,
  serif,
  serifMedium,
  serifBold,
  serifExtraBold,
}

class AppText extends StatelessWidget {
  const AppText(
    this.text, {
    super.key,
    this.weight = AppFontWeight.regular,
    this.style,
    this.color,
    this.fontSize,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.height,
  });

  final String text;
  final AppFontWeight weight;
  final TextStyle? style;
  final Color? color;
  final double? fontSize;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final double? letterSpacing;
  final double? height;

  TextStyle _base() {
    switch (weight) {
      case AppFontWeight.regular:
        return GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w400);
      case AppFontWeight.medium:
        return GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);
      case AppFontWeight.semibold:
        return GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600);
      case AppFontWeight.bold:
        return GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700);
      case AppFontWeight.extraBold:
        return GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800);
      case AppFontWeight.serif:
        return GoogleFonts.playfairDisplay(fontWeight: FontWeight.w400);
      case AppFontWeight.serifMedium:
        return GoogleFonts.playfairDisplay(fontWeight: FontWeight.w500);
      case AppFontWeight.serifBold:
        return GoogleFonts.playfairDisplay(fontWeight: FontWeight.w700);
      case AppFontWeight.serifExtraBold:
        return GoogleFonts.playfairDisplay(fontWeight: FontWeight.w800);
    }
  }

  @override
  Widget build(BuildContext context) {
    final base = _base();
    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: base.merge(style).copyWith(
            color: color ?? style?.color,
            fontSize: fontSize ?? style?.fontSize,
            letterSpacing: letterSpacing ?? style?.letterSpacing,
            height: height ?? style?.height,
          ),
    );
  }
}
