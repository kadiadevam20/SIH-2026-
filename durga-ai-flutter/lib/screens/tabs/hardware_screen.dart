import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../data/mock_data.dart';
import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../utils/elevation.dart';
import '../../widgets/layout_metrics.dart';
import '../../widgets/ambient_background.dart';
import '../../widgets/app_text.dart';
import '../../widgets/device_status_card.dart';
import '../../widgets/page_header.dart';

class HardwareScreen extends StatefulWidget {
  const HardwareScreen({super.key});

  @override
  State<HardwareScreen> createState() => _HardwareScreenState();
}

class _HardwareScreenState extends State<HardwareScreen> {
  bool _confirmSos = false;

  String _batteryLabel(int battery) {
    if (battery > 50) return 'Good';
    if (battery > 20) return 'Moderate';
    return 'Low';
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final insets = MediaQuery.paddingOf(context);
    final bottomPad = bottomChromeHeight(true, insets.bottom);
    final device = app.device;

    return Scaffold(
      backgroundColor: AppColors.cream,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const AmbientBackground(),
          ListView(
            padding: EdgeInsets.fromLTRB(20, insets.top + 12, 20, bottomPad + 8),
            children: [
              PageHeader(
                icon: LucideIcons.watch,
                status: device.connected ? 'Connected' : 'Not connected',
                statusColor: device.connected ? AppColors.safe : AppColors.high,
                title: 'Device',
                subtitle: 'Your DURGA Safety Device — battery, protections, and activity.',
              ),
              DeviceStatusCard(
                connected: device.connected,
                name: device.name,
                battery: device.battery,
                connection: device.connection,
              ),
              SectionLabel(
                title: 'Battery',
                subtitle: 'Status: ${_batteryLabel(device.battery)}',
              ),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.line),
                  boxShadow: softShadow(),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: device.battery / 100,
                        minHeight: 12,
                        backgroundColor: AppColors.creamDeep,
                        color: device.battery > 30 ? AppColors.safe : AppColors.high,
                      ),
                    ),
                    const SizedBox(height: 10),
                    AppText('${device.battery}% remaining', fontSize: 13, color: AppColors.muted),
                  ],
                ),
              ),
              const SectionLabel(
                title: 'Protections',
                subtitle: 'Toggle what the device should watch for',
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.line),
                  boxShadow: softShadow(),
                ),
                child: Column(
                  children: [
                    _toggleRow('SOS Button', device.sosButton, () => app.toggleDeviceSetting('sosButton')),
                    _toggleRow('Fall Detection', device.fallDetection, () => app.toggleDeviceSetting('fallDetection')),
                    _toggleRow(
                      'Location Tracking',
                      device.locationTracking,
                      () => app.toggleDeviceSetting('locationTracking'),
                    ),
                    _toggleRow(
                      'Emergency Alerts',
                      device.emergencyAlert,
                      () => app.toggleDeviceSetting('emergencyAlert'),
                      last: true,
                    ),
                  ],
                ),
              ),
              const SectionLabel(title: 'Device actions'),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _actionButton(
                    'Sync Device',
                    onTap: () => _alert(context, 'Synced', 'Location and health data are up to date.'),
                  ),
                  _actionButton(
                    'Locate Device',
                    onTap: () => _alert(context, 'Device located', 'Last seen near Navrangpura, 40m away.'),
                  ),
                  _actionButton('Test SOS', danger: true, onTap: () => setState(() => _confirmSos = true)),
                  _actionButton(
                    device.connected ? 'Disconnect' : 'Connect',
                    onTap: () => app.setDeviceConnected(!device.connected),
                  ),
                ],
              ),
              const SectionLabel(
                title: 'Device activity',
                subtitle: 'Recent events from your band',
              ),
              Container(
                padding: const EdgeInsets.symmetric(vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.line),
                  boxShadow: softShadow(),
                ),
                child: Column(
                  children: [
                    for (var i = 0; i < deviceActivity.length; i++)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        decoration: BoxDecoration(
                          border: i < deviceActivity.length - 1
                              ? const Border(bottom: BorderSide(color: AppColors.line))
                              : null,
                        ),
                        child: Row(
                          children: [
                            SizedBox(
                              width: 92,
                              child: AppText(
                                deviceActivity[i].time,
                                weight: AppFontWeight.semibold,
                                fontSize: 12,
                                color: AppColors.muted,
                              ),
                            ),
                            Expanded(
                              child: AppText('✓ ${deviceActivity[i].title}', color: AppColors.ink),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          if (_confirmSos)
            ColoredBox(
              color: const Color(0x730F1020),
              child: Center(
                child: Container(
                  margin: const EdgeInsets.all(24),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: softShadow(),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const AppText('Test SOS?', weight: AppFontWeight.bold, fontSize: 18, color: AppColors.ink),
                      const SizedBox(height: 8),
                      const AppText(
                        'This simulates an emergency alert. Trusted contacts will not be notified in test mode.',
                        color: AppColors.muted,
                        height: 20 / 14,
                      ),
                      const SizedBox(height: 18),
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _confirmSos = false),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: AppColors.creamDeep,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                alignment: Alignment.center,
                                child: const AppText('Cancel', weight: AppFontWeight.bold, color: AppColors.ink),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                setState(() => _confirmSos = false);
                                app.startEmergency();
                                context.push('/emergency');
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: AppColors.high,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                alignment: Alignment.center,
                                child: const AppText('Run test', weight: AppFontWeight.bold, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  void _alert(BuildContext context, String title, String body) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(body),
        actions: [TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK'))],
      ),
    );
  }

  Widget _toggleRow(String label, bool value, VoidCallback onChanged, {bool last = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        border: last ? null : const Border(bottom: BorderSide(color: AppColors.line)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppText(label, weight: AppFontWeight.semibold, color: AppColors.ink),
                AppText(value ? 'Enabled' : 'Disabled', fontSize: 12, color: AppColors.muted),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: (_) => onChanged(),
            activeColor: Colors.white,
            activeTrackColor: AppColors.maroon,
            inactiveTrackColor: AppColors.line,
          ),
        ],
      ),
    );
  }

  Widget _actionButton(String label, {required VoidCallback onTap, bool danger = false}) {
    return SizedBox(
      width: (MediaQuery.sizeOf(context).width - 50) / 2,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: danger ? AppColors.high : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: danger ? AppColors.high : AppColors.line),
            boxShadow: danger ? null : softShadow(),
          ),
          alignment: Alignment.center,
          child: AppText(
            label,
            weight: AppFontWeight.bold,
            color: danger ? Colors.white : AppColors.ink,
          ),
        ),
      ),
    );
  }
}
