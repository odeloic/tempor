import { REMINDER_INTERVAL_OPTIONS } from '@/atoms/settings';
import { Card } from '@/components/ui/Card';
import { AppScrollView } from '@/components/ui/AppScrollView';
import { Screen } from '@/components/ui/Screen';
import { ScreenSection } from '@/components/ui/ScreenSection';
import { useSettings } from '@/hooks/useSettings';
import { requestNotificationPermissions } from '@/lib/notifications';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { Check } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const {
        remindersEnabled,
        reminderIntervalMinutes,
        setRemindersEnabled,
        setReminderInterval,
    } = useSettings();

    const contentContainerStyle = useMemo(() => ({
        paddingTop: insets.top + spacing.xl,
        paddingBottom: 120,
    }), [insets.top]);

    const trackColor = useMemo(() => ({
        false: colors.border,
        true: colors.accent,
    }), [colors.border, colors.accent]);

    const separatorStyle = useMemo(() => ({
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    }), [colors.border]);

    const handleToggleReminders = useCallback(async (value: boolean) => {
        if (value) {
            const granted = await requestNotificationPermissions();
            if (!granted) {
                Alert.alert(
                    t('settings.title'),
                    t('settings.remindersDescription'),
                );
                return;
            }
        }
        await setRemindersEnabled(value);
    }, [setRemindersEnabled, t]);

    return (
        <Screen>
            <AppScrollView
                style={styles.container}
                contentContainerStyle={contentContainerStyle}
            >
                <ScreenSection>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        {t('settings.title')}
                    </Text>
                </ScreenSection>

                <ScreenSection style={styles.section}>
                    <Card>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleText}>
                                <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>
                                    {t('settings.remindersEnabled')}
                                </Text>
                                <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                                    {t('settings.remindersDescription')}
                                </Text>
                            </View>
                            <Switch
                                value={remindersEnabled}
                                onValueChange={handleToggleReminders}
                                trackColor={trackColor}
                            />
                        </View>
                    </Card>
                </ScreenSection>

                {remindersEnabled && (
                    <ScreenSection style={styles.section}>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                            {t('settings.reminderInterval')}
                        </Text>
                        <Card>
                            {REMINDER_INTERVAL_OPTIONS.map((minutes, index) => (
                                <Pressable
                                    key={minutes}
                                    onPress={() => setReminderInterval(minutes)}
                                    style={({ pressed }) => [
                                        styles.intervalRow,
                                        index < REMINDER_INTERVAL_OPTIONS.length - 1 && separatorStyle,
                                        { opacity: pressed ? 0.7 : 1 },
                                    ]}
                                >
                                    <Text style={[
                                        styles.intervalText,
                                        { color: colors.textPrimary },
                                    ]}>
                                        {minutes >= 60
                                            ? t('settings.intervalHours', { count: minutes / 60 })
                                            : t('settings.intervalMinutes', { count: minutes })
                                        }
                                    </Text>
                                    {reminderIntervalMinutes === minutes && (
                                        <Check size={20} color={colors.accent} />
                                    )}
                                </Pressable>
                            ))}
                        </Card>
                    </ScreenSection>
                )}
            </AppScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: spacing.lg,
    },
    title: {
        fontSize: 28,
        fontFamily: fonts.sansSemiBold,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleText: {
        flex: 1,
        marginRight: spacing.md,
    },
    toggleLabel: {
        fontSize: 16,
        fontFamily: fonts.sansMedium,
    },
    toggleDescription: {
        fontSize: 13,
        fontFamily: fonts.sans,
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 12,
        fontFamily: fonts.sansMedium,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
    },
    intervalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm + 4,
    },
    intervalText: {
        fontSize: 15,
        fontFamily: fonts.sans,
    },
});
