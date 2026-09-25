import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../utils/color_utils.dart';
import '../../widgets/layout_metrics.dart';
import '../../widgets/app_text.dart';

class ContactsScreen extends StatefulWidget {
  const ContactsScreen({super.key});

  @override
  State<ContactsScreen> createState() => _ContactsScreenState();
}

class _ContactsScreenState extends State<ContactsScreen> {
  final _queryController = TextEditingController();

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  Future<void> _call(String phone) async {
    final uri = Uri.parse('tel:${phone.replaceAll(' ', '')}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _showActions(BuildContext context, String id, String name) {
    final app = context.read<AppState>();
    final phone = app.contacts.firstWhere((c) => c.id == id).phone;

    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: AppText(name, weight: AppFontWeight.bold, fontSize: 18, color: AppColors.ink),
            ),
            ListTile(
              leading: const Icon(LucideIcons.pencil, color: AppColors.maroon),
              title: const Text('Edit'),
              onTap: () {
                Navigator.pop(ctx);
                context.push('/trusted-contact/edit?id=$id');
              },
            ),
            ListTile(
              leading: const Icon(LucideIcons.phone, color: AppColors.maroon),
              title: const Text('Call'),
              onTap: () {
                Navigator.pop(ctx);
                _call(phone);
              },
            ),
            ListTile(
              leading: const Icon(LucideIcons.trash2, color: AppColors.high),
              title: const Text('Remove', style: TextStyle(color: AppColors.high)),
              onTap: () {
                Navigator.pop(ctx);
                app.removeContact(id);
              },
            ),
            ListTile(
              title: const Text('Cancel'),
              onTap: () => Navigator.pop(ctx),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final insets = MediaQuery.paddingOf(context);
    final bottomPad = bottomChromeHeight(true, insets.bottom);
    final query = _queryController.text.toLowerCase();
    final filtered = app.contacts.where((c) {
      return c.name.toLowerCase().contains(query) ||
          c.phone.replaceAll(' ', '').contains(query.replaceAll(' ', ''));
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: Stack(
        children: [
          Column(
            children: [
              SizedBox(height: insets.top + 4),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AppText('Contacts', weight: AppFontWeight.serifBold, fontSize: 28, color: AppColors.maroon),
                          SizedBox(height: 2),
                          AppText(
                            'Your trusted safety circle',
                            weight: AppFontWeight.medium,
                            fontSize: 13,
                            color: AppColors.muted,
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.push('/trusted-contact/add'),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.maroon,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Icon(LucideIcons.plus, size: 20, color: AppColors.warmWhite),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(18, 6, 18, 8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.line),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.search, size: 18, color: AppColors.muted),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextField(
                          controller: _queryController,
                          onChanged: (_) => setState(() {}),
                          style: const TextStyle(color: AppColors.ink, fontSize: 15),
                          decoration: const InputDecoration(
                            hintText: 'Search by name or number',
                            hintStyle: TextStyle(color: AppColors.muted),
                            border: InputBorder.none,
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: ListView(
                  padding: EdgeInsets.fromLTRB(18, 10, 18, bottomPad + 72),
                  children: filtered.isEmpty
                      ? [
                          Container(
                            margin: const EdgeInsets.only(top: 24),
                            padding: const EdgeInsets.all(28),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(22),
                              border: Border.all(color: AppColors.line),
                            ),
                            child: Column(
                              children: [
                                const Icon(LucideIcons.user, size: 28, color: AppColors.maroon),
                                const SizedBox(height: 10),
                                AppText(
                                  query.isNotEmpty ? 'No matches' : 'No contacts yet',
                                  weight: AppFontWeight.semibold,
                                  fontSize: 16,
                                  color: AppColors.ink,
                                ),
                                const SizedBox(height: 6),
                                AppText(
                                  query.isNotEmpty
                                      ? 'Try a different name or number'
                                      : 'Add people who should be reached in an emergency',
                                  weight: AppFontWeight.medium,
                                  fontSize: 13,
                                  textAlign: TextAlign.center,
                                  color: AppColors.muted,
                                ),
                              ],
                            ),
                          ),
                        ]
                      : filtered
                          .map(
                            (contact) => Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: GestureDetector(
                                onTap: () => _showActions(context, contact.id, contact.name),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: AppColors.line),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 48,
                                        height: 48,
                                        alignment: Alignment.center,
                                        decoration: BoxDecoration(
                                          color: parseHexColor(contact.color),
                                          borderRadius: BorderRadius.circular(16),
                                        ),
                                        child: AppText(
                                          contact.initials,
                                          weight: AppFontWeight.bold,
                                          fontSize: 14,
                                          color: AppColors.warmWhite,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Expanded(
                                                  child: AppText(
                                                    contact.name,
                                                    weight: AppFontWeight.bold,
                                                    fontSize: 16,
                                                    color: AppColors.ink,
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                ),
                                                if (contact.primary)
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                    decoration: BoxDecoration(
                                                      color: AppColors.primarySoft,
                                                      borderRadius: BorderRadius.circular(999),
                                                    ),
                                                    child: const AppText(
                                                      'Primary',
                                                      weight: AppFontWeight.semibold,
                                                      fontSize: 10,
                                                      color: AppColors.maroon,
                                                    ),
                                                  ),
                                              ],
                                            ),
                                            const SizedBox(height: 2),
                                            AppText(
                                              contact.relationship.label,
                                              weight: AppFontWeight.medium,
                                              fontSize: 12,
                                              color: AppColors.muted,
                                            ),
                                            const SizedBox(height: 4),
                                            AppText(contact.phone, fontSize: 13, color: AppColors.muted),
                                          ],
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: () => _call(contact.phone),
                                        child: Container(
                                          width: 40,
                                          height: 40,
                                          decoration: BoxDecoration(
                                            color: AppColors.primarySoft,
                                            borderRadius: BorderRadius.circular(14),
                                          ),
                                          child: const Icon(LucideIcons.phone, size: 18, color: AppColors.maroon),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          )
                          .toList(),
                ),
              ),
            ],
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: bottomPad + 8,
            child: Center(
              child: GestureDetector(
                onTap: () => context.push('/trusted-contact/add'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.maroon,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.maroon.withValues(alpha: 0.25),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(LucideIcons.plus, size: 22, color: AppColors.warmWhite),
                      SizedBox(width: 8),
                      AppText('Add contact', weight: AppFontWeight.bold, fontSize: 15, color: AppColors.warmWhite),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
