export type RiskLevel = 'safe' | 'moderate' | 'high';

export type Relationship = 'Parent' | 'Sibling' | 'Friend' | 'Partner' | 'Other';

export type Contact = {
  id: string;
  name: string;
  relationship: Relationship;
  phone: string;
  initials: string;
  primary: boolean;
  color: string;
};

export type NearbyPlace = {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'pharmacy' | 'help-center' | 'safe-place';
  distance: string;
  open: boolean;
  hours: string;
  phone: string;
  address: string;
};

export type DeviceActivity = {
  id: string;
  time: string;
  title: string;
  detail?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'durga';
  text: string;
  time: string;
  actions?: { id: string; label: string; variant?: 'emergency' | 'default' }[];
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  area: string;
};

export const defaultUserProfile: UserProfile = {
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  city: 'Ahmedabad',
  state: 'Gujarat',
  area: '',
};

/** @deprecated use defaultUserProfile from context */
export const userProfile = {
  firstName: 'Ananya',
  lastName: 'Shah',
  fullName: 'Ananya Shah',
  phone: '+91 98765 43210',
  city: 'Ahmedabad',
  state: 'Gujarat',
  area: 'Navrangpura, Ahmedabad',
};

export function buildFullName(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
}

export function welcomeMessage(firstName: string): ChatMessage {
  const name = firstName.trim() || 'there';
  return {
    id: 'm1',
    role: 'durga',
    text: `Hi ${name}. I'm DURGA. I can help with nearby help, live sharing, or emergency guidance. What do you need?`,
    time: '9:41 AM',
    actions: [
      { id: 'help', label: 'Nearby help' },
      { id: 'safest', label: 'Safety map' },
      { id: 'share', label: 'Share location' },
    ],
  };
}

export const safetySnapshot = {
  level: 'safe' as RiskLevel,
  score: 82,
  area: 'Ahmedabad, Gujarat',
  explanation:
    'Your current area appears relatively safe based on available environmental and location data.',
  lighting: 'Well-lit streets',
  crowd: 'Moderate foot traffic',
  lastUpdated: '2 min ago',
};

export const initialContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Priya Patel',
    relationship: 'Sibling',
    phone: '+91 98200 11420',
    initials: 'PP',
    primary: true,
    color: '#2563EB',
  },
  {
    id: 'c2',
    name: 'Rohan Shah',
    relationship: 'Sibling',
    phone: '+91 98111 22034',
    initials: 'RS',
    primary: false,
    color: '#3B82F6',
  },
  {
    id: 'c3',
    name: 'Meera Desai',
    relationship: 'Friend',
    phone: '+91 97654 88321',
    initials: 'MD',
    primary: false,
    color: '#22C55E',
  },
  {
    id: 'c4',
    name: 'Aarti Shah',
    relationship: 'Parent',
    phone: '+91 99099 44110',
    initials: 'AS',
    primary: false,
    color: '#F59E0B',
  },
];

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'p1',
    name: 'Navrangpura Police Station',
    type: 'police',
    distance: '0.8 km',
    open: true,
    hours: 'Open 24 hours',
    phone: '100',
    address: 'Near Swastik Cross Road, Navrangpura',
  },
  {
    id: 'p2',
    name: 'Civil Hospital Ahmedabad',
    type: 'hospital',
    distance: '2.1 km',
    open: true,
    hours: 'Open 24 hours',
    phone: '108',
    address: 'Asarwa, Ahmedabad',
  },
  {
    id: 'p3',
    name: 'Apollo Pharmacy',
    type: 'pharmacy',
    distance: '0.4 km',
    open: true,
    hours: 'Open until 11:00 PM',
    phone: '+91 79 2644 2211',
    address: 'CG Road, Ahmedabad',
  },
  {
    id: 'p4',
    name: 'Ahmedabad Women’s Help Center',
    type: 'help-center',
    distance: '1.6 km',
    open: true,
    hours: 'Open until 8:00 PM',
    phone: '181',
    address: 'Ellisbridge, Ahmedabad',
  },
  {
    id: 'p5',
    name: 'Alpha One Mall',
    type: 'safe-place',
    distance: '1.2 km',
    open: true,
    hours: 'Open until 10:00 PM',
    phone: '+91 79 4001 2345',
    address: 'Vastrapur, Ahmedabad',
  },
  {
    id: 'p6',
    name: 'Vastrapur Lake Promenade',
    type: 'safe-place',
    distance: '1.9 km',
    open: true,
    hours: 'Well-lit public area',
    phone: '',
    address: 'Vastrapur Lake, Ahmedabad',
  },
];

export const deviceActivity: DeviceActivity[] = [
  { id: 'a1', time: '10:42 AM', title: 'Device connected successfully' },
  { id: 'a2', time: '10:30 AM', title: 'Location synchronization completed' },
  { id: 'a3', time: 'Yesterday', title: 'Battery charged to 100%' },
  { id: 'a4', time: 'Yesterday', title: 'Fall detection test passed' },
  { id: 'a5', time: 'Mon', title: 'Firmware updated to v2.4.1' },
];

export type SafetyZone = {
  id: string;
  label: string;
  level: RiskLevel;
  latitude: number;
  longitude: number;
  radius: number;
  alert?: string;
  reason?: string;
  /** Web / fallback layout */
  x: number;
  y: number;
  w: number;
  h: number;
};

