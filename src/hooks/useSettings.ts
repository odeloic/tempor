import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import * as Notifications from 'expo-notifications';
import { settingsAtom } from '@/atoms/settings';
import { db } from '@/db/client';
import { settings, type Settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export function useSettings() {
    const [state, setState] = useAtom(settingsAtom);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [row] = await db.select().from(settings).where(eq(settings.id, 1));
                if (!row) return;

                // If reminders are enabled in DB but permissions were revoked, sync state
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
            }
        };
        loadSettings();
    }, [setState]);

    const persistSettings = useCallback(async (newState: Partial<Settings>) => {
        await db.update(settings).set(newState).where(eq(settings.id, 1));
    }, []);

    const setRemindersEnabled = useCallback(async (enabled: boolean) => {
        const update = { remindersEnabled: enabled };
        await persistSettings(update);
        setState(prev => ({ ...prev, ...update }));
    }, [setState, persistSettings]);

    const setReminderInterval = useCallback(async (minutes: number) => {
        const update = { reminderIntervalMinutes: minutes };
        await persistSettings(update);
        setState(prev => ({ ...prev, ...update }));
    }, [setState, persistSettings]);

    return {
        remindersEnabled: state.remindersEnabled,
        reminderIntervalMinutes: state.reminderIntervalMinutes,
        setRemindersEnabled,
        setReminderInterval,
    };
}
