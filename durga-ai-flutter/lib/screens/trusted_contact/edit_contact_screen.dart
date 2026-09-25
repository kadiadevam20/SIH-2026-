import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../data/models.dart';
import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_text.dart';
import '../../widgets/maroon_field.dart';

class EditContactScreen extends StatefulWidget {
  const EditContactScreen({super.key, required this.contactId});

  final String contactId;

  @override
  State<EditContactScreen> createState() => _EditContactScreenState();
}

class _EditContactScreenState extends State<EditContactScreen> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  Relationship _rel = Relationship.friend;
  bool _primary = false;
  bool _loaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loaded) return;
    final c = context.read<AppState>().contacts.where((x) => x.id == widget.contactId).firstOrNull;
    if (c != null) {
      _name.text = c.name;
      _phone.text = c.phone;
      _rel = c.relationship;
      _primary = c.primary;
    }
    _loaded = true;
  }

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: AppColors.maroon), onPressed: () => context.pop()),
        title: const AppText('Edit contact', weight: AppFontWeight.bold, color: AppColors.maroon),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          MaroonField(controller: _name, placeholder: 'Full name'),
          const SizedBox(height: 12),
          MaroonField(controller: _phone, placeholder: 'Phone number', keyboardType: TextInputType.phone),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            children: Relationship.values.map((r) {
              return ChoiceChip(
                label: Text(r.label),
                selected: _rel == r,
                selectedColor: AppColors.primarySoft,
                onSelected: (_) => setState(() => _rel = r),
              );
            }).toList(),
          ),
          SwitchListTile(
            title: const AppText('Primary contact', weight: AppFontWeight.semibold),
            value: _primary,
            activeThumbColor: AppColors.maroon,
            onChanged: (v) => setState(() => _primary = v),
          ),
          const SizedBox(height: 20),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppColors.maroon, padding: const EdgeInsets.symmetric(vertical: 16)),
            onPressed: () {
              context.read<AppState>().updateContact(
                    widget.contactId,
                    name: _name.text.trim(),
                    phone: _phone.text.trim(),
                    relationship: _rel,
                    primary: _primary,
                  );
              context.pop();
            },
            child: const AppText('Save changes', weight: AppFontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
