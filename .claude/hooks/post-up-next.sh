#!/bin/bash
# Stop hook for /up-next command - Quality Checks
# Runs when the /up-next task completes
#
# Quality checks performed:
# 1. Stop any running Expo process
# 2. Run lint checks (if configured)
# 3. Run TypeScript type checking
# 4. Run tests
# 5. Clean native build artifacts
# 6. Restart Expo with iOS simulator

set -e

# Navigate to project directory
cd "${CLAUDE_PROJECT_DIR:-/Users/loicishimwe/workspace/projects/tempor}" || {
    echo "ERROR: Could not navigate to project directory" >&2
    exit 1
}

echo "=== Running Quality Checks ==="
echo ""

# 1. Stop any running Expo processes
echo "[1/6] Stopping Expo processes..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true

# Kill processes on common Expo/Metro ports
for PORT in 8081 19000 19001 19002; do
    lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
done

# Give processes time to terminate
sleep 2
echo "      Done"
echo ""

# 2. Run ESLint (if configured)
echo "[2/6] Running lint checks..."
if [[ -f "package.json" ]] && grep -q '"lint"' package.json 2>/dev/null; then
    if ! npm run lint 2>&1; then
        echo ""
        echo "ERROR: Lint checks failed" >&2
        echo "Please fix lint errors before continuing." >&2
        exit 2
    fi
    echo "      Lint passed"
else
    echo "      No lint script found, skipping..."
fi
echo ""

# 3. Run TypeScript type checking
echo "[3/6] Running TypeScript checks..."
if ! npx tsc --noEmit 2>&1; then
    echo ""
    echo "ERROR: TypeScript type checking failed" >&2
    echo "Please fix type errors before continuing." >&2
    exit 2
fi
echo "      TypeScript passed"
echo ""

# 4. Run tests
echo "[4/6] Running tests..."
if ! npm test -- --watchAll=false --passWithNoTests 2>&1; then
    echo ""
    echo "ERROR: Tests failed" >&2
    echo "Please fix failing tests before continuing." >&2
    exit 2
fi
echo "      Tests passed"
echo ""

# 5. Clean native build artifacts
echo "[5/6] Cleaning native build artifacts..."

# iOS build artifacts
rm -rf ios/build 2>/dev/null || true
rm -rf ios/Pods 2>/dev/null || true
rm -rf ios/.build 2>/dev/null || true
rm -rf ios/DerivedData 2>/dev/null || true

# Android build artifacts
rm -rf android/build 2>/dev/null || true
rm -rf android/app/build 2>/dev/null || true
rm -rf android/.gradle 2>/dev/null || true

echo "      Native builds cleaned"
echo ""

# 6. Restart Expo with iOS simulator and cache cleared
echo "[6/6] Restarting Expo..."
echo "      Running: npx expo start --ios --clear"
echo ""

# Start Expo in background
nohup npx expo start --ios --clear > /tmp/expo-output.log 2>&1 &
EXPO_PID=$!

# Give Expo a moment to start
sleep 3

# Check if Expo started successfully
if kill -0 $EXPO_PID 2>/dev/null; then
    echo "      Expo started (PID: $EXPO_PID)"
    echo "      Log: /tmp/expo-output.log"
else
    echo "      Warning: Expo may not have started correctly"
    echo "      Check /tmp/expo-output.log for details"
fi

echo ""
echo "=== Quality Checks Complete ==="
echo ""
echo "Summary:"
echo "  - Lint:       $(grep -q '"lint"' package.json 2>/dev/null && echo "Passed" || echo "Skipped")"
echo "  - TypeScript: Passed"
echo "  - Tests:      Passed"
echo "  - Cleanup:    Done"
echo "  - Expo:       Started"
echo ""

exit 0
