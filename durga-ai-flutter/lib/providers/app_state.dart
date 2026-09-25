import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../data/mock_data.dart';
import '../data/models.dart';

const _storageOnboarded = 'durga.onboarded';
const _storageProfile = 'durga.profile';

const _avatarColors = ['#2563EB', '#3B82F6', '#60A5FA', '#1D4ED8', '#64748B'];

class AppState extends ChangeNotifier {
  bool ready = false;
  bool onboarded = false;
  bool limitedAccess = false;
  UserProfile userProfile = defaultUserProfile;
  bool locationSharing = false;
  bool offline = false;
  RiskLevel safetyLevel = RiskLevel.safe;
  List<Contact> contacts = List.from(initialContacts);
  DeviceSettings device = const DeviceSettings(
    connected: true,
    name: 'DURGA Safety Band',
    battery: 82,
    connection: 'Bluetooth',
    sosButton: true,
    fallDetection: true,
    locationTracking: true,
    emergencyAlert: true,
  );
  bool emergencyActive = false;
  int emergencyCountdown = 0;
  List<EmergencyStep> emergencySteps = const [
    EmergencyStep(id: 'sos', label: 'SOS Activated', status: EmergencyStepStatus.pending),
    EmergencyStep(id: 'loc', label: 'Live location shared', status: EmergencyStepStatus.pending),
    EmergencyStep(id: 'priya', label: 'Priya notified', status: EmergencyStepStatus.pending),
    EmergencyStep(id: 'services', label: 'Contacting emergency services', status: EmergencyStepStatus.pending),
  ];
  List<ChatMessage> messages = List.from(initialMessages);
  bool isTyping = false;
  Timer? _emergencyTimer;

