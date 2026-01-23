# Tempor - Time Tracking App

Cross-platform time tracking app built with Expo Router, React Native, and TypeScript.

## Commands

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run web version
npm run lint        # ESLint
npm test            # Jest tests
npx drizzle-kit generate  # Generate DB migrations
```

## Architecture

- **Framework**: Expo Router ~6.0 (file-based routing)
- **State**: Jotai atoms (`src/atoms/`)
- **Database**: Drizzle ORM + Expo SQLite (`src/db/`)
- **i18n**: i18next + react-i18next (`src/i18n/`)
- **Theme**: Custom tokens with light/dark mode (`src/theme/`)

## Directory Structure

```
src/
├── app/          # Expo Router screens (file-based routing)
│   └── (tabs)/   # Tab navigation: index (timer), add, projects/, history/
├── atoms/        # Jotai state atoms (timer, projects, sessions)
├── components/   # UI components organized by feature
├── constants/    # App constants (colors, db, tabs)
├── db/           # Drizzle schema and migrations
├── hooks/        # Custom hooks (useTimer, useProjects, etc.)
├── i18n/         # Translations (locales/en.ts)
├── lib/          # Utility functions
└── theme/        # Design tokens and ThemeProvider
```

## Design System

**ALWAYS use theme tokens from `src/theme/tokens.ts`** - never hardcode values.

```typescript
import { useTheme } from '@/theme/ThemeProvider';
const { colors, fonts, spacing, radii, statusColors } = useTheme();
```

### Colors (`colors.light` / `colors.dark`)
- `background`, `surface`, `textPrimary`, `textSecondary`, `border`, `destructive`

### Status Colors
- `running`: #2A9D8F (teal)
- `paused`: #F4A261 (orange)

### Project Colors (`src/constants/colors.ts`)
```typescript
import { projectColors } from '@/constants/colors';
// ['#E63946', '#F4A261', '#2A9D8F', '#264653', '#7209B7', '#3A86FF', '#FB5607', '#8338EC']
```

### Fonts
- `mono`: SpaceMono_700Bold (timer display)
- `sans`: DMSans_400Regular (body)
- `sansMedium`: DMSans_500Medium (headings)
- `sansSemiBold`: DMSans_600SemiBold (emphasis)

### Spacing
`xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48`

### Border Radii
`sm: 8, md: 12, lg: 16, full: 9999`

## i18n - REQUIRED

**NEVER use hardcoded strings** - always use translations.

```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

// Usage
t('timer.start')
t('timer.savedToast', { duration, project: projectName }) // with interpolation
```

Translations are in `src/i18n/locales/en.ts`, organized by feature:
- `tabs.*`, `timer.*`, `projects.*`, `history.*`, `addEntry.*`, `form.*`, `common.*`

## Database Schema (`src/db/schema.ts`)

- **projects**: id, name, color, createdAt, updatedAt, lastUsedAt
- **sessions**: id, projectId (FK), date, duration (seconds), note, createdAt, updatedAt
- **timerState**: singleton for persisting timer state

## Database Troubleshooting

### Finding the SQLite Database (iOS Simulator)

```bash
# Find the database file
find ~/Library/Developer/CoreSimulator/Devices -name "tempor.db" 2>/dev/null

# Query the database directly
sqlite3 "<path-from-above>" "SELECT name FROM sqlite_master WHERE type='table';"
```

### Migration Issues

If migrations fail with "table already exists" errors, the database was likely created before the migration system was set up. The `prepareMigrations()` function in `src/db/migrate.ts` handles this by detecting existing tables and seeding the `__drizzle_migrations` tracking table.

To manually check migration state:
```bash
sqlite3 "<db-path>" "SELECT * FROM __drizzle_migrations;"
```

To reset migration tracking (for debugging):
```bash
sqlite3 "<db-path>" "DROP TABLE IF EXISTS __drizzle_migrations;"
```

For development, use `deleteDatabase()` from `src/db/client.ts` to completely reset the database (requires app restart).

## Key Patterns

1. **State management**: Use Jotai atoms for global state, refresh functions to sync with DB
2. **Components**: Feature-organized in `src/components/` (Timer/, Project/, History/, etc.)
3. **Hooks**: Business logic in custom hooks (`useTimer`, `useProjects`, `useTimeEntries`)
4. **Routing**: File-based with Expo Router - `[id].tsx` for dynamic routes

## Skills Reference

When implementing React Native, React, or Expo features, reference these skills for best practices:
- `expo-app-design:building-ui` - Expo Router UI patterns
- `expo-app-design:data-fetching` - Network requests and caching
- `expo-app-design:tailwind-setup` - Styling setup
- `react-native-best-practices:react-native-best-practices` - Performance optimization
- `vercel-react-best-practices` - React patterns
