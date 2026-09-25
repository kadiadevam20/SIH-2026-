import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

class AppTheme {
  static ThemeData get light => ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: AppColors.cream,
        colorScheme: const ColorScheme.light(
          primary: AppColors.maroon,
          secondary: AppColors.maroonSoft,
          surface: Colors.white,
          onPrimary: Colors.white,
          onSurface: AppColors.ink,
        ),
        textTheme: TextTheme(
          bodyMedium: GoogleFonts.plusJakartaSans(color: AppColors.ink),
          titleLarge: GoogleFonts.playfairDisplay(color: AppColors.ink),
        ),
      );
}
