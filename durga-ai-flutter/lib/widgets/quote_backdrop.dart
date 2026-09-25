import 'dart:math' as math;

import 'package:durga_ai/theme/app_colors.dart';
import 'package:durga_ai/widgets/app_text.dart';
import 'package:flutter/material.dart';

class QuoteBackdrop extends StatefulWidget {
  const QuoteBackdrop({
    super.key,
    this.maroon = AppColors.maroon,
    this.active = true,
  });

  final Color maroon;
  final bool active;

  @override
  State<QuoteBackdrop> createState() => _QuoteBackdropState();
}

class _QuoteBackdropState extends State<QuoteBackdrop> with TickerProviderStateMixin {
  late final AnimationController _glow;
  late final AnimationController _spin;
  late final AnimationController _blobA;
  late final AnimationController _blobB;

  @override
  void initState() {
    super.initState();
    _glow = AnimationController(vsync: this, duration: const Duration(milliseconds: 3200));
    _spin = AnimationController(vsync: this, duration: const Duration(seconds: 48));
    _blobA = AnimationController(vsync: this, duration: const Duration(seconds: 7));
    _blobB = AnimationController(vsync: this, duration: const Duration(seconds: 9));
    _syncActive();
  }

  @override
  void didUpdateWidget(covariant QuoteBackdrop oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.active != widget.active) _syncActive();
  }

  void _syncActive() {
    for (final entry in [
      (_glow, true),
      (_spin, false),
      (_blobA, true),
    ]) {
      final controller = entry.$1;
      final reverse = entry.$2;
      if (widget.active) {
        if (!controller.isAnimating) {
          controller.repeat(reverse: reverse);
        }
      } else {
        controller.stop();
      }
    }

    _blobB.stop();
    if (!widget.active) return;
    Future<void>.delayed(const Duration(milliseconds: 900), () {
      if (!mounted || !widget.active) return;
      if (!_blobB.isAnimating) _blobB.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _glow.dispose();
    _spin.dispose();
    _blobA.dispose();
    _blobB.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Stack(
        fit: StackFit.expand,
        children: [
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFFFBF6F0), Color(0xFFF0DDD6), Color(0xFFE5C8BE)],
              ),
            ),
          ),
          Positioned(
            top: -55,
            left: -45,
            child: AnimatedBuilder(
              animation: _blobA,
              builder: (context, child) {
                final t = _sinWave(_blobA.value);
                return Transform.translate(
                  offset: Offset(16 * t, 12 * t),
                  child: child,
                );
              },
              child: const _Blob(size: 180, color: Color(0x247A1D1D)),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -40,
            child: AnimatedBuilder(
              animation: _blobB,
              builder: (context, child) {
                final t = _sinWave(_blobB.value);
                return Transform.translate(
                  offset: Offset(-14 * t, -10 * t),
                  child: child,
                );
              },
              child: const _Blob(size: 160, color: Color(0x1CC9A227)),
            ),
          ),
          Positioned(
            top: MediaQuery.sizeOf(context).height * 0.4,
            right: MediaQuery.sizeOf(context).width * 0.2,
            child: const _Blob(size: 100, color: Color(0x14A13F3C)),
          ),
          for (final ribbon in _ribbons)
            _AnimatedRibbon(
              key: ValueKey(ribbon.top),
              topFactor: ribbon.top,
              delay: ribbon.delay,
              duration: ribbon.duration,
              color: ribbon.color,
              amplitude: ribbon.amplitude,
              active: widget.active,
            ),
          AnimatedBuilder(
            animation: _glow,
            builder: (context, child) {
              final t = _sinWave(_glow.value);
              return Opacity(
                opacity: 0.1 + t * 0.14,
                child: Transform.scale(
                  scale: 0.92 + t * 0.12,
                  child: child,
                ),
              );
            },
            child: Align(
              alignment: const Alignment(0, -0.1),
              child: Container(
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  color: widget.maroon,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
          AnimatedBuilder(
            animation: _spin,
            builder: (context, child) => Transform.rotate(
              angle: _spin.value * 2 * math.pi,
              child: child,
            ),
            child: CustomPaint(
              painter: _ConstellationPainter(widget.maroon),
              size: Size.infinite,
            ),
          ),
          for (final glyph in _glyphs)
            _AnimatedGlyph(
              key: ValueKey(glyph.char),
              char: glyph.char,
              topFactor: glyph.top,
              leftFactor: glyph.left,
              delay: glyph.delay,
              size: glyph.size,
              maroon: widget.maroon,
              active: widget.active,
            ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x40FBF6F0),
                  Color(0xB8FBF6F0),
                  Color(0x47FBF6F0),
                ],
                stops: [0, 0.5, 1],
              ),
            ),
          ),
        ],
      ),
    );
  }

  static double _sinWave(double value) =>
      (math.sin((value * 2 * math.pi) - math.pi / 2) + 1) / 2;
}

const _ribbons = [
  (top: 0.22, delay: Duration.zero, duration: Duration(milliseconds: 10000), color: Color(0x2E7A1D1D), amplitude: 14.0),
  (top: 0.48, delay: Duration(milliseconds: 700), duration: Duration(milliseconds: 13000), color: Color(0x29C9A227), amplitude: 18.0),
  (top: 0.70, delay: Duration(milliseconds: 1400), duration: Duration(milliseconds: 15000), color: Color(0x24A13F3C), amplitude: 10.0),
];

