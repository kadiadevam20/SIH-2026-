enum RiskLevel {
  safe,
  moderate,
  high,
}

enum Relationship {
  parent('Parent'),
  sibling('Sibling'),
  friend('Friend'),
  partner('Partner'),
  other('Other');

  const Relationship(this.label);
  final String label;
}

enum PlaceType {
  police('police'),
  hospital('hospital'),
  pharmacy('pharmacy'),
  helpCenter('help-center'),
  safePlace('safe-place');

  const PlaceType(this.value);
  final String value;
}

enum ChatRole {
  user,
  durga,
}

enum ChatActionVariant {
  emergency,
  defaultVariant,
}

enum EmergencyStepStatus {
  done,
  pending,
  active,
}

class Contact {
  const Contact({
    required this.id,
    required this.name,
    required this.relationship,
    required this.phone,
    required this.initials,
    required this.primary,
    required this.color,
  });

  final String id;
  final String name;
  final Relationship relationship;
  final String phone;
  final String initials;
  final bool primary;
  final String color;

  Contact copyWith({
    String? id,
    String? name,
    Relationship? relationship,
    String? phone,
    String? initials,
    bool? primary,
    String? color,
  }) =>
      Contact(
        id: id ?? this.id,
        name: name ?? this.name,
        relationship: relationship ?? this.relationship,
        phone: phone ?? this.phone,
        initials: initials ?? this.initials,
        primary: primary ?? this.primary,
        color: color ?? this.color,
      );
}

class NearbyPlace {
  const NearbyPlace({
    required this.id,
    required this.name,
    required this.type,
    required this.distance,
    required this.open,
    required this.hours,
    required this.phone,
    required this.address,
  });

  final String id;
  final String name;
  final PlaceType type;
  final String distance;
  final bool open;
  final String hours;
  final String phone;
  final String address;
}

class DeviceActivity {
  const DeviceActivity({
    required this.id,
    required this.time,
    required this.title,
    this.detail,
  });

  final String id;
  final String time;
  final String title;
  final String? detail;
}

class ChatAction {
  const ChatAction({
    required this.id,
    required this.label,
    this.variant,
  });

  final String id;
  final String label;
  final ChatActionVariant? variant;
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.role,
    required this.text,
    required this.time,
    this.actions,
  });

  final String id;
  final ChatRole role;
  final String text;
  final String time;
  final List<ChatAction>? actions;
}

class UserProfile {
  const UserProfile({
    required this.firstName,
    required this.lastName,
    required this.fullName,
    required this.phone,
    required this.city,
    required this.state,
    required this.area,
  });

  final String firstName;
  final String lastName;
  final String fullName;
  final String phone;
  final String city;
  final String state;
  final String area;

  Map<String, String> toJson() => {
        'firstName': firstName,
        'lastName': lastName,
        'fullName': fullName,
        'phone': phone,
        'city': city,
        'state': state,
        'area': area,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        firstName: json['firstName'] as String? ?? '',
        lastName: json['lastName'] as String? ?? '',
        fullName: json['fullName'] as String? ?? '',
        phone: json['phone'] as String? ?? '',
        city: json['city'] as String? ?? 'Ahmedabad',
        state: json['state'] as String? ?? 'Gujarat',
        area: json['area'] as String? ?? '',
      );
}

class SafetyZone {
  const SafetyZone({
    required this.id,
    required this.label,
    required this.level,
    required this.latitude,
    required this.longitude,
    required this.radius,
    this.alert,
    this.reason,
    required this.x,
    required this.y,
    required this.w,
    required this.h,
  });

  final String id;
  final String label;
  final RiskLevel level;
  final double latitude;
  final double longitude;
  final double radius;
  final String? alert;
  final String? reason;
  final double x;
  final double y;
  final double w;
  final double h;
}

class EmergencyStep {
  const EmergencyStep({
    required this.id,
    required this.label,
    required this.status,
  });

  final String id;
  final String label;
  final EmergencyStepStatus status;

  EmergencyStep copyWith({EmergencyStepStatus? status}) => EmergencyStep(
        id: id,
        label: label,
        status: status ?? this.status,
      );
}

class DeviceSettings {
  const DeviceSettings({
    required this.connected,
    required this.name,
    required this.battery,
    required this.connection,
    required this.sosButton,
    required this.fallDetection,
    required this.locationTracking,
    required this.emergencyAlert,
  });

  final bool connected;
  final String name;
  final int battery;
  final String connection;
  final bool sosButton;
  final bool fallDetection;
  final bool locationTracking;
  final bool emergencyAlert;

  DeviceSettings copyWith({
    bool? connected,
    String? name,
    int? battery,
    String? connection,
    bool? sosButton,
    bool? fallDetection,
    bool? locationTracking,
    bool? emergencyAlert,
  }) =>
      DeviceSettings(
        connected: connected ?? this.connected,
        name: name ?? this.name,
        battery: battery ?? this.battery,
        connection: connection ?? this.connection,
        sosButton: sosButton ?? this.sosButton,
        fallDetection: fallDetection ?? this.fallDetection,
        locationTracking: locationTracking ?? this.locationTracking,
        emergencyAlert: emergencyAlert ?? this.emergencyAlert,
      );
}
