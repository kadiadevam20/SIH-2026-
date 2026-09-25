import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../data/mock_data.dart';
import '../theme/app_colors.dart';
import '../widgets/app_shadow.dart';
import '../widgets/durga_screen.dart';
import '../widgets/fade_in.dart';
import '../widgets/nearby_help_card.dart';
import '../widgets/page_header.dart';
import '../widgets/safety_map.dart';
import '../widgets/unsafe_zone_alert.dart';

/// Nearby help — map preview, unsafe zone alert, place cards.
class NearbyHelpScreen extends StatelessWidget {
  const NearbyHelpScreen({super.key});

  Future<void> _callPlace(BuildContext context, String phone) async {
    if (phone.isEmpty) {
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('No phone'),
          content: const Text('This place has no phone number on file.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK')),
          ],
        ),
      );
      return;
    }
    final uri = Uri(scheme: 'tel', path: phone.replaceAll(' ', ''));
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final nearestUnsafe = nearestUnsafeZone(userLocation.latitude, userLocation.longitude);

    return DurgaScreen(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FadeIn(
            child: PageHeader(
              icon: LucideIcons.mapPin,
              status: 'Nearby & open',
              title: 'Nearby Help',
              subtitle: 'Police, hospitals, pharmacies, and safe places around you.',
              onBack: () => context.pop(),
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 60),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  height: 220,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: AppColors.line),
                    boxShadow: softShadow(),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: const SafetyMap(),
                ),
                if (nearestUnsafe != null) ...[
                  const SizedBox(height: 10),
                  UnsafeZoneAlert(
                    zone: nearestUnsafe,
                    compact: true,
                    onPress: () => context.go('/map'),
                  ),
                ],
              ],
            ),
          ),
          FadeIn(
            delay: const Duration(milliseconds: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SectionLabel(
                  title: 'Places near you',
                  subtitle: 'Open the map or call in one tap',
                ),
                for (final place in nearbyPlaces) ...[
                  NearbyHelpCard(
                    place: place,
                    onNavigate: () {
                      context.go('/map');
                    },
                    onCall: () => _callPlace(context, place.phone),
                  ),
                  const SizedBox(height: 12),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
