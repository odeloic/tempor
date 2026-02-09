import * as Notifications from 'expo-notifications';
import { useReminderNotifications } from '@/hooks/useReminderNotifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export function NotificationManager() {
    useReminderNotifications();

    return null;
}
