# TemporHQ

A cross-platform time tracking app built with Expo and React Native.

## Features

- One-tap timer with pause, resume, and stop controls
- Project-based time tracking with color-coded projects
- Manual time entry for logging forgotten hours
- Session history with project and date range filters
- Aggregated daily views grouped by project
- Edit and delete time entries
- Timer reminders via local notifications
- Light and dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- iOS Simulator (macOS) or Android Emulator
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install

```bash
npm install
```

### Run

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run web version
```

### Test & Lint

```bash
npm test            # Run tests
npm run lint        # Run ESLint
```

## Architecture

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Framework | Expo Router (file-based routing)          |
| UI        | React Native                              |
| State     | Jotai atoms                               |
| Database  | Drizzle ORM + Expo SQLite                 |
| i18n      | i18next + react-i18next                   |
| Theme     | Custom design tokens with light/dark mode |

### Project Structure

```
src/
├── app/          # Screens (Expo Router file-based routing)
├── atoms/        # Jotai state atoms
├── components/   # UI components organized by feature
├── constants/    # App constants
├── db/           # Drizzle schema and migrations
├── hooks/        # Custom hooks
├── i18n/         # Translations
├── lib/          # Utility functions
└── theme/        # Design tokens and ThemeProvider
```

## License

[MIT](LICENSE)
