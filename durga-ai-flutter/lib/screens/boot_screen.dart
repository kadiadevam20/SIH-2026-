import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/app_state.dart';

/// Boot splash routes once [AppState] is ready.
class BootScreen extends StatelessWidget {
  const BootScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    if (!state.ready) {
      return const Scaffold(
        backgroundColor: Color(0xFFF5F1E8),
        body: SizedBox.shrink(),
      );
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!context.mounted) return;
      if (!state.onboarded) {
        context.go('/onboarding');
      } else {
        context.go('/home');
      }
    });

    return const Scaffold(
      backgroundColor: Color(0xFFF5F1E8),
      body: SizedBox.shrink(),
    );
  }
}