  String get userName => userProfile.firstName.trim().isEmpty ? 'there' : userProfile.firstName.trim();
  int get safetyScore => safetyLevel == RiskLevel.safe ? 82 : safetyLevel == RiskLevel.moderate ? 58 : 31;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final onboardedValue = prefs.getString(_storageOnboarded);
    if (onboardedValue == '1' || onboardedValue == 'limited') {
      onboarded = true;
      limitedAccess = onboardedValue == 'limited';
    }
    final profileJson = prefs.getString(_storageProfile);
    if (profileJson != null) {
      try {
        userProfile = UserProfile.fromJson(jsonDecode(profileJson) as Map<String, dynamic>);
        if (userProfile.firstName.trim().isNotEmpty) {
          messages = [welcomeMessage(userProfile.firstName)];
        }
      } catch (_) {}
    }
    ready = true;
    notifyListeners();
  }

  Future<void> updateUserProfile(UserProfile profile) async {
    userProfile = profile;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageProfile, jsonEncode(profile.toJson()));
    if (profile.firstName.trim().isNotEmpty) {
      messages = [welcomeMessage(profile.firstName)];
    }
    notifyListeners();
  }

  Future<void> completeOnboarding(bool limited) async {
    limitedAccess = limited;
    onboarded = true;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageOnboarded, limited ? 'limited' : '1');
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageOnboarded);
    await prefs.remove(_storageProfile);
    onboarded = false;
    limitedAccess = false;
    userProfile = defaultUserProfile;
    locationSharing = false;
    emergencyActive = false;
    emergencyCountdown = 0;
    messages = List.from(initialMessages);
    contacts = List.from(initialContacts);
    _emergencyTimer?.cancel();
    notifyListeners();
  }

  void setLocationSharing(bool value) {
    locationSharing = value;
    notifyListeners();
  }

  void setOffline(bool value) {
    offline = value;
    notifyListeners();
  }

  void setSafetyLevel(RiskLevel level) {
    safetyLevel = level;
    notifyListeners();
  }

  String _initials(String name) => name
      .split(' ')
      .where((p) => p.isNotEmpty)
      .take(2)
      .map((p) => p[0].toUpperCase())
      .join();

  void addContact({required String name, required String phone, required Relationship relationship, bool primary = false}) {
    if (primary) contacts = contacts.map((c) => c.copyWith(primary: false)).toList();
    contacts = [
      ...contacts,
      Contact(
        id: 'c-${DateTime.now().millisecondsSinceEpoch}',
        name: name,
        relationship: relationship,
        phone: phone,
        initials: _initials(name),
        primary: primary,
        color: _avatarColors[contacts.length % _avatarColors.length],
      ),
    ];
    notifyListeners();
  }

  void updateContact(String id, {String? name, String? phone, Relationship? relationship, bool? primary}) {
    if (primary == true) {
      contacts = contacts.map((c) => c.copyWith(primary: c.id == id)).toList();
    }
    contacts = contacts.map((c) {
      if (c.id != id) return c;
      return c.copyWith(
        name: name,
        phone: phone,
        relationship: relationship,
        primary: primary,
        initials: name != null ? _initials(name) : c.initials,
      );
    }).toList();
    notifyListeners();
  }

  void removeContact(String id) {
    contacts = contacts.where((c) => c.id != id).toList();
    notifyListeners();
  }

  void toggleDeviceSetting(String key) {
    switch (key) {
      case 'sosButton':
        device = device.copyWith(sosButton: !device.sosButton);
      case 'fallDetection':
        device = device.copyWith(fallDetection: !device.fallDetection);
      case 'locationTracking':
        device = device.copyWith(locationTracking: !device.locationTracking);
      case 'emergencyAlert':
        device = device.copyWith(emergencyAlert: !device.emergencyAlert);
    }
    notifyListeners();
  }

  void setDeviceConnected(bool connected) {
    device = device.copyWith(connected: connected);
    notifyListeners();
  }

  void startEmergency() {
    emergencyActive = true;
    emergencyCountdown = 5;
    locationSharing = true;
    emergencySteps = const [
      EmergencyStep(id: 'sos', label: 'SOS Activated', status: EmergencyStepStatus.done),
      EmergencyStep(id: 'loc', label: 'Live location shared', status: EmergencyStepStatus.active),
      EmergencyStep(id: 'priya', label: 'Priya notified', status: EmergencyStepStatus.pending),
      EmergencyStep(id: 'services', label: 'Contacting emergency services', status: EmergencyStepStatus.pending),
    ];
    _emergencyTimer?.cancel();
    _emergencyTimer = Timer.periodic(const Duration(milliseconds: 900), (_) {
      final activeIndex = emergencySteps.indexWhere((s) => s.status == EmergencyStepStatus.active);
      if (activeIndex == -1) return;
      emergencySteps = [
        for (var i = 0; i < emergencySteps.length; i++)
          if (i == activeIndex)
            emergencySteps[i].copyWith(status: EmergencyStepStatus.done)
          else if (i == activeIndex + 1)
            emergencySteps[i].copyWith(status: EmergencyStepStatus.active)
          else
            emergencySteps[i],
      ];
      if (emergencyCountdown > 0) emergencyCountdown--;
      notifyListeners();
    });
    notifyListeners();
  }

  void stopEmergency() {
    emergencyActive = false;
    emergencyCountdown = 0;
    _emergencyTimer?.cancel();
    emergencySteps = emergencySteps.map((s) => s.copyWith(status: EmergencyStepStatus.pending)).toList();
    notifyListeners();
  }

  void sendMessage(String text) {
    final now = TimeOfDay.now();
    final time = '${now.hourOfPeriod == 0 ? 12 : now.hourOfPeriod}:${now.minute.toString().padLeft(2, '0')} ${now.period == DayPeriod.am ? 'AM' : 'PM'}';
    messages = [
      ...messages,
      ChatMessage(id: 'u-${DateTime.now().millisecondsSinceEpoch}', role: ChatRole.user, text: text, time: time),
    ];
    isTyping = true;
    notifyListeners();
    Future.delayed(const Duration(milliseconds: 900), () {
      messages = [...messages, durgaReply(text)];
      isTyping = false;
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _emergencyTimer?.cancel();
    super.dispose();
  }
}
