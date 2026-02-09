import { useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import * as Notifications from 'expo-notifications';
import { timerStateAtom } from '@/atoms/timer';
import { settingsAtom } from '@/atoms/settings';
import { projectsAtom } from '@/atoms/projects';
import i18n from '@/i18n';

const REMINDER_NOTIFICATION_ID = 'timer-reminder';

export function useReminderNotifications() {
    const timer = useAtomValue(timerStateAtom);
    const settings = useAtomValue(settingsAtom);
    const projects = useAtomValue(projectsAtom);

    const projectName = useMemo(() => {
        if (!timer.projectId) return null;
        const project = projects.find(p => String(p.id) === String(timer.projectId));
        return project?.name ?? null;
    }, [timer.projectId, projects]);

    useEffect(() => {
        const manage = async () => {
            await Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID).catch(() => {});

            if (timer.status !== 'running' || !settings.remindersEnabled) {
                return;
            }

            const displayName = projectName ?? i18n.t('notifications.unknownProject');

            await Notifications.scheduleNotificationAsync({
                identifier: REMINDER_NOTIFICATION_ID,
                content: {
                    title: i18n.t('notifications.reminderTitle'),
                    body: i18n.t('notifications.reminderBody', { project: displayName }),
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: settings.reminderIntervalMinutes * 60,
                    repeats: true,
                },
            });
        };

        manage().catch((error) => {
            console.error('Failed to manage reminder notification:', error);
        });

        return () => {
            Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID).catch(() => {});
        };
    }, [timer.status, projectName, settings.remindersEnabled, settings.reminderIntervalMinutes]);
}
