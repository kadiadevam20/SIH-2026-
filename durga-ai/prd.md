# DURGA AI — Frontend Product Requirements Document

**Product:** DURGA AI (Dynamic, Unified, Risk-aware Guardian AI)  
**Scope:** Frontend only — UI, UX, navigation, components, animations, local demo state  
**Audience:** Design review, engineering handoff, portfolio / demo  
**Version:** 1.1.0  
**Last updated:** 7 September 2026  
**Status:** Navigable frontend demo (mock data). Not a production backend.

| Codebase | Path | Role |
|----------|------|------|
| **Expo (current phone demo)** | `d:\druga ai\durga-ai` | React Native + Expo SDK **57** — runs in Expo Go |
| **Flutter (parallel port)** | `d:\druga ai\durga-ai-flutter` | Same cream/maroon UI in Flutter 3.47 — Chrome / later Android |
| **Canva references** | `d:\druga ai\ui design\` | Source visual language |

This document lists **everything the frontend currently includes**, not a wishlist.

---

## 1. Product overview

DURGA AI is a **women-safety companion** UI. It must feel calm and one-hand usable under stress: cream/maroon visual language, large emergency controls that cannot fire on a tap, and a guardian chat that looks intelligent even though replies are mocked.

**Brand**

- Name: DURGA AI / D.U.R.G.A  
- Tagline: Your Digital Guardian  
- Home lockup: **दुर्गा ~ She is Enough**  
- Demo city: Ahmedabad, Gujarat  

**What this frontend is**

A complete, tap-through safety-app experience: onboarding, five tabs, hold-to-SOS → emergency mode, map with risk zones, trusted contacts, device UI, settings, nearby help, report, offline.

**What this frontend is not**

No real auth server, no cloud sync, no live LLM, no real IoT firmware, no real map tiles on web, no cellular SOS to 112.

---

## 2. Goals and non-goals

### 2.1 Frontend goals (shipped)

| Goal | Status |
|------|--------|
| Cream / maroon Canva design system (Playfair + Jakarta) | Done |
| Brand splash on cold start (~1.4s) | Done |
| Onboarding: login, signup, permissions | Done |
| Extra onboarding screens (account details, emergency setup) — built | Done (not in live flow) |
| 5-tab custom bar + hold-to-SOS chrome | Done |
| Home quote stage, circle, tools, location, device strip | Done |
| Map: zones, search, safest vs fastest, HUD, report | Done |
| DURGA chat: bubbles, prompts, typing, action chips | Done |
| Contacts: search, add, edit, primary badge | Done |
| Device: battery, toggles, activity, SOS confirm | Done |
| Emergency full screen + end confirm | Done |
| Nearby help, report unsafe, offline | Done |
| Settings hub + profile / language / a11y / privacy / emergency prefs / tutorials | Done (Expo) |
| Diagonal settings modal + tab enter animations | Done (Expo) |
| Light / dark / system theme | Done |
| Local persist: onboarded flag + profile | Done |
| Expo Go SDK 57 compatibility | Done (7 Sep 2026) |
| Skip redundant SOS hold page (bar → emergency) | Done (7 Sep 2026) |

### 2.2 Non-goals (out of scope)

- Backend APIs, JWT, OTP, real GPS tracking servers  
- Real LLM / voice STT  
- Hardware firmware, BLE pairing with a real band  
- Store submission, push certificates, crash analytics  
- Full i18n (language picker is UI only)  
- Automated tests (none exist)

---

## 3. Users and usage context

**Primary user:** a woman moving through a city, often one-handed, possibly stressed.

**Moments the UI is designed for**

1. **Calm check-in** — Home quotes, circle, map glance  
2. **Unease** — DURGA chat, live location, safest route  
3. **Emergency** — hold SOS bar 1.2s → full emergency mode (no extra confirm screen)  
4. **Setup** — login, permissions, trusted contacts, device  

**Design constraints**

- SOS must not fire on a short tap  
- Emergency must be visually distinct (dark red) from the cream daily UI  
- Thumb reach: SOS lives in bottom chrome, not a sixth tab  
- Reduce motion on unfocused tabs (quote timers pause off Home)

---

## 4. Tech stack

### 4.1 Expo — `durga-ai/` (phone demo)

| Layer | Choice |
|-------|--------|
| Runtime | Expo SDK **57.0.20** (matches Expo Go SDK 57) |
| UI | React 19.2.3 + React Native 0.86.3 |
| Language | TypeScript ~6 |
| Routing | Expo Router ~57 (file-based) |
| Animation | react-native-reanimated 4.5.1 + worklets 0.10.1 |
| Storage | `@react-native-async-storage/async-storage` |
| Maps (native) | `react-native-maps` 1.27.2 |
| Maps (web) | Custom `SafetyMap` (boxes / zones) |
| Icons | `lucide-react-native` ^1.42 |
| Fonts | `@expo-google-fonts/plus-jakarta-sans`, `playfair-display` |
| Location permission plugin | `expo-location` |
| State | `AppContext` (`context/AppContext.tsx`) |

**Upgrade note:** The project was SDK 54. Store Expo Go is SDK 57. The app was upgraded on 7 Sep 2026 so the phone can open the project.

### 4.2 Flutter — `durga-ai-flutter/` (parallel UI)

| Layer | Choice |
|-------|--------|
| Framework | Flutter 3.47 + Dart 3.13 |
| Routing | go_router 14 |
| State | Provider `AppState` |
| Fonts | google_fonts |
| Icons | lucide_icons_flutter |
| Storage | shared_preferences |

Same visual spec. Flutter is missing five Expo settings sub-screens and Expo-only tab/settings animations.

---

## 5. Information architecture

```
BrandSplash (root overlay, ~1.4s)
  └─ Boot `/`
        ├─ not onboarded → Onboarding stack
        │     Login → Signup
        │     Permissions → Home tabs
        │     [built, unlinked] Account details, Emergency setup
        └─ onboarded → Tab shell
              Home | Map | DURGA | Contacts | Device
              └─ SOS bar (above tabs, not a tab)
                    Hold 1.2s → startEmergency() → /emergency

