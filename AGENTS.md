# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Expo Router screens (file-based routing, including `(tabs)/`).
- `src/components/`: Feature-oriented UI components.
- `src/atoms/`: Jotai atoms for global state.
- `src/db/`: Drizzle ORM schema, migrations, and SQLite client.
- `src/hooks/`: Custom hooks (`useTimer`, `useProjects`, etc.).
- `src/i18n/`: Translations (`locales/en.ts`) and setup.
- `src/lib/`: Utility helpers (also hosts unit tests).
- `src/theme/`: Design tokens and `ThemeProvider`.
- `src/assets/`: Images, fonts, and static assets.

## Build, Test, and Development Commands
- `npm start`: Start the Expo dev server.
- `npm run ios`: Run on iOS simulator.
- `npm run android`: Run on Android emulator.
- `npm run web`: Run the web build via Expo.
- `npm run lint`: Run ESLint (Expo config).
- `npm test`: Run Jest tests.
- `npx drizzle-kit generate`: Generate DB migrations from schema.

## Coding Style & Naming Conventions
- TypeScript with strict mode (`tsconfig.json`).
- Use theme tokens from `src/theme/tokens.ts` instead of hardcoded styles.
- Avoid hardcoded strings; use i18n via `useTranslation()` and keys in `src/i18n/locales/en.ts`.
- Keep components feature-scoped and named by purpose (e.g., `TimerCard`, `ProjectList`).

## Testing Guidelines
- Jest with `jest-expo` preset.
- Tests live alongside utilities in `src/lib/*.test.ts` (e.g., `time.test.ts`).
- Run all tests with `npm test` before submitting changes.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`).
- PRs should include:
  - A clear summary of changes.
  - Linked issue or context.
  - Screenshots or recordings for UI changes.
  - Notes on migrations or data changes (if applicable).

## Configuration & Data Notes
- Database schema lives in `src/db/schema.ts` and uses Drizzle + Expo SQLite.
- When troubleshooting migrations, see `prepareMigrations()` in `src/db/migrate.ts`.
- Use `deleteDatabase()` from `src/db/client.ts` to reset local data during development.
