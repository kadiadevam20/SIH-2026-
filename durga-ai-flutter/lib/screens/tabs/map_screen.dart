import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../data/mock_data.dart';
import '../../data/models.dart';
import '../../providers/app_state.dart';
import '../../theme/app_colors.dart';
import '../../utils/elevation.dart';
import '../../widgets/app_text.dart';
import '../../widgets/layout_metrics.dart';
import '../../widgets/navigation_hud.dart';
import '../../widgets/route_card.dart';
import '../../widgets/safety_map.dart';
import '../../widgets/safety_zone_legend.dart';
import '../../widgets/unsafe_zone_alert.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final _queryController = TextEditingController();
  String? _picked;
  String _route = 'safest';
  bool _navigating = false;
  SafetyZone? _selectedZone;
  bool _showLegend = true;

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  void _pickDestination(String name) {
    setState(() {
      _picked = name;
      _queryController.text = name;
      _route = 'safest';
      _navigating = false;
    });
  }

  void _clearPick() {
    setState(() {
      _picked = null;
      _queryController.clear();
      _route = 'safest';
      _navigating = false;
    });
  }

  void _avoidZone() {
    setState(() {
      _selectedZone = null;
      _picked = 'Alpha One Mall';
      _queryController.text = 'Alpha One Mall';
      _route = 'safest';
    });
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final insets = MediaQuery.paddingOf(context);
    final bottomInset = bottomChromeHeight(true, insets.bottom);
    final query = _queryController.text;
    final results = destinations
        .where(
          (d) =>
              d.name.toLowerCase().contains(query.toLowerCase()) ||
              d.address.toLowerCase().contains(query.toLowerCase()),
        )
        .toList();
    final nearestUnsafe = nearestUnsafeZone(userLocation.latitude, userLocation.longitude);
    final activeZone = _selectedZone ?? nearestUnsafe;
    final activeRoute = _route == 'safest' ? routeOptions.safest : routeOptions.fastest;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          SafetyMap(
            highlightedZoneId: activeZone?.id,
            selectedRoute: (_picked != null || _navigating) ? _route : null,
            onZonePress: (zone) => setState(() => _selectedZone = zone),
          ),
          Positioned(
            left: 16,
            right: 16,
            top: insets.top + 8,
            child: _navigating
                ? NavigationTurnHud(
                    instruction: _route == 'safest' ? 'Keep left onto CG Road' : 'Continue on Ashram Road',
                    detail: _route == 'safest'
                        ? 'Safer path · then straight for 400 m'
                        : 'Faster path · higher risk stretch ahead',
                    minutes: activeRoute.minutes,
                    eta: '${activeRoute.minutes} min',
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(color: AppColors.line),
                            boxShadow: softShadow(),
                          ),
                          child: const AppText(
                            'Safety zones · Ahmedabad',
                            weight: AppFontWeight.semibold,
                            fontSize: 11,
                            color: AppColors.maroon,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppColors.line),
                          boxShadow: softShadow(),
                        ),
                        child: Row(
                          children: [
                            const Icon(LucideIcons.search, size: 16, color: AppColors.muted),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextField(
                                controller: _queryController,
                                onChanged: (_) => setState(() {
                                  _picked = null;
                                  _navigating = false;
                                }),
                                style: const TextStyle(color: AppColors.ink),
                                decoration: const InputDecoration(
                                  hintText: 'Search a place',
                                  hintStyle: TextStyle(color: AppColors.muted),
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.symmetric(vertical: 8),
                                ),
                              ),
                            ),
                            if (query.isNotEmpty)
                              GestureDetector(
                                onTap: _clearPick,
                                child: const Icon(LucideIcons.x, size: 16, color: AppColors.muted),
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      if (_showLegend)
                        Row(
                          children: [
                            const Expanded(child: SafetyZoneLegend()),
                            GestureDetector(
                              onTap: () => setState(() => _showLegend = false),
                              child: const Padding(
                                padding: EdgeInsets.all(8),
                                child: Icon(LucideIcons.x, size: 14, color: AppColors.muted),
                              ),
                            ),
                          ],
                        )
                      else
                        Align(
                          alignment: Alignment.centerLeft,
                          child: GestureDetector(
                            onTap: () => setState(() => _showLegend = true),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(color: AppColors.line),
                                boxShadow: softShadow(),
                              ),
                              child: const AppText(
                                'Show legend',
                                weight: AppFontWeight.semibold,
                                fontSize: 11,
                                color: AppColors.muted,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
          ),
          if (query.isNotEmpty && _picked == null && !_navigating)
            Positioned(
              left: 12,
              right: 12,
              bottom: bottomInset,
              child: _sheet(
                backgroundColor: Colors.white,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxHeight: 220),
                  child: ListView(
                    shrinkWrap: true,
                    children: results
                        .map(
                          (item) => ListTile(
                            contentPadding: EdgeInsets.zero,
                            title: AppText(item.name, weight: AppFontWeight.semibold, color: AppColors.ink),
                            subtitle: AppText(item.address, fontSize: 12, color: AppColors.muted),
                            onTap: () => _pickDestination(item.name),
                          ),
                        )
                        .toList(),
                  ),
                ),
              ),
            ),
          if (_picked != null && !_navigating)
            Positioned(
              left: 12,
              right: 12,
              bottom: bottomInset,
              child: _sheet(
                backgroundColor: AppColors.cream,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: AppText(_picked!, weight: AppFontWeight.bold, fontSize: 18, color: AppColors.ink),
                        ),
                        GestureDetector(
                          onTap: _clearPick,
                          child: const Icon(LucideIcons.x, size: 18, color: AppColors.muted),
                        ),
                      ],
                    ),
                    if (destinations.any((d) => d.name == _picked)) ...[
                      const SizedBox(height: 4),
                      AppText(
                        destinations.firstWhere((d) => d.name == _picked).address,
                        color: AppColors.muted,
                      ),
                    ],
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppColors.primarySoft,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(LucideIcons.shieldCheck, size: 16, color: AppColors.maroon),
                          SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                AppText(
                                  'Safest route recommended',
                                  weight: AppFontWeight.bold,
                                  fontSize: 12,
                                  color: AppColors.maroon,
                                ),
                                SizedBox(height: 2),
                                AppText(
                                  'Demo pick for Ahmedabad — lower risk, a few minutes longer.',
                                  fontSize: 11,
                                  color: AppColors.muted,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (_route == 'fastest' && nearestUnsafe != null) ...[
                      const SizedBox(height: 10),
                      UnsafeZoneAlert(
                        zone: nearestUnsafe,
                        compact: true,
                        onPress: () => setState(() => _selectedZone = nearestUnsafe),
                      ),
                    ],
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        RouteCard(
                          title: routeOptions.safest.label,
                          minutes: routeOptions.safest.minutes,
                          risk: routeOptions.safest.risk,
                          detail: routeOptions.safest.detail,
                          recommended: true,
                          selected: _route == 'safest',
                          onTap: () => setState(() => _route = 'safest'),
                        ),
                        const SizedBox(width: 10),
                        RouteCard(
                          title: routeOptions.fastest.label,
                          minutes: routeOptions.fastest.minutes,
                          risk: routeOptions.fastest.risk,
                          detail: routeOptions.fastest.detail,
                          selected: _route == 'fastest',
                          onTap: () => setState(() => _route = 'fastest'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    GestureDetector(
                      onTap: () => setState(() => _navigating = true),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        decoration: BoxDecoration(
                          color: AppColors.maroon,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        alignment: Alignment.center,
                        child: AppText(
                          'Start ${_route == 'safest' ? 'Safest' : 'Fastest'} Route',
                          weight: AppFontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          if (_navigating)
            Positioned(
              left: 12,
              right: 12,
              bottom: bottomInset,
              child: NavigationBottomBar(
                destination: _picked,
                safetyScore: app.safetyScore,
                routeRisk: _route == 'safest' ? 'Low' : 'Moderate',
                riskColor: _route == 'safest' ? AppColors.safe : AppColors.moderate,
                onEnd: () => setState(() {
                  _navigating = false;
                  _route = 'safest';
                }),
                onReport: () => context.push('/report'),
              ),
            ),
          if (!_navigating && _picked == null && !(query.isNotEmpty && _picked == null) && _selectedZone == null)
            Positioned(
              left: 12,
              right: 12,
              bottom: bottomInset,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (activeZone != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: UnsafeZoneAlert(
                        zone: activeZone,
                        onPress: () => setState(() => _selectedZone = activeZone),
                        onAvoid: _avoidZone,
                      ),
                    ),
                  GestureDetector(
                    onTap: () => context.push('/report'),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.line),
                        boxShadow: softShadow(),
                      ),
                      alignment: Alignment.center,
                      child: const AppText('Report Unsafe Area', weight: AppFontWeight.bold, color: AppColors.ink),
                    ),
                  ),
                ],
              ),
            ),
          if (_selectedZone != null && _picked == null && !_navigating)
            Positioned(
              left: 12,
              right: 12,
              bottom: bottomInset,
              child: _sheet(
                backgroundColor: Colors.white,
                radius: 22,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: AppText('Zone details', weight: AppFontWeight.bold, fontSize: 16, color: AppColors.ink),
                        ),
                        GestureDetector(
                          onTap: () => setState(() => _selectedZone = null),
                          child: const Icon(LucideIcons.x, size: 18, color: AppColors.muted),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    UnsafeZoneAlert(zone: _selectedZone!, onAvoid: _avoidZone),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _sheet({
    required Widget child,
    Color backgroundColor = Colors.white,
    double radius = 26,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: AppColors.line),
        boxShadow: cardShadow(strong: true),
      ),
      child: child,
    );
  }
}
