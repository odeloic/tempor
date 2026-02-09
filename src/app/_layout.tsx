import '@/i18n';

import {
  SpaceMono_700Bold
} from '@expo-google-fonts/space-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { db } from '@/db/client';
import { prepareMigrations } from '@/db/migrate';
import migrations from '@/db/migrations/migrations';
import { initializeTimer } from '@/lib/timer';
import { NotificationManager } from '@/components/NotificationManager';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold
} from '@expo-google-fonts/dm-sans';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Provider as JotaiProvider } from 'jotai';

// Run baseline migration check before any React components render.
// This must happen before useMigrations() is called.
prepareMigrations();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const { success: migrationsReady, error: migrationsError } = useMigrations(db, migrations);
  const [fontsLoaded] = useFonts({
    SpaceMono_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold
  });

  useEffect(() => {
    if (migrationsReady) {
      initializeTimer(() => setDbReady(true));
    }
  }, [migrationsReady]);

  useEffect(() => {
    if (fontsLoaded && migrationsReady && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, migrationsReady, dbReady]);

  if (migrationsError) {
    throw migrationsError;
  }

  if (!fontsLoaded || !migrationsReady || !dbReady) {
    return null;
  }

  return <RootLayoutNav />;
}

const STACK_SCREEN_OPTIONS = { headerShown: false } as const;

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <JotaiProvider>
        <KeyboardProvider>
          <NotificationManager />
          <Stack screenOptions={STACK_SCREEN_OPTIONS}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="project/select" options={{ presentation: 'modal' }} />
            <Stack.Screen name="project/new" options={{ presentation: 'modal' }} />
          </Stack>
        </KeyboardProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
