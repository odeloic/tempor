import { type Settings } from '@/db/schema';
import { atom } from 'jotai';

export const settingsAtom = atom<Settings>({
    id: 1,
    remindersEnabled: false,
    reminderIntervalMinutes: 30,
});

export const REMINDER_INTERVAL_OPTIONS = [15, 30, 45, 60, 120] as const;
