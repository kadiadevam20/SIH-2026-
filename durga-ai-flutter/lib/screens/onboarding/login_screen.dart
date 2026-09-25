import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../data/mock_data.dart';
import '../../data/models.dart';
import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_text.dart';
import '../../widgets/design_footer_art.dart';
import '../../widgets/maroon_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _onLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Missing details'),
          content: const Text('Please enter your email and password.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    final appState = context.read<AppState>();
    if (appState.userProfile.firstName.isEmpty) {
      final name = email.split('@').first.isEmpty ? 'Guardian' : email.split('@').first;
      final profile = appState.userProfile;
      await appState.updateUserProfile(
        UserProfile(
          firstName: name,
          lastName: profile.lastName,
          fullName: buildFullName(name, ''),
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          area: profile.area,
        ),
      );
    }

    if (!mounted) return;
    context.go('/onboarding/permissions');
  }

  void _onForgotPassword() {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Forgot password'),
        content: const Text('Password reset will be available soon.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final top = MediaQuery.paddingOf(context).top + 28;
    final bottom = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      backgroundColor: AppColors.cream,
      resizeToAvoidBottomInset: true,
      body: Stack(
        children: [
          Padding(
            padding: EdgeInsets.only(top: top),
            child: SingleChildScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              padding: EdgeInsets.fromLTRB(28, 0, 28, 200 + bottom),
              child: Align(
                alignment: Alignment.topCenter,
                child: Column(
                    children: [
                      const SizedBox(height: 8),
                      const AppText(
                        'Welcome',
                        weight: AppFontWeight.serif,
                        color: AppColors.ink,
                        fontSize: 42,
                      ),
                      const SizedBox(height: 4),
                      const AppText(
                        'D.U.R.G.A',
                        weight: AppFontWeight.serifExtraBold,
                        color: AppColors.maroon,
                        fontSize: 36,
                        letterSpacing: 2,
                      ),
                      const SizedBox(height: 4),
                      const AppText(
                        'Your Digital Guardian',
                        weight: AppFontWeight.serif,
                        color: AppColors.ink,
                        fontSize: 16,
                      ),
                      const SizedBox(height: 36),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 360),
                        child: Column(
                          children: [
                            MaroonField(
                              controller: _emailController,
                              placeholder: 'Enter Your Name',
                              keyboardType: TextInputType.emailAddress,
                            ),
                            const SizedBox(height: 14),
                            MaroonField(
                              controller: _passwordController,
                              placeholder: 'Enter your Password',
                              obscureText: true,
                            ),
                            const SizedBox(height: 4),
                            TextButton(
                              onPressed: _onForgotPassword,
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: const AppText(
                                'forgot password ?',
                                color: AppColors.ink,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 10),
                            SizedBox(
                              width: double.infinity,
                              child: FilledButton(
                                onPressed: _onLogin,
                                style: FilledButton.styleFrom(
                                  backgroundColor: AppColors.maroon,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: const StadiumBorder(),
                                ),
                                child: const AppText(
                                  'Log in',
                                  weight: AppFontWeight.bold,
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextButton(
                              onPressed: () => context.push('/onboarding/signup'),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  AppText(
                                    'New here? ',
                                    color: AppColors.ink,
                                    fontSize: 14,
                                  ),
                                  AppText(
                                    'Sign up',
                                    weight: AppFontWeight.bold,
                                    color: AppColors.maroon,
                                    fontSize: 14,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          const DesignFooterArt(assetPath: 'assets/images/ui/login-women.png'),
        ],
      ),
    );
  }
}