Overlays / stacks from tabs:
  Settings (transparent modal, diagonal slide on Expo)
    Profile, Instructions, Language, Accessibility
    Emergency settings, Privacy
  Trusted contact add / edit
  Nearby help, Report (modals)
  Offline
  Emergency (fade, gesture back disabled)
  /sos → silent redirect to /emergency (old hold page removed)
```

---

## 6. Design system

### 6.1 Color tokens (`theme/index.ts` / `lib/theme/app_colors.dart`)

| Token | Hex | Use |
|-------|-----|-----|
| Cream | `#F5F1E8` | App background |
| Cream deep | `#EBE1CF` | Muted surfaces |
| Maroon | `#7A1D1D` | Primary, SOS, titles |
| Maroon soft | `#A13F3C` | Accents |
| Ink | `#0F0F0F` | Body text (light) |
| Muted | `#6B5E55` | Secondary text |
| Line | `#D9CFC0` | Borders |
| Safe | `#22C55E` | Green zone / connected |
| Moderate | `#F59E0B` | Orange zone |
| High | `#C0392B` | Red zone / SOS chrome |
| Navy | `#1A1210` | Dark theme background |
| Emergency gradient | `#7F1D1D` → `#450A0A` → `#1C0508` | Emergency screen |

Light theme is the default product look. Dark theme remaps cream → navy cards.

### 6.2 Typography (`AppText`)

| Font | Weights used | Where |
|------|----------------|-------|
| Plus Jakarta Sans | 400–800 | Body, labels, buttons, tab labels |
| Playfair Display | 400–800 | दुर्गा, quotes, SOS title, brand |

### 6.3 Space, radius, elevation