const _glyphs = [
  (char: 'श', top: 0.10, left: 0.08, delay: Duration.zero, size: 28.0),
  (char: 'क्', top: 0.16, left: 0.78, delay: Duration(milliseconds: 400), size: 22.0),
  (char: 'ति', top: 0.72, left: 0.12, delay: Duration(milliseconds: 900), size: 24.0),
  (char: 'दु', top: 0.68, left: 0.76, delay: Duration(milliseconds: 1200), size: 26.0),
];

class _Blob extends StatelessWidget {
  const _Blob({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
  }
}

class _AnimatedRibbon extends StatefulWidget {
  const _AnimatedRibbon({
    super.key,
    required this.topFactor,
    required this.delay,
    required this.duration,
    required this.color,
    required this.amplitude,
    required this.active,
  });

  final double topFactor;
  final Duration delay;
  final Duration duration;
  final Color color;
  final double amplitude;
  final bool active;

  @override
  State<_AnimatedRibbon> createState() => _AnimatedRibbonState();
}

class _AnimatedRibbonState extends State<_AnimatedRibbon> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _syncActive();
  }

  @override
  void didUpdateWidget(covariant _AnimatedRibbon oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.active != widget.active || oldWidget.duration != widget.duration) {
      _syncActive();
    }
  }

  void _syncActive() {
    _controller.stop();
    if (!widget.active) return;
    Future<void>.delayed(widget.delay, () {
      if (!mounted || !widget.active) return;
      _controller.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _QuoteBackdropState._sinWave(_controller.value);
        final opacity = 0.55 + (t * 0.35);
        final rotate = (-6 + (t * 12)) * math.pi / 180;
        return Positioned(
          top: size.height * widget.topFactor,
          left: -size.width * 0.1,
          right: -size.width * 0.1,
          child: Opacity(
            opacity: opacity,
            child: Transform.translate(
              offset: Offset(0, -widget.amplitude + (t * widget.amplitude * 2)),
              child: Transform.rotate(
                angle: rotate,
                child: child,
              ),
            ),
          ),
        );
      },
      child: Container(
        height: 28,
        decoration: BoxDecoration(
          color: widget.color,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }
}

class _AnimatedGlyph extends StatefulWidget {
  const _AnimatedGlyph({
    super.key,
    required this.char,
    required this.topFactor,
    required this.leftFactor,
    required this.delay,
    required this.size,
    required this.maroon,
    required this.active,
  });

  final String char;
  final double topFactor;
  final double leftFactor;
  final Duration delay;
  final double size;
  final Color maroon;
  final bool active;

  @override
  State<_AnimatedGlyph> createState() => _AnimatedGlyphState();
}

class _AnimatedGlyphState extends State<_AnimatedGlyph> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 5200),
    );
    _syncActive();
  }

  @override
  void didUpdateWidget(covariant _AnimatedGlyph oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.active != widget.active) _syncActive();
  }

  void _syncActive() {
    _controller.stop();
    if (!widget.active) return;
    Future<void>.delayed(widget.delay, () {
      if (!mounted || !widget.active) return;
      _controller.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _QuoteBackdropState._sinWave(_controller.value);
        return Positioned(
          top: size.height * widget.topFactor,
          left: size.width * widget.leftFactor,
          child: Opacity(
            opacity: 0.08 + (t * 0.08),
            child: Transform.translate(
              offset: Offset(0, -8 * t),
              child: child,
            ),
          ),
        );
      },
      child: AppText(
        widget.char,
        weight: AppFontWeight.serifExtraBold,
        fontSize: widget.size,
        color: widget.maroon,
      ),
    );
  }
}

class _ConstellationPainter extends CustomPainter {
  _ConstellationPainter(this.maroon);

  final Color maroon;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    paint.color = maroon.withValues(alpha: 0.22);
    canvas.drawCircle(center, 70, paint);

    paint.color = const Color(0xFFC9A227).withValues(alpha: 0.26);
    paint.strokeWidth = 0.9;
    _drawDashedCircle(canvas, center, 108, paint);

    paint.color = maroon.withValues(alpha: 0.2);
    paint.strokeWidth = 1;
    final path = Path()
      ..moveTo(center.dx - 70, center.dy - 30)
      ..lineTo(center.dx, center.dy - 90)
      ..lineTo(center.dx + 70, center.dy - 30)
      ..lineTo(center.dx + 50, center.dy + 50)
      ..lineTo(center.dx - 50, center.dy + 50)
      ..close();
    canvas.drawPath(path, paint);

    _drawDot(canvas, Offset(center.dx, center.dy - 90), const Color(0xFFC9A227), 3, 0.5);
    _drawDot(canvas, Offset(center.dx + 70, center.dy - 30), maroon, 3, 0.5);
    _drawDot(canvas, Offset(center.dx + 50, center.dy + 50), const Color(0xFFC9A227), 3, 0.5);
    _drawDot(canvas, Offset(center.dx - 50, center.dy + 50), maroon, 3, 0.5);
    _drawDot(canvas, Offset(center.dx - 70, center.dy - 30), const Color(0xFFC9A227), 3, 0.5);
    _drawDot(canvas, center, maroon, 4, 0.45);
  }

  void _drawDot(Canvas canvas, Offset center, Color color, double radius, double opacity) {
    final paint = Paint()
      ..color = color.withValues(alpha: opacity)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, paint);
  }

  void _drawDashedCircle(Canvas canvas, Offset center, double radius, Paint paint) {
    const dash = 4.0;
    const gap = 9.0;
    final circumference = 2 * math.pi * radius;
    final count = (circumference / (dash + gap)).floor();
    for (var i = 0; i < count; i++) {
      final start = i * (dash + gap) / radius;
      final sweep = dash / radius;
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        start,
        sweep,
        false,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ConstellationPainter oldDelegate) => oldDelegate.maroon != maroon;
}
