import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { db } from '@/db/client';
import { settings, type Settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_SETTINGS: Settings = {
    id: 1,
    remindersEnabled: false,
    reminderIntervalMinutes: 30,
};

type AppSettingsContextValue = {
    remindersEnabled: boolean;
    reminderIntervalMinutes: number;
    setRemindersEnabled: (enabled: boolean) => Promise<void>;
    setReminderInterval: (minutes: number) => Promise<void>;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: PropsWithChildren) {
    const [state, setState] = useState<Settings | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [row] = await db.select().from(settings).where(eq(settings.id, 1));
                if (!row) {
                    setState(DEFAULT_SETTINGS);
                    return;
                }

                // If reminders are enabled in DB but OS permissions were revoked, sync state
                if (row.remindersEnabled) {
                    const { status } = await Notifications.getPermissionsAsync();
                    if (status !== 'granted') {
                        await db.update(settings)
                            .set({ remindersEnabled: false })
                            .where(eq(settings.id, 1));
                        setState({ ...row, remindersEnabled: false });
                        return;
                    }
                }

                setState(row);
            } catch (error) {
                console.error('Failed to load settings:', error);
                setState(DEFAULT_SETTINGS);
            }
        };
        load();
    }, []);

    const persistSettings = useCallback(async (update: Partial<Settings>) => {
        await db.update(settings).set(update).where(eq(settings.id, 1));
    }, []);

    const setRemindersEnabled = useCallback(async (enabled: boolean) => {
        await persistSettings({ remindersEnabled: enabled });
        setState(prev => prev ? { ...prev, remindersEnabled: enabled } : prev);
    }, [persistSettings]);

    const setReminderInterval = useCallback(async (minutes: number) => {
        await persistSettings({ reminderIntervalMinutes: minutes });
        setState(prev => prev ? { ...prev, reminderIntervalMinutes: minutes } : prev);
    }, [persistSettings]);

    // Don't render children until settings are hydrated from DB
    if (!state) return null;

    return (
        <AppSettingsContext.Provider value={{
            remindersEnabled: state.remindersEnabled,
            reminderIntervalMinutes: state.reminderIntervalMinutes,
            setRemindersEnabled,
            setReminderInterval,
        }}>
            {children}
        </AppSettingsContext.Provider>
    );
}

export function useAppSettings(): AppSettingsContextValue {
    const ctx = useContext(AppSettingsContext);
    if (!ctx) {
        throw new Error('useAppSettings must be used within AppSettingsProvider');
    }
    return ctx;
}