- Spacing: 4 / 8 / 12 / 16 / 24 / 32
- Radius: 12 / 16 / 22 / 28 / pill (999)  
- `cardShadow(theme)` — cards  
- `softShadow(theme)` — lighter lift  

### 6.4 Recurring patterns

- Maroon pill fields (`MaroonField`) on auth  
- Cream cards, 1px cream-line borders  
- Hold-to-activate SOS (fill animation, short tap ignored)  
- Settings: Expo diagonal slide (`DiagonalSlideScreen`)  
- Tab enter: fade + translateY (`TabIconEnterView`)  
- Quote stage: animated backdrop, timers only when Home focused  

---

## 7. Global chrome (always-on UI)

### 7.1 Custom tab bar

**Files:** `components/navigation/CustomTabBar.tsx` · Flutter `custom_tab_shell.dart`

| Tab | Route | Icon |
|-----|-------|------|
| Home | `/(tabs)` / `/home` | Home |
| Map | `/(tabs)/map` | Map |
| DURGA | `/(tabs)/durga` | MessageCircle |
| Contacts | `/(tabs)/contacts` | Contact |
| Device | `/(tabs)/hardware` | Watch |

Active tab uses maroon. Tabs are `lazy` + `freezeOnBlur`. Map / DURGA / Contacts / Device wrap content in `TabIconEnterView` (Home does not). Switching away from an animated tab can run a shrink-out before navigate.

### 7.2 SOS bar (not a tab)

**Files:** `components/navigation/SOSBar.tsx` · Flutter `sos_bar.dart`

- Sits **above** the tab bar on every main tab  
- Copy: “Emergency SOS” / “Hold 1s to activate”  
- Hold **1200 ms** fills the bar; short tap does nothing (web shows an alert)  
- On complete: `startEmergency()` then **`/emergency`** (no extra hold page)  
- Aliases: `FloatingSOS`, `EmergencySOSBar` re-export the same bar  

### 7.3 Brand splash

**File:** `components/ui/BrandSplash.tsx`  
Overlay on root until fonts + ~1400 ms. Then boot redirect.

---

## 8. Screen specifications (everything we added)

### 8.1 Boot

| Item | Detail |
|------|--------|
| Route | `/` → `app/index.tsx` |
| Behavior | Wait `ready`. If not onboarded → `/onboarding`. Else → `/(tabs)`. |

### 8.2 Onboarding

| Screen | Route | What we added |
|--------|-------|----------------|
| **Login** | `/onboarding` | Welcome, maroon email/password fields, login CTA, signup link, Canva footer art (`DesignFooterArt`) |
| **Signup** | `/onboarding/signup` | Email, phone, password, create account, footer art |
| **Permissions** | `/onboarding/permissions` | GPS + notification cards; Allow (marks onboarded) or Skip (`limitedAccess`) then Home |
| **Account details** | `/onboarding/account-details` | Name, phone, city/state/area; saves profile. **Built, not linked** in the live flow |
| **Emergency setup** | `/onboarding/emergency-setup` | First trusted contact + finish. **Built, not linked** |

**Live flow today:** Login or Signup → Permissions → Home.

### 8.3 Home

**Route:** `/(tabs)` · `app/(tabs)/index.tsx`

Added on this screen:

- Header: **दुर्गा ~ She is Enough** + menu → Settings  
- Greeting (`Hi, {name}` or Welcome) and “Your safety space”  
- **Quote stage** with `QuoteBackdrop` (ribbons / glow); tap cycles quotes; auto-rotate every 9s **only while focused**  
- Status chip: “you’re covered / DURGA is watching with you”  
- **Safety circle** avatars (up to 4 + overflow) → Contacts; empty copy if none  
- **Quick tools:** Safety map, Instructions, Nearby help  
- **Live location sharing** toggle card (ON/OFF pill)  
- **Device strip** (name, battery / not connected) → Device tab  
- Rotating **safety tips** every 12s while focused  
- **Talk to DURGA** CTA → chat tab  

