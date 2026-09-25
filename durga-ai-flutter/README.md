# DURGA AI — Flutter

Flutter port of the DURGA AI women-safety app. **Same UI** as the Expo/React Native version — only the technology stack changed.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Flutter 3.x |
| Language | Dart |
| Routing | go_router |
| State | Provider |
| Fonts | google_fonts (Plus Jakarta Sans + Playfair Display) |
| Icons | lucide_icons |
| Storage | shared_preferences |

## Prerequisites

1. Install [Flutter SDK](https://docs.flutter.dev/get-started/install)
2. Add Flutter to your PATH
3. Run `flutter doctor` to verify setup

## First-time setup

```bash
cd "d:\druga ai\durga-ai-flutter"

# Generate android/ios/web platform folders (if missing)
flutter create . --project-name durga_ai

# Install dependencies
flutter pub get

# Run on connected device or emulator
flutter run
```

## Project structure

```
lib/
├── main.dart              # App entry
├── router/app_router.dart # go_router routes
├── theme/                 # Cream/maroon colors
├── data/                  # Models + mock data
├── providers/app_state.dart
├── widgets/               # Reusable UI (SOS bar, quote backdrop, etc.)
└── screens/               # All screens (onboarding, tabs, SOS, settings)
```

## Screens (same as Expo app)

- Login / Signup / Permissions
- Home, Map, DURGA, Contacts, Device (tabs)
- SOS → Emergency flow
- Settings, Nearby Help, Report, Offline
- Instructions (safety zones)

## Assets

Images copied from `durga-ai/assets/images/` — login/signup footer art, icons, splash.

## Original app

The React Native (Expo) version remains at `../durga-ai/` for reference.
