import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class DurgaScreen extends StatelessWidget {
  const DurgaScreen({
    super.key,
    required this.child,
    this.scroll = true,
    this.padded = true,
  });

  final Widget child;
  final bool scroll;
  final bool padded;

  @override
  Widget build(BuildContext context) {
    final padding = EdgeInsets.fromLTRB(
      padded ? 20 : 0,
      MediaQuery.paddingOf(context).top + 12,
      padded ? 20 : 0,
      MediaQuery.paddingOf(context).bottom + 24,
    );

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.cream, Color(0xFFF8F4EC)],
          ),
        ),
        child: scroll
            ? SingleChildScrollView(
                padding: padding,
                child: child,
              )
            : Padding(padding: padding, child: child),
      ),
    );
  }
}
