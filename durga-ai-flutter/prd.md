# DURGA AI — Frontend PRD (Flutter)

**Scope:** Flutter port of the same UI  
**Technology:** Flutter 3.47 + Dart 3.13  
**Project:** `d:\druga ai\durga-ai-flutter`  
**Reference UI:** `d:\druga ai\durga-ai` (Expo SDK 57 — current phone demo)  
**Full PRD:** See `d:\druga ai\durga-ai\prd.md` v1.1.0 for complete screens, design system, SOS flow, and inventory  
**Last updated:** 7 September 2026

**SOS (matches Expo):** hold the SOS bar 1.2s → `/emergency`. The extra cream hold page is removed; `/sos` redirects.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Flutter 3.47 (stable) |
| Language | Dart 3.13 |
| Routing | go_router 14 |
| State | Provider (`AppState` / `ChangeNotifier`) |
| Fonts | google_fonts (Plus Jakarta Sans + Playfair Display) |
| Icons | lucide_icons_flutter |
| Storage | shared_preferences |
| Permissions | permission_handler |
| SVG | flutter_svg |

---

## Design System (unchanged from Expo)

| Token | Hex | Use |
|-------|-----|-----|
| Cream | `#F5F1E8` | Background |
| Maroon | `#7A1D1D` | Primary, SOS, buttons |
| Ink | `#0F0F0F` | Text |
| Muted | `#6B5E55` | Secondary text |
| Safe | `#22C55E` | Low risk |
| Moderate | `#F59E0B` | Medium risk |
| High | `#C0392B` | High risk |

**Typography:** Plus Jakarta Sans (body) · Playfair Display (brand, quotes)  
**Canva references:** `d:\druga ai\ui design\1.png` – `7.png`

---

## Screens (Flutter status)

| Screen | Route | Status |
|--------|-------|--------|
| Boot | `/` | Done |
| Login | `/onboarding` | Done |
| Signup | `/onboarding/signup` | Done |
| Permissions | `/onboarding/permissions` | Done |
| Home | `/home` | Done |
| Map | `/map` | Done |
| DURGA Chat | `/durga` | Done |
| Contacts | `/contacts` | Done |
| Device | `/hardware` | Done |
| SOS | `/sos` | Done |
| Emergency | `/emergency` | Done |
| Nearby Help | `/nearby-help` | Done |
| Report | `/report` | Done |
| Offline | `/offline` | Done |
| Settings | `/settings` | Done |
| Instructions | `/settings/tutorials` | Done |
| Add / Edit Contact | `/trusted-contact/*` | Done |
| Profile, Language, Accessibility, Privacy, Emergency Settings | — | Expo only (not yet ported) |

---

## Run

**1. Add Flutter to PATH** (if `flutter` not recognized):

```powershell
$env:Path += ";C:\Users\LENOVO\Downloads\flutter_windows_3.47.2-stable\flutter\bin"
```

**2. Build and run:**

```powershell
cd "d:\druga ai\durga-ai-flutter"
flutter create . --project-name durga_ai   # first time only
flutter pub get
flutter run -d chrome
```

| Platform | Command |
|----------|---------|
| Web | `flutter run -d chrome` |
| Android | `flutter run` (needs Android Studio) |
| iOS | `flutter run` (macOS only) |

---

## Folder Structure

```
lib/
├── main.dart
├── router/app_router.dart
├── providers/app_state.dart
├── theme/app_colors.dart
├── data/mock_data.dart
├── screens/          # onboarding, tabs, sos, emergency, settings, …
└── widgets/          # SOSBar, CustomTabShell, QuoteBackdrop, SafetyMap, …
```

---

## Remaining Flutter TODO

- [ ] Port settings sub-screens (profile, language, accessibility, privacy, emergency-settings)
- [ ] Port diagonal settings slide animation from Expo
- [ ] Android build setup (Android Studio + SDK)
