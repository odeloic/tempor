import * as Notifications from 'expo-notifications';

export async function requestNotificationPermissions(): Promise<boolean> {
    try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === 'granted') return true;

        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Failed to request notification permissions:', error);
        return false;
    }
}