### 8.4 Map

**Route:** `/(tabs)/map`

- Full-bleed `SafetyMap` (native maps on device; boxed pseudo-map on web)  
- Search destinations (Home, Office, Police, Alpha One Mall)  
- Zone tap → `UnsafeZoneAlert`  
- Safest vs fastest `RouteCard`s  
- Start nav → `NavigationTurnHud` + `NavigationBottomBar`  
- Zone legend toggle  
- Report unsafe entry  
- Nearest unsafe zone helper from mock Ahmedabad polygons  

### 8.5 DURGA chat

**Route:** `/(tabs)/durga`

- `AmbientBackground` + shield header  
- `AIMessageBubble` user/guardian + `TypingBubble`  
- Composer, send, mic (mic = placeholder alert)  
- Quick prompts: I feel unsafe / followed / safe place / police / safe route / emergency instructions  
- Keyword `durgaReply()` with action chips: navigate, share location, alert contacts, emergency call  
- Alert contacts / emergency chips call `startEmergency()` and open `/emergency`  

### 8.6 Contacts

**Route:** `/(tabs)/contacts`

- Search  
- `TrustedContactCard` list with relationship, phone, primary badge  
- FAB → add  
- Row → edit  

**Add** `/trusted-contact/add` — name, phone, relationship, primary flag  
**Edit** `/trusted-contact/edit?id=` — update / remove  

Seed contacts: Priya Patel (primary), Rohan Shah, Meera Desai, Aarti Shah.

### 8.7 Device

**Route:** `/(tabs)/hardware`

- `DeviceStatusCard` (name, connection, battery)  
- Battery bar + Good / Moderate / Low  
- Toggles: SOS button, fall detection, location tracking, emergency alert  
- Connect / disconnect  
- Activity timeline from mock  
- Hardware SOS confirm modal → emergency  

### 8.8 Emergency (the real SOS experience)

**Route:** `/emergency` — fade, `gestureEnabled: false`

This is what hold-SOS opens now.

- Dark red gradient  
- Header: EMERGENCY MODE + **End**  
- Pulsing SOS orb  
- Status grid (location sharing, contacts, countdown)  
- `EmergencyTimeline` steps (SOS activated → location shared → Priya notified → services)  
- Actions: call primary, flashlight, siren (UI; flashlight/siren not wired to hardware)  
- End → confirm modal → `stopEmergency()` and back to tabs  

**Removed (7 Sep 2026):** cream “Emergency help needed? / Press or hold the button” page. That was a second hold after the bar already required a hold. `/sos` now only redirects into emergency.

### 8.9 Nearby help

**Route:** `/nearby-help` (modal)

- Map preview  
- Place cards: police, hospital, pharmacy, help center, safe place (Ahmedabad mock)  
- Navigate / call affordances  

Places include Navrangpura Police Station, Civil Hospital, Apollo Pharmacy, Women’s Help Center, plus additional mock rows.

### 8.10 Report unsafe

**Route:** `/report` (modal)

Reasons: Poor Lighting, Suspicious Activity, Harassment, Isolated Area, Unsafe Environment, Other. Note field + submit feedback (local UI).

### 8.11 Offline

**Route:** `/offline`

List of mocked offline capabilities (saved contacts, hold-SOS, cached map, instructions, device SOS). Banner component `OfflineStatusBanner` exists for other screens.

### 8.12 Settings

**Presentation (Expo):** transparent modal, `DiagonalSlideScreen` (enter top-right → bottom-left).

| Screen | Route | What we added |
|--------|-------|----------------|
| Settings home | `/settings` | Sections: Personal, Safety, Device, Privacy; offline toggle; logout → login |
| Profile | `/settings/profile` | Avatar initials, name, phone, city, generated `DURGA-…` emergency id |
| Instructions | `/settings/tutorials` | Red / orange / green zone guide (auto-record, alerts, etc. as **copy**, not live behavior) |
| Language | `/settings/language` | English / हिन्दी / ગુજરાતી picker (UI only) |
| Accessibility | `/settings/accessibility` | Theme pref, large text + reduce motion switches (local, not global) |
| Emergency settings | `/settings/emergency-settings` | Live location switch, demo safety-level control |
| Privacy | `/settings/privacy` | History / AI / precise location switches (not persisted) |

