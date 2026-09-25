import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../data/models.dart';
import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_text.dart';
import '../../widgets/maroon_field.dart';

class AddContactScreen extends StatefulWidget {
  const AddContactScreen({super.key});

  @override
  State<AddContactScreen> createState() => _AddContactScreenState();
}

class _AddContactScreenState extends State<AddContactScreen> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  Relationship _rel = Relationship.friend;
  bool _primary = false;

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
        title: const AppText('Add contact', weight: AppFontWeight.bold, color: AppColors.maroon),
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
              final selected = _rel == r;
              return ChoiceChip(
                label: Text(r.label),
                selected: selected,
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
              if (_name.text.trim().isEmpty || _phone.text.trim().isEmpty) return;
              context.read<AppState>().addContact(
                    name: _name.text.trim(),
                    phone: _phone.text.trim(),
                    relationship: _rel,
                    primary: _primary,
                  );
              context.pop();
            },
            child: const AppText('Save contact', weight: AppFontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
