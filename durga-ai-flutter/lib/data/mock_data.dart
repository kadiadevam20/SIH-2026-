import 'models.dart';

class MapCenter {
  const MapCenter({
    required this.latitude,
    required this.longitude,
    required this.latitudeDelta,
    required this.longitudeDelta,
  });

  final double latitude;
  final double longitude;
  final double latitudeDelta;
  final double longitudeDelta;
}

class GeoPoint {
  const GeoPoint({
    required this.latitude,
    required this.longitude,
  });

  final double latitude;
  final double longitude;
}

class Destination {
  const Destination({
    required this.id,
    required this.name,
    required this.address,
  });

  final String id;
  final String name;
  final String address;
}

class RouteOption {
  const RouteOption({
    required this.minutes,
    required this.risk,
    required this.label,
    this.detail = '',
    this.recommended = false,
  });

  final int minutes;
  final RiskLevel risk;
  final String label;
  final String detail;
  final bool recommended;
}

class RouteOptions {
  const RouteOptions({
    required this.fastest,
    required this.safest,
  });

  final RouteOption fastest;
  final RouteOption safest;
}

class EmergencyInstruction {
  const EmergencyInstruction({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;
}

class ReportReason {
  const ReportReason({
    required this.id,
    required this.label,
  });

  final String id;
  final String label;
}

const defaultUserProfile = UserProfile(
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  city: 'Ahmedabad',
  state: 'Gujarat',
  area: '',
);

String buildFullName(String firstName, String lastName) {
  return [firstName.trim(), lastName.trim()].where((part) => part.isNotEmpty).join(' ');
}

String _formatChatTime(DateTime dateTime) {
  final hour = dateTime.hour % 12 == 0 ? 12 : dateTime.hour % 12;
  final minute = dateTime.minute.toString().padLeft(2, '0');
  final period = dateTime.hour >= 12 ? 'PM' : 'AM';
  return '$hour:$minute $period';
}

ChatMessage welcomeMessage(String firstName) {
  final name = firstName.trim().isEmpty ? 'there' : firstName.trim();
  return ChatMessage(
    id: 'm1',
    role: ChatRole.durga,
    text:
        "Hi $name. I'm DURGA. I can help with nearby help, live sharing, or emergency guidance. What do you need?",
    time: '9:41 AM',
    actions: const [
      ChatAction(id: 'help', label: 'Nearby help'),
      ChatAction(id: 'safest', label: 'Safety map'),
      ChatAction(id: 'share', label: 'Share location'),
    ],
  );
}

const initialContacts = <Contact>[
  Contact(
    id: 'c1',
    name: 'Priya Patel',
    relationship: Relationship.sibling,
    phone: '+91 98200 11420',
    initials: 'PP',
    primary: true,
    color: '#2563EB',
  ),
  Contact(
    id: 'c2',
    name: 'Rohan Shah',
    relationship: Relationship.sibling,
    phone: '+91 98111 22034',
    initials: 'RS',
    primary: false,
    color: '#3B82F6',
  ),
  Contact(
    id: 'c3',
    name: 'Meera Desai',
    relationship: Relationship.friend,
    phone: '+91 97654 88321',
    initials: 'MD',
    primary: false,
    color: '#22C55E',
  ),
  Contact(
    id: 'c4',
    name: 'Aarti Shah',
    relationship: Relationship.parent,
    phone: '+91 99099 44110',
    initials: 'AS',
    primary: false,
    color: '#F59E0B',
  ),
];

const nearbyPlaces = <NearbyPlace>[
  NearbyPlace(
    id: 'p1',
    name: 'Navrangpura Police Station',
    type: PlaceType.police,
    distance: '0.8 km',
    open: true,
    hours: 'Open 24 hours',
    phone: '100',
    address: 'Near Swastik Cross Road, Navrangpura',
  ),
  NearbyPlace(
    id: 'p2',
    name: 'Civil Hospital Ahmedabad',
    type: PlaceType.hospital,
    distance: '2.1 km',
    open: true,
    hours: 'Open 24 hours',
    phone: '108',
    address: 'Asarwa, Ahmedabad',
  ),
  NearbyPlace(
    id: 'p3',
    name: 'Apollo Pharmacy',
    type: PlaceType.pharmacy,
    distance: '0.4 km',
    open: true,
    hours: 'Open until 11:00 PM',
    phone: '+91 79 2644 2211',
    address: 'CG Road, Ahmedabad',
  ),
  NearbyPlace(
    id: 'p4',
    name: 'Ahmedabad Women\u2019s Help Center',
    type: PlaceType.helpCenter,
    distance: '1.6 km',
    open: true,
    hours: 'Open until 8:00 PM',
    phone: '181',
    address: 'Ellisbridge, Ahmedabad',
  ),
  NearbyPlace(
    id: 'p5',
    name: 'Alpha One Mall',
    type: PlaceType.safePlace,
    distance: '1.2 km',
    open: true,
    hours: 'Open until 10:00 PM',
    phone: '+91 79 4001 2345',
    address: 'Vastrapur, Ahmedabad',
  ),
  NearbyPlace(
    id: 'p6',
    name: 'Vastrapur Lake Promenade',
    type: PlaceType.safePlace,
    distance: '1.9 km',
    open: true,
    hours: 'Well-lit public area',
    phone: '',
    address: 'Vastrapur Lake, Ahmedabad',
  ),
];

const deviceActivity = <DeviceActivity>[
  DeviceActivity(id: 'a1', time: '10:42 AM', title: 'Device connected successfully'),
  DeviceActivity(id: 'a2', time: '10:30 AM', title: 'Location synchronization completed'),
  DeviceActivity(id: 'a3', time: 'Yesterday', title: 'Battery charged to 100%'),
  DeviceActivity(id: 'a4', time: 'Yesterday', title: 'Fall detection test passed'),
  DeviceActivity(id: 'a5', time: 'Mon', title: 'Firmware updated to v2.4.1'),
];

const mapCenter = MapCenter(
  latitude: 23.033863,
  longitude: 72.557267,
  latitudeDelta: 0.055,
  longitudeDelta: 0.055,
);

const userLocation = GeoPoint(
  latitude: 23.0339,
  longitude: 72.5573,
);

const safetyZones = <SafetyZone>[
  SafetyZone(
    id: 'z1',
    label: 'CG Road',
    level: RiskLevel.safe,
    latitude: 23.0348,
    longitude: 72.5585,
    radius: 520,
    x: 18,
    y: 22,
    w: 42,
    h: 28,
  ),
  SafetyZone(
    id: 'z2',
    label: 'Law Garden',
    level: RiskLevel.safe,
    latitude: 23.0308,
    longitude: 72.5632,
    radius: 480,
    x: 52,
    y: 18,
    w: 30,
    h: 22,
  ),
  SafetyZone(
    id: 'z3',
    label: 'Ashram Road',
    level: RiskLevel.moderate,
    latitude: 23.0282,
    longitude: 72.5525,
    radius: 620,
    alert: 'Moderate risk ahead',
    reason: 'Poor lighting after 9 PM and sparse foot traffic on side lanes.',
    x: 12,
    y: 54,
    w: 38,
    h: 20,
  ),
  SafetyZone(
    id: 'z4',
    label: 'Isolated stretch',
    level: RiskLevel.high,
    latitude: 23.0264,
    longitude: 72.5482,
    radius: 420,
    alert: 'High risk area nearby',
    reason: 'Isolated lane with no shops, dim street lights, and recent safety reports.',
    x: 58,
    y: 52,
    w: 28,
    h: 24,
  ),
  SafetyZone(
    id: 'z5',
    label: 'University area',
    level: RiskLevel.safe,
    latitude: 23.0382,
    longitude: 72.5518,
    radius: 540,
    x: 22,
    y: 78,
    w: 36,
    h: 16,
  ),
];

List<SafetyZone> unsafeZones([List<SafetyZone> zones = safetyZones]) {
  return zones
      .where((zone) => zone.level == RiskLevel.high || zone.level == RiskLevel.moderate)
      .toList();
}

SafetyZone? nearestUnsafeZone(
  double lat,
  double lng, [
  List<SafetyZone> zones = safetyZones,
]) {
  SafetyZone? best;
  var bestDist = double.infinity;

  for (final zone in unsafeZones(zones)) {
    final dx = zone.latitude - lat;
    final dy = zone.longitude - lng;
    final d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      best = zone;
    }
  }

  return best;
}

const destinations = <Destination>[
  Destination(id: 'd1', name: 'Home — Satellite', address: 'Jodhpur, Ahmedabad'),
  Destination(id: 'd2', name: 'Office — SG Highway', address: 'Prahlad Nagar, Ahmedabad'),
  Destination(id: 'd3', name: 'Navrangpura Police Station', address: 'Swastik, Ahmedabad'),
  Destination(id: 'd4', name: 'Alpha One Mall', address: 'Vastrapur, Ahmedabad'),
];

const routeOptions = RouteOptions(
  fastest: RouteOption(
    minutes: 15,
    risk: RiskLevel.moderate,
    label: 'Fastest',
    detail: 'Shorter path · more risk near Ashram Road',
  ),
  safest: RouteOption(
    minutes: 20,
    risk: RiskLevel.safe,
    label: 'Safest',
    detail: 'Avoids poorly lit stretches',
    recommended: true,
  ),
);

const emergencyInstructions = <EmergencyInstruction>[
  EmergencyInstruction(
    title: 'If you feel followed',
    body:
        'Move toward a populated, well-lit place. Do not go home if you believe you are being followed.',
  ),
  EmergencyInstruction(
    title: 'If you need help immediately',
    body: 'Hold SOS for 2 seconds. DURGA will share live location and alert trusted contacts.',
  ),
  EmergencyInstruction(
    title: 'If you cannot speak',
    body: 'Use silent SOS. Contacts receive your location and a silent-alert message.',
  ),
  EmergencyInstruction(
    title: 'India emergency numbers',
    body: 'Police 100 / 112 · Ambulance 108 · Women helpline 181 · Child helpline 1098',
  ),
];

const offlineCapabilities = <String>[
  'Saved trusted contacts and emergency numbers',
  'Hold-to-SOS with local alarm and flashlight',
  'Cached safety map of your last known area',
  'Offline emergency instructions',
  'Device SOS if hardware is connected',
];

final initialMessages = <ChatMessage>[welcomeMessage('')];

const quickPrompts = <String>[
  'I feel unsafe',
  'Someone is following me',
  'Find a safe place',
  'Find nearby police',
  'Find a safe route',
  'Emergency instructions',
];

const reportReasons = <ReportReason>[
  ReportReason(id: 'lighting', label: 'Poor Lighting'),
  ReportReason(id: 'suspicious', label: 'Suspicious Activity'),
  ReportReason(id: 'harassment', label: 'Harassment'),
  ReportReason(id: 'isolated', label: 'Isolated Area'),
  ReportReason(id: 'unsafe', label: 'Unsafe Environment'),
  ReportReason(id: 'other', label: 'Other'),
];

String riskLabel(RiskLevel level) {
  switch (level) {
    case RiskLevel.safe:
      return 'SAFE';
    case RiskLevel.moderate:
      return 'MODERATE RISK';
    case RiskLevel.high:
      return 'HIGH RISK';
  }
}

String riskCopy(RiskLevel level) {
  switch (level) {
    case RiskLevel.safe:
      return 'Conditions look stable. Stay aware and keep sharing off unless you need it.';
    case RiskLevel.moderate:
      return 'Stay on well-lit routes and consider sharing your live location.';
    case RiskLevel.high:
      return 'High risk nearby. Move to a populated area and alert a trusted contact.';
  }
}

ChatMessage durgaReply(String text) {
  final lower = text.toLowerCase();
  final time = _formatChatTime(DateTime.now());
  final id = 'd-${DateTime.now().millisecondsSinceEpoch}';

  if (lower.contains('follow')) {
    return ChatMessage(
      id: id,
      role: ChatRole.durga,
      time: time,
      text:
          'Stay calm. I recommend moving toward a well-lit and populated area. I can guide you to the nearest safe location.',
      actions: const [
        ChatAction(id: 'help', label: 'Nearby Help'),
        ChatAction(id: 'share', label: 'Share Live Location'),
        ChatAction(id: 'alert', label: 'Alert Contacts', variant: ChatActionVariant.emergency),
        ChatAction(id: 'call', label: 'Emergency Call', variant: ChatActionVariant.emergency),
      ],
    );
  }

  if (lower.contains('unsafe') || lower.contains('scared')) {
    return ChatMessage(
      id: id,
      role: ChatRole.durga,
      time: time,
      text:
          'I am with you. Stay on a main road if you can. Would you like me to share your live location with Priya and guide you to the nearest safe place?',
      actions: const [
        ChatAction(id: 'share', label: 'Share Live Location'),
        ChatAction(id: 'help', label: 'Nearby Help'),
        ChatAction(
          id: 'alert',
          label: 'Alert Trusted Contacts',
          variant: ChatActionVariant.emergency,
        ),
      ],
    );
  }

  if (lower.contains('police')) {
    return ChatMessage(
      id: id,
      role: ChatRole.durga,
      time: time,
      text:
          'Navrangpura Police Station is 0.8 km away and open 24 hours. I can open nearby help, or place a call to 100.',
      actions: const [
        ChatAction(id: 'nav-police', label: 'Open Nearby Help'),
        ChatAction(id: 'call', label: 'Call 100', variant: ChatActionVariant.emergency),
      ],
    );
  }

  if (lower.contains('route') || lower.contains('navigate')) {
    return ChatMessage(
      id: id,
      role: ChatRole.durga,
      time: time,
      text:
          'The map shows safety zones around you. Open it to check nearby risk, or use nearby help for police and hospitals.',
      actions: const [
        ChatAction(id: 'help', label: 'Nearby Help'),
        ChatAction(id: 'safest', label: 'Open Safety Map'),
      ],
    );
  }

  if (lower.contains('location') || lower.contains('share')) {
    return ChatMessage(
      id: id,
      role: ChatRole.durga,
      time: time,
      text:
          'Live location sharing is ready. Priya Patel (primary contact) will see your location until you stop sharing.',
      actions: const [
        ChatAction(id: 'share', label: 'Share with Priya'),
        ChatAction(id: 'share-all', label: 'Share with all contacts'),
      ],
    );
  }

  if (lower.contains('emergency') || lower.contains('instruction')) {
    return ChatMessage(
      id: id,
      role: ChatRole.durga,
      time: time,
      text:
          'If you cannot speak, hold SOS. I will share location, notify Priya, and keep a 112 call ready. Move toward light and people. Do not head home if you think you are being followed.',
      actions: const [
        ChatAction(id: 'sos', label: 'Open Emergency Mode', variant: ChatActionVariant.emergency),
      ],
    );
  }

  return ChatMessage(
    id: id,
    role: ChatRole.durga,
    time: time,
    text:
        'I am monitoring your safety. Tell me if you feel unsafe, need a route, nearby help, or want me to alert someone.',
    actions: const [
      ChatAction(id: 'help', label: 'Nearby Help'),
      ChatAction(id: 'share', label: 'Share Live Location'),
    ],
  );
}
