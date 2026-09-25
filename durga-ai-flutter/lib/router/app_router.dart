import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/app_state.dart';
import '../screens/boot_screen.dart';
import '../screens/emergency_screen.dart';
import '../screens/nearby_help_screen.dart';
import '../screens/offline_screen.dart';
import '../screens/onboarding/login_screen.dart';
import '../screens/onboarding/permissions_screen.dart';
import '../screens/onboarding/signup_screen.dart';
import '../screens/report_screen.dart';
import '../screens/trusted_contact/add_contact_screen.dart';
import '../screens/trusted_contact/edit_contact_screen.dart';
import '../screens/settings/tutorials_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/sos_screen.dart';
import '../screens/tabs/contacts_screen.dart';
import '../screens/tabs/durga_screen.dart' as durga_tab;
import '../screens/tabs/hardware_screen.dart';
import '../screens/tabs/home_screen.dart';
import '../screens/tabs/map_screen.dart';
import '../widgets/brand_splash.dart';
import '../widgets/custom_tab_shell.dart';

GoRouter createRouter(AppState appState) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: appState,
    redirect: (context, state) {
      if (!appState.ready) return null;
      final loc = state.matchedLocation;
      final isOnboarding = loc.startsWith('/onboarding');
      if (!appState.onboarded && !isOnboarding && loc != '/') {
        return '/onboarding';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const BootScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/onboarding/signup', builder: (_, __) => const SignupScreen()),
      GoRoute(path: '/onboarding/permissions', builder: (_, __) => const PermissionsScreen()),
      ShellRoute(
        builder: (context, state, child) => CustomTabShell(child: child),
        routes: [
          GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
          GoRoute(path: '/map', builder: (_, __) => const MapScreen()),
          GoRoute(path: '/durga', builder: (_, __) => const durga_tab.DurgaScreen()),
          GoRoute(path: '/contacts', builder: (_, __) => const ContactsScreen()),
          GoRoute(path: '/hardware', builder: (_, __) => const HardwareScreen()),
        ],
      ),
      GoRoute(path: '/sos', builder: (_, __) => const SosScreen()),
      GoRoute(path: '/emergency', builder: (_, __) => const EmergencyScreen()),
      GoRoute(path: '/nearby-help', builder: (_, __) => const NearbyHelpScreen()),
      GoRoute(path: '/report', builder: (_, __) => const ReportScreen()),
      GoRoute(path: '/offline', builder: (_, __) => const OfflineScreen()),
      GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
      GoRoute(path: '/settings/tutorials', builder: (_, __) => const TutorialsScreen()),
      GoRoute(path: '/trusted-contact/add', builder: (_, __) => const AddContactScreen()),
      GoRoute(
        path: '/trusted-contact/edit',
        builder: (_, state) => EditContactScreen(contactId: state.uri.queryParameters['id'] ?? ''),
      ),
    ],
  );
}

class DurgaApp extends StatefulWidget {
  const DurgaApp({super.key, required this.appState});

  final AppState appState;

  @override
  State<DurgaApp> createState() => _DurgaAppState();
}

class _DurgaAppState extends State<DurgaApp> {
  late final GoRouter _router = createRouter(widget.appState);

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'DURGA AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFF5F1E8),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF7A1D1D)),
        useMaterial3: true,
      ),
      routerConfig: _router,
      builder: (context, child) {
        return Stack(
          children: [
            if (child != null) child,
            ListenableBuilder(
              listenable: widget.appState,
              builder: (context, _) {
                if (widget.appState.ready) return const SizedBox.shrink();
                return const BrandSplash();
              },
            ),
          ],
        );
      },
    );
  }
}