Flutter settings home + tutorials exist; the five Expo-only sub-screens are not ported.

### 8.13 Other

| Screen | Route | Notes |
|--------|-------|-------|
| Not found | `/+not-found` | Fallback |
| HTML shell | `/+html.tsx` | Web document |

---

## 9. Component library (what we added)

### 9.1 Navigation

| Component | Purpose |
|-----------|---------|
| `CustomTabBar` / `CustomTabShell` | 5 tabs + SOS bar slot |
| `SOSBar` | Hold-to-emergency strip |
| `TabIconEnterView` + `tabIconTransition` | Tab enter / exit (Expo) |
| `layoutMetrics` | Tab + SOS + safe-area heights |

### 9.2 Map

| Component | Purpose |
|-----------|---------|
| `SafetyMap` | Web / Flutter pseudo-map + zones + route |
| `SafetyMap.native` | Native MapView + polylines (Expo device) |
| `NavigationHud` | Turn card + bottom nav bar |
| `UnsafeZoneAlert` | Risk sheet |
| `RouteCard` | Safest / fastest option |
| `SafetyZoneLegend` | Zone colors |

### 9.3 UI / brand

| Component | Purpose |
|-----------|---------|
| `AppText` | Font family + weight |
| `PageHeader` / `SectionLabel` | Screen titles |
| `Screen` | Padded themed scroll shell |
| `MaroonField` | Auth inputs |
| `QuoteBackdrop` | Home quote motion |
| `BrandSplash` | Open splash |
| `DesignFooterArt` | Login/signup illustration |
| `AIMessageBubble` / `TypingBubble` | Chat |
| `AmbientBackground` | Chat cream mist |
| `EmergencyTimeline` | SOS steps |
| `DeviceStatusCard` | Band card |
| `LivingPulse` | Static status dot (no loop) |
| `FadeIn` | Stagger |
| `NearbyHelpCard` | Place row |
| `TrustedContactCard` | Contact row |
| `DiagonalSlideScreen` | Settings motion (Expo) |
| `BrandMark` / `GuardianMark` / `DurgaAIOrb` / `DurgaSilhouette` | Brand marks |
| `WelcomeAura` | Onboarding atmosphere |
| `SafetyScoreCard` / `HomeActionGrid` / `QuickActionCard` | Home building blocks (available) |
| `RiskIndicator` | Level chip |
| `SOSButton` / `AnimatedSafetyRing` | Hold button primitives (not on live SOS path) |
| `EmergencyActionButton` | Emergency action tile |
| `OfflineStatusBanner` | Offline notice |

---

## 10. State and persistence

**Expo:** `useApp()` from `context/AppContext.tsx`  
**Flutter:** `AppState` via Provider  

### Persisted (AsyncStorage / shared_preferences)

| Key | Content |
|-----|---------|
| `durga.onboarded` | Finished onboarding |
| `durga.profile` | first/last name, phone, city, state, area |

Logout clears session and returns to login.

### Runtime only

| State | Used by |
|-------|---------|
| `theme` / `themePref` | Light / dark / system |
| `limitedAccess` | Set if permissions skipped (banner not shown yet) |
| `contacts[]` | Home circle, Contacts, emergency primary |
| `device` | Hardware tab + Home strip |
| `locationSharing` | Home, emergency, settings |
| `offline` | Settings toggle / offline UI |
| `safetyLevel` / `safetyScore` | Map / emergency settings |
| `emergencyActive` / `emergencySteps` / countdown | Emergency screen |
| `messages[]` / `isTyping` | DURGA chat |
| `navigating` / `selectedRoute` / `destination` | Map HUD |