export const mapCenter = {
  latitude: 23.033863,
  longitude: 72.557267,
  latitudeDelta: 0.055,
  longitudeDelta: 0.055,
};

export const userLocation = {
  latitude: 23.0339,
  longitude: 72.5573,
};

export const safetyZones: SafetyZone[] = [
  {
    id: 'z1',
    label: 'CG Road',
    level: 'safe',
    latitude: 23.0348,
    longitude: 72.5585,
    radius: 520,
    x: 18,
    y: 22,
    w: 42,
    h: 28,
  },
  {
    id: 'z2',
    label: 'Law Garden',
    level: 'safe',
    latitude: 23.0308,
    longitude: 72.5632,
    radius: 480,
    x: 52,
    y: 18,
    w: 30,
    h: 22,
  },
  {
    id: 'z3',
    label: 'Ashram Road',
    level: 'moderate',
    latitude: 23.0282,
    longitude: 72.5525,
    radius: 620,
    alert: 'Moderate risk ahead',
    reason: 'Poor lighting after 9 PM and sparse foot traffic on side lanes.',
    x: 12,
    y: 54,
    w: 38,
    h: 20,
  },
  {
    id: 'z4',
    label: 'Isolated stretch',
    level: 'high',
    latitude: 23.0264,
    longitude: 72.5482,
    radius: 420,
    alert: 'High risk area nearby',
    reason: 'Isolated lane with no shops, dim street lights, and recent safety reports.',
    x: 58,
    y: 52,
    w: 28,
    h: 24,
  },
  {
    id: 'z5',
    label: 'University area',
    level: 'safe',
    latitude: 23.0382,
    longitude: 72.5518,
    radius: 540,
    x: 22,
    y: 78,
    w: 36,
    h: 16,
  },
];

export function unsafeZones(zones: SafetyZone[] = safetyZones) {
  return zones.filter((z) => z.level === 'high' || z.level === 'moderate');
}

export function nearestUnsafeZone(
  lat: number,
  lng: number,
  zones: SafetyZone[] = safetyZones
): SafetyZone | null {
  let best: SafetyZone | null = null;
  let bestDist = Infinity;
  for (const zone of unsafeZones(zones)) {
    const d = Math.hypot(zone.latitude - lat, zone.longitude - lng);
    if (d < bestDist) {
      bestDist = d;
      best = zone;
    }
  }
  return best;
}

export const destinations = [
  { id: 'd1', name: 'Home — Satellite', address: 'Jodhpur, Ahmedabad' },
  { id: 'd2', name: 'Office — SG Highway', address: 'Prahlad Nagar, Ahmedabad' },
  { id: 'd3', name: 'Navrangpura Police Station', address: 'Swastik, Ahmedabad' },
  { id: 'd4', name: 'Alpha One Mall', address: 'Vastrapur, Ahmedabad' },
];

/** Demo route options for map destination sheet */
export const routeOptions = {
  fastest: {
    minutes: 15,
    risk: 'moderate' as RiskLevel,
    label: 'Fastest',
    detail: 'Shorter path · more risk near Ashram Road',
  },
  safest: {
    minutes: 20,
    risk: 'safe' as RiskLevel,
    label: 'Safest',
    detail: 'Avoids poorly lit stretches',
    recommended: true as const,
  },
};

export const emergencyInstructions = [
  {
    title: 'If you feel followed',
    body: 'Move toward a populated, well-lit place. Do not go home if you believe you are being followed.',
  },
  {
    title: 'If you need help immediately',
    body: 'Hold SOS for 2 seconds. DURGA will share live location and alert trusted contacts.',
  },
  {
    title: 'If you cannot speak',
    body: 'Use silent SOS. Contacts receive your location and a silent-alert message.',
  },
  {
    title: 'India emergency numbers',
    body: 'Police 100 / 112 · Ambulance 108 · Women helpline 181 · Child helpline 1098',
  },
];

export const offlineCapabilities = [
  'Saved trusted contacts and emergency numbers',
  'Hold-to-SOS with local alarm and flashlight',
  'Cached safety map of your last known area',
  'Offline emergency instructions',
  'Device SOS if hardware is connected',
];

export const initialMessages: ChatMessage[] = [welcomeMessage('')];

export const quickPrompts = [
  'I feel unsafe',
  'Someone is following me',
  'Find a safe place',
  'Find nearby police',
  'Emergency instructions',
];

export const reportReasons = [
  { id: 'lighting', label: 'Poor Lighting' },
  { id: 'suspicious', label: 'Suspicious Activity' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'isolated', label: 'Isolated Area' },
  { id: 'unsafe', label: 'Unsafe Environment' },
  { id: 'other', label: 'Other' },
];

export function riskLabel(level: RiskLevel) {
  if (level === 'safe') return 'SAFE';
  if (level === 'moderate') return 'MODERATE RISK';
  return 'HIGH RISK';
}

export function riskCopy(level: RiskLevel) {
  if (level === 'safe') return 'Conditions look stable. Stay aware and keep sharing off unless you need it.';
  if (level === 'moderate') return 'Stay on well-lit routes and consider sharing your live location.';
  return 'High risk nearby. Move to a populated area and alert a trusted contact.';
}

export function greetingForHour(hour: number) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
