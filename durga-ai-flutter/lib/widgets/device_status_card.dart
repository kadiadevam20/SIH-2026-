import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../theme/app_colors.dart';
import '../utils/elevation.dart';
import 'app_text.dart';
import 'living_pulse.dart';

class DeviceStatusCard extends StatelessWidget {
  const DeviceStatusCard({
    super.key,
    required this.connected,
    required this.name,
    required this.battery,
    required this.connection,
  });

  final bool connected;
  final String name;
  final int battery;
  final String connection;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.line),
        boxShadow: softShadow(),
      ),
      clipBehavior: Clip.antiAlias,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: connected
                ? const [AppColors.maroon, Color(0xFFA13F3C)]
                : const [Color(0xFFA89888), Color(0xFF8A8075)],
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Icon(LucideIcons.watch, size: 28, color: Colors.white),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          LivingPulse(
                            color: connected ? const Color(0xFFA7F3D0) : const Color(0xFFFCA5A5),
                            size: 10,
                          ),
                          const SizedBox(width: 6),
                          AppText(
                            connected ? 'CONNECTED' : 'DISCONNECTED',
                            weight: AppFontWeight.bold,
                            fontSize: 13,
                            color: Colors.white,
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      AppText(
                        name,
                        weight: AppFontWeight.extraBold,
                        fontSize: 20,
                        color: Colors.white,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.16),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(LucideIcons.bluetooth, size: 13, color: Colors.white),
                  const SizedBox(width: 6),
                  AppText(
                    '$connection · Battery $battery%',
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.92),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
