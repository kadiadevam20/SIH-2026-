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

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _onSignup() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final phone = _phoneController.text.trim();
    final password = _passwordController.text.trim();
    final confirm = _confirmController.text.trim();

    if (name.isEmpty || email.isEmpty || phone.isEmpty || password.isEmpty) {
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Complete signup'),
          content: const Text('Please fill name, email, phone, and password.'),
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

    if (password != confirm) {
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Passwords differ'),
          content: const Text('Confirm password must match.'),
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

    await context.read<AppState>().updateUserProfile(
          UserProfile(
            firstName: name,
            lastName: '',
            fullName: buildFullName(name, ''),
            phone: phone,
            city: 'Ahmedabad',
            state: 'Gujarat',
            area: 'Ahmedabad',
          ),
        );

    if (!mounted) return;
    context.go('/onboarding/permissions');
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
                        'Signup',
                        weight: AppFontWeight.serif,
                        color: AppColors.ink,
                        fontSize: 40,
                      ),
                      const SizedBox(height: 28),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 360),
                        child: Column(
                          children: [
                            MaroonField(
                              controller: _nameController,
                              placeholder: 'Enter Your Name',
                              textCapitalization: TextCapitalization.words,
                            ),
                            const SizedBox(height: 14),
                            MaroonField(
                              controller: _emailController,
                              placeholder: 'Enter your email',
                              keyboardType: TextInputType.emailAddress,
                            ),
                            const SizedBox(height: 14),
                            MaroonField(
                              controller: _phoneController,
                              placeholder: 'Enter your Phone No.',
                              keyboardType: TextInputType.phone,
                            ),
                            const SizedBox(height: 14),
                            MaroonField(
                              controller: _passwordController,
                              placeholder: 'Enter Your Password',
                              obscureText: true,
                            ),
                            const SizedBox(height: 14),
                            MaroonField(
                              controller: _confirmController,
                              placeholder: 'Confirm Password',
                              obscureText: true,
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              child: FilledButton(
                                onPressed: _onSignup,
                                style: FilledButton.styleFrom(
                                  backgroundColor: AppColors.maroon,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: const StadiumBorder(),
                                ),
                                child: const AppText(
                                  'Create account',
                                  weight: AppFontWeight.bold,
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            TextButton(
                              onPressed: () => context.pop(),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 10),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  AppText(
                                    'Already have an account? ',
                                    color: AppColors.ink,
                                    fontSize: 14,
                                  ),
                                  AppText(
                                    'Log in',
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
          const DesignFooterArt(assetPath: 'assets/images/ui/signup-women.png'),
        ],
      ),
    );
  }
}