### Chat mock

`durgaReply(text)` matches keywords (`follow`, `unsafe`/`scared`, etc.) and returns canned text + action chips. Not a network LLM.

---

## 11. Mock data catalog (`data/mock.ts`)

| Dataset | Content | Screens |
|---------|---------|---------|
| Profile default | Ahmedabad / Gujarat | Profile, greeting |
| Safety snapshot | Score 82, “relatively safe”, lighting/crowd | Map / home context |
| Contacts (4) | Priya, Rohan, Meera, Aarti | Contacts, Home, Emergency |
| Nearby places (6) | Police, hospital, pharmacy, help center, … | Nearby help |
| Device activity | Timeline rows | Device |
| Map center / user location | Ahmedabad | Map |
| Safety zones | Green / orange / red polygons | Map |
| Destinations (4) | Home, office, police, mall | Map search |
| Routes | Fastest 15 min moderate; safest 20 min recommended | Map |
| Emergency instructions | Followed / cannot speak / India numbers 100, 112, 108, 181, 1098 | Chat / tutorials |
| Offline capabilities | 5 bullets | Offline |
| Quick prompts | 6 chips | DURGA |
| Report reasons | 6 reasons | Report |

---

## 12. Animations

| Motion | Where | Notes |
|--------|-------|-------|
| Splash fade | BrandSplash | Opacity |
| Quote backdrop | Home | Glow, ribbons, glyphs; **paused off-tab** |
| Quote crossfade | Home | Reanimated FadeIn / FadeOut |
| SOS bar fill | Bottom chrome | Width 0→100% over 1.2s |
| Emergency orb pulse | Emergency | Scale loop |
| Tab enter / shrink exit | Map, DURGA, Contacts, Device | Expo only |
| Settings diagonal | Settings modal | Expo only |
| FadeIn stagger | Many screens | Delay props |

**Performance choices:** `LivingPulse` is static. Home intervals stop when unfocused. Heavy loops kept off chrome.

---

## 13. Assets and copy sources

- App icon / splash: `durga-ai/assets/images/`  
- Auth footer illustrations: `assets/images/ui/login-women.png`, `signup-women.png`  
- Home tool icons / earlier hero: `assets/images/ui/home-icon-*.png`, `home-durga.png`  
- Canva comps: `ui design/`  
- Icons in UI: Lucide  

---

## 14. Flows (acceptance-style)

### 14.1 First launch

1. Splash ~1.4s  
2. Login (or Signup)  
3. Permissions allow or skip  
4. Land on Home with quote stage and SOS bar  

### 14.2 SOS (current)

1. User holds **Emergency SOS** bar ~1 second  
2. App sets emergency steps + location sharing on  
3. **Emergency mode** full screen  
4. End → confirm → tabs  

Must **not** show the cream “Press or hold the button for help” page.

### 14.3 Chat assist

1. Open DURGA  
2. Tap “I feel unsafe” or type  
3. Typing indicator then canned reply + chips  
4. Emergency chip → same emergency screen  

### 14.4 Safer route

1. Map → pick destination → Safest Route → start  
2. HUD shows mock turn copy  
3. Stop returns to search / zone UI  

---

## 15. Empty, error, and edge UI

| Situation | Behavior |
|-----------|----------|
| No contacts | Home circle copy: add trusted contacts |
| Short SOS tap | Ignored; web Alert explains hold |
| Permissions skipped | `limitedAccess` true (no Home banner yet) |
| Device disconnected | Status “Not connected”, strip on Home |
| Unknown route | `+not-found` |
| Logout | Confirm alert, clear onboarded, login |

---

## 16. Platform notes

| Surface | Notes |
|---------|--------|
| Expo Go (Android/iOS) | Must be **SDK 57**. Project upgraded from 54 for this. |
| Windows LAN | Wi-Fi profile **Private**; Node.js allowed through firewall or phone cannot finish Metro handshake |
| Expo web | Works; map is the boxed fallback, not Google tiles |
| Flutter Chrome | `flutter run -d chrome` |
| Flutter Android | Needs Android Studio SDK |

