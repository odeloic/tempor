---
description: Create a branch and implement a Linear task with planning, execution, and quality checks
argument-hint: <branch-name> <task-description>
hooks:
  Stop:
    - hooks:
        - type: command
          command: "./.claude/hooks/post-up-next.sh"
---

# Linear Task Implementation

**Branch:** `$1`
**Task:** $ARGUMENTS

---

## Phase 0: Branch Setup

Before doing anything else, ensure the correct branch is checked out and up to date:

1. Run `git rev-parse --abbrev-ref HEAD` to check current branch
2. If not on `$1`:
   - If branch `$1` exists: `git checkout $1`
   - If branch doesn't exist: `git checkout -b $1`
3. Update branch with latest from main: `git pull origin main`
4. Confirm you're on the correct branch before proceeding

---

## Phase 1: Planning (Before Writing Any Code)

### 1.1 Read Task Details
Review and understand the task description provided:

> $ARGUMENTS

### 1.2 Review Project Specification
Understand the overall architecture by examining:
- **Prototype reference**: `/Users/loicishimwe/workspace/projects/tempor-frontend-prototype/tempor-prototype.jsx`
- **Source structure**: `src/` directory
- **Component patterns**: `src/components/`
- **Screen patterns**: `src/app/`
- **State management**: `src/atoms/`
- **Database schema**: `src/db/schema.ts`

### 1.3 Check Related Tasks/Dependencies
Review any related Linear tasks or dependencies mentioned in the task description. Check if there are blocking tasks or related features that need coordination.

### 1.4 Create Detailed Implementation Plan

Generate a comprehensive plan with these sections:

#### Overview
- One paragraph summary of what will be implemented
- Key user-facing functionality

#### Acceptance Criteria
- Specific, testable requirements from the task
- Edge cases and error states to handle
- Success metrics

#### Technical Approach
- Architecture decisions
- File structure changes
- State management approach (Jotai atoms)
- Database changes (Drizzle ORM with expo-sqlite)

#### Component/Module Breakdown
```
- [ ] src/components/... - Description
- [ ] src/app/... - Description
- [ ] src/atoms/... - Description
- [ ] src/db/schema.ts - Schema changes
- [ ] src/hooks/... - Custom hooks
```

#### Data Models
- TypeScript interfaces needed
- Database schema changes
- Migration strategy if needed

#### Testing Strategy
- Unit tests for business logic
- Component tests using @testing-library/react-native
- Edge cases to cover

---

## Phase 2: Implementation

Follow React Native best practices and Tempor's UX principles:

### Core UX Principles

1. **Timer-First Approach**
   - Timer is the primary interaction
   - Minimize taps to start/stop tracking
   - Always show current timer state prominently

2. **Minimal Friction**
   - Quick-start from any project
   - Sensible defaults
   - Progressive disclosure of options

3. **Offline-Capable**
   - Use local SQLite database (expo-sqlite + Drizzle)
   - All data persists locally
   - No network dependencies for core features

4. **Duration Over Timestamps**
   - Store duration in seconds/minutes
   - Avoid start/end time complexity
   - Calculate display values on-demand

5. **Single Active Timer**
   - Only one timer can run at a time
   - Switching projects saves current session
   - Clear visual indication of active state

### Code Standards

- Write clean, well-documented code
- Use proper TypeScript typing throughout
- Add inline comments for complex logic only
- Create reusable components where appropriate
- Follow existing patterns in the codebase

### Code Patterns

**State Management (Jotai)**
```typescript
// src/atoms/example.ts
import { atom } from 'jotai';

export const exampleAtom = atom<ExampleType>(initialValue);

// Derived atoms for computed values
export const derivedAtom = atom((get) => {
  const data = get(exampleAtom);
  return computeValue(data);
});
```

**Database (Drizzle + expo-sqlite)**
```typescript
// src/db/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const tableName = sqliteTable('table_name', {
  id: integer().primaryKey(),
  name: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).default(sql`(unixepoch())`),
});
```

**Components**
```typescript
// Use functional components with hooks
// Extract styles to StyleSheet.create()
// Use theme tokens from @/theme/tokens
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/theme';

export function MyComponent() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { fontSize: 16 },
});
```

**Navigation (Expo Router)**
- File-based routing in `src/app/`
- Tab navigation in `src/app/(tabs)/`
- Use typed routes where possible

### Implementation Order

1. **Schema/database changes first** - Define data structures
2. **Atoms/state management second** - Set up state
3. **Hooks for data access third** - Create data layer
4. **UI components last** - Build the interface
5. **Write tests alongside each layer**

---

## Phase 3: Refactoring

After initial implementation, use the **code-simplifier** sub-agent to:

- Review for unnecessary complexity
- Suggest refactoring opportunities
- Ensure consistent patterns across the codebase
- Optimize performance where needed

Run:
```
Use the code-simplifier agent to review recent changes
```

---

## Phase 4: Summary

After implementation, provide a summary that includes:

1. **What was implemented**
   - Features added
   - User-facing changes

2. **Files created or modified**
   - List all touched files with brief descriptions

3. **Key technical decisions made**
   - Architecture choices
   - Trade-offs considered

4. **Any deviations from the original plan and why**
   - What changed during implementation
   - Reasons for changes

5. **Suggested manual testing steps**
   - How to verify the feature works
   - Edge cases to test
   - Expected behavior

---

## Quality Checks (Automatic)

When this task completes, the following checks run automatically:

1. **Stop Expo** - Kill any running Expo processes
2. **Lint** - Run ESLint checks (if configured)
3. **TypeScript** - Validate types with `tsc --noEmit`
4. **Tests** - Run test suite with Jest
5. **Clean builds** - Remove native build artifacts
6. **Restart Expo** - Start fresh with `npx expo start --ios --clear`

If any check fails, fix the issues before considering the task complete.

---

## Reference Files

Key files to reference during implementation:

| File | Purpose |
|------|---------|
| `/Users/loicishimwe/workspace/projects/tempor-frontend-prototype/tempor-prototype.jsx` | UI/UX prototype reference |
| `src/db/schema.ts` | Database schema definitions |
| `src/atoms/timer.ts` | Timer state management |
| `src/atoms/projects.ts` | Project state management |
| `src/theme/tokens.ts` | Theme and design tokens |
| `src/app/(tabs)/_layout.tsx` | Tab navigation layout |
| `src/components/ui/` | Reusable UI components |
