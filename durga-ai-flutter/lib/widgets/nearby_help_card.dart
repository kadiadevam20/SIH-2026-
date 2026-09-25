import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../data/mock_data.dart';
import '../data/models.dart';
import '../theme/app_colors.dart';
import 'app_shadow.dart';
import 'app_text.dart';

class NearbyHelpCard extends StatelessWidget {
  const NearbyHelpCard({
    super.key,
    required this.place,
    required this.onNavigate,
    required this.onCall,
  });

  final NearbyPlace place;
  final VoidCallback onNavigate;
  final VoidCallback onCall;

  IconData _iconForType(PlaceType type) {
    switch (type) {
      case PlaceType.police:
        return LucideIcons.shield;
      case PlaceType.hospital:
        return LucideIcons.heartPulse;
      case PlaceType.pharmacy:
        return LucideIcons.store;
      case PlaceType.helpCenter:
        return LucideIcons.building2;
      case PlaceType.safePlace:
        return LucideIcons.trees;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.line),
        boxShadow: softShadow(),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Icon(_iconForType(place.type), size: 22, color: AppColors.maroon),
              ),
              const Positioned(
                right: 8,
                bottom: 8,
                child: Icon(LucideIcons.mapPin, size: 12, color: AppColors.maroon),
              ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(
                  place.name,
                  weight: AppFontWeight.semibold,
                  color: AppColors.ink,
                  fontSize: 15,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                AppText(
                  '${place.distance} · ${place.address}',
                  color: AppColors.muted,
                  fontSize: 12,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                AppText(
                  '${place.open ? 'Open' : 'Closed'} · ${place.hours}',
                  weight: AppFontWeight.medium,
                  color: place.open ? AppColors.safe : AppColors.high,
                  fontSize: 12,
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    _ActionButton(
                      label: 'Open map',
                      icon: LucideIcons.mapPin,
                      background: AppColors.maroon,
                      foreground: Colors.white,
                      onTap: onNavigate,
                    ),
                    if (place.phone.isNotEmpty) ...[
                      const SizedBox(width: 8),
                      _ActionButton(
                        label: 'Call',
                        icon: LucideIcons.phone,
                        background: AppColors.safeSoft,
                        foreground: AppColors.safe,
                        onTap: onCall,
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.label,
    required this.icon,
    required this.background,
    required this.foreground,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final Color background;
  final Color foreground;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(icon, size: 14, color: foreground),
            const SizedBox(width: 6),
            AppText(label, weight: AppFontWeight.semibold, color: foreground, fontSize: 12),
          ],
        ),
      ),
    );
  }
}
