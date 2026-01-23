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
import { ThemeProvider } from '@/theme/ThemeProvider';
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
    console.error('Migration error:', migrationsError);
  }

  if (!fontsLoaded || !migrationsReady || !dbReady) {
    return null;
  }


  // const [loaded, error] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  //   ...FontAwesome.font,
  // });

  // // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    <ThemeProvider>
      <JotaiProvider>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="project/new" options={{ presentation: 'modal' }} />
        </Stack>
      </JotaiProvider>
    </ThemeProvider>
  );
}