---

## 17. Limitations (honest)

| Item | Reality today |
|------|----------------|
| Data | Static Ahmedabad mocks |
| Chat | Keyword replies |
| Voice mic | Alert placeholder |
| Flashlight / alarm | Buttons only |
| Language | Picker does not swap strings |
| Accessibility switches | Not applied to global font/motion |
| Privacy switches | Not persisted |
| Account-details / emergency-setup | Built, not in onboarding path |
| `limitedAccess` | Stored, not surfaced on Home |
| Flutter settings children | Profile, language, a11y, privacy, emergency settings = Expo only |
| Tests | None |

---

## 18. Folder map

```
durga-ai/
  app/                 screens (Expo Router)
    (tabs)/            Home, Map, DURGA, Contacts, Device
    onboarding/        login, signup, permissions, (+ unlinked)
    settings/          hub + sub-screens
    trusted-contact/   add, edit
    emergency.tsx      live SOS destination
    sos.tsx            redirect only
  components/
    navigation/        tab bar, SOS bar, metrics, tab motion
    map/               SafetyMap, HUD, alerts
    ui/                design system widgets
  context/AppContext.tsx
  data/mock.ts
  theme/               colors, type, elevation
  assets/images/

durga-ai-flutter/lib/
  screens/  widgets/  providers/app_state.dart  router/app_router.dart
```

---

## 19. How to run

### Expo (phone + web)

```powershell
cd "d:\druga ai\durga-ai"
npm install
npx expo start --lan --clear
```

- Phone: Expo Go **SDK 57**, same Wi-Fi, open `exp://<PC-IP>:8081`  
- Web: `npx expo start --web`  
- Tunnel (if LAN blocked): `npm run start:phone`  

### Flutter

```powershell
$env:Path += ";C:\Users\LENOVO\Downloads\flutter_windows_3.47.2-stable\flutter\bin"
cd "d:\druga ai\durga-ai-flutter"
flutter pub get
flutter run -d chrome
```

---

## 20. Changelog (frontend work captured here)

| Date | Change |
|------|--------|
| Through 2 Sep 2026 | Full cream/maroon UI: 20+ screens, tabs, SOS bar, chat, map, contacts, device, settings, splash, Flutter port |
| 7 Sep 2026 | Expo **SDK 54 → 57** so Expo Go on phone can load the project |
| 7 Sep 2026 | Removed pointless SOS hold page; hold bar goes **straight to Emergency mode** |
| 7 Sep 2026 | This PRD rewritten to match the shipped frontend (not the old Flutter-primary / SDK 54 snapshot) |

---

## 21. Open frontend TODO

- [ ] Link `account-details` and `emergency-setup` into onboarding  
- [ ] Show a Home banner when `limitedAccess` is true  
- [ ] Persist language, privacy, accessibility; apply font scale / reduce motion  
- [ ] Port remaining settings sub-screens + diagonal motion to Flutter  
- [ ] Wire flashlight / alarm / voice or hide them  
- [ ] Snapshot tests for Home, Emergency, Map, Chat  

---

## 22. Summary

DURGA AI frontend is a **complete safety-app UI demo**:

- **25 Expo screens** (including two unlinked onboarding pages and a `/sos` redirect)  
- **5 tabs** plus a hold-to-SOS bar that opens **Emergency mode**  
- Cream/maroon Canva system, quote home, zone map, guardian chat, contacts, device, settings  
- Mock Ahmedabad data and local profile persistence  
- Phone path: **Expo SDK 57 + Expo Go 57**  
- Twin UI in Flutter for Chrome  

Suitable for design review, UX walkthrough, and frontend handoff. Not a live emergency service.

---

*End of Frontend PRD v1.1.0*
