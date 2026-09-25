import 'package:durga_ai/theme/app_colors.dart';
import 'package:durga_ai/widgets/app_text.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

/// Brand splash — logo + name while app finishes loading.
class BrandSplash extends StatefulWidget {
  const BrandSplash({super.key});

  @override
  State<BrandSplash> createState() => _BrandSplashState();
}

class _BrandSplashState extends State<BrandSplash> with SingleTickerProviderStateMixin {
  late final AnimationController _fade;
  late final Animation<double> _logoOpacity;
  late final Animation<double> _logoScale;
  late final Animation<double> _textOpacity;

  @override
  void initState() {
    super.initState();
    _fade = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    final curve = CurvedAnimation(parent: _fade, curve: Curves.easeOutCubic);
    _logoOpacity = curve;
    _logoScale = Tween<double>(begin: 0.94, end: 1).animate(curve);
    _textOpacity = curve;
    _fade.forward();
  }

  @override
  void dispose() {
    _fade.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.cream,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                FadeTransition(
                  opacity: _logoOpacity,
                  child: ScaleTransition(
                    scale: _logoScale,
                    child: Container(
                      width: 112,
                      height: 112,
                      margin: const EdgeInsets.only(bottom: 28),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(color: AppColors.primarySoft, width: 3),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Image.asset(
                        'assets/images/icon.png',
                        width: 96,
                        height: 96,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          LucideIcons.shield,
                          size: 48,
                          color: AppColors.maroon,
                        ),
                      ),
                    ),
                  ),
                ),
                FadeTransition(
                  opacity: _textOpacity,
                  child: const Column(
                    children: [
                      AppText(
                        'दुर्गा',
                        weight: AppFontWeight.serifExtraBold,
                        color: AppColors.maroon,
                        fontSize: 44,
                        letterSpacing: 1,
                      ),
                      SizedBox(height: 6),
                      AppText(
                        'DURGA AI',
                        weight: AppFontWeight.extraBold,
                        color: AppColors.ink,
                        fontSize: 20,
                        letterSpacing: 2,
                      ),
                      SizedBox(height: 6),
                      AppText(
                        '~ She is Enough',
                        weight: AppFontWeight.serif,
                        color: AppColors.maroon,
                        fontSize: 16,
                        style: TextStyle(fontStyle: FontStyle.italic),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Positioned(
            left: 0,
            right: 0,
            bottom: 56,
            child: AppText(
              'Preparing your safety space…',
              weight: AppFontWeight.medium,
              color: AppColors.muted,
              fontSize: 12,
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
