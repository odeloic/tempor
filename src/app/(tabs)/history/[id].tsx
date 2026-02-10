import { type Session } from '@/atoms/sessions';
import { timerStateAtom } from '@/atoms/timer';
import { useProjects } from '@/hooks/useProjects';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { hoursMinutesToSeconds } from '@/lib/time';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScreenSection } from '@/components/ui/ScreenSection';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { projects } = useProjects();
  const { getEntry, update, remove, refresh } = useTimeEntries();
  const timerState = useAtomValue(timerStateAtom);
  const tabBarHeight = useBottomTabBarHeight();

  const [entry, setEntry] = useState<Session | null>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const entryId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (entryId) {
      const foundEntry = getEntry(entryId);
      if (foundEntry) {
        setEntry(foundEntry);
        setProjectId(foundEntry.projectId);
        setDate(foundEntry.date);
        const totalMinutes = Math.floor(foundEntry.duration / 60);
        setHours(Math.floor(totalMinutes / 60));
        setMinutes(totalMinutes % 60);
        setNote(foundEntry.note ?? '');
      }
    }
  }, [entryId, getEntry]);

  const isTimerRunning = timerState.status !== 'idle';

  const duration = hoursMinutesToSeconds(hours, minutes);
  const isValid = projectId && duration > 0;
  const hasChanges =
    entry &&
    (projectId !== entry.projectId ||
      date.getTime() !== entry.date.getTime() ||
      duration !== entry.duration ||
      (note || '') !== (entry.note || ''));

  const handleSave = useCallback(async () => {
    if (!entryId || !isValid || isSaving) return;

    setIsSaving(true);
    try {
      await update(entryId, {
        projectId,
        date,
        duration,
        note: note.trim() || null,
      });
      await refresh();
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('editEntry.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  }, [entryId, isValid, isSaving, projectId, date, duration, note, update, refresh, router, t]);

  const handleDelete = useCallback(async () => {
    if (!entryId) return;

    try {
      await remove(entryId);
      await refresh();
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('editEntry.deleteFailed'));
    }
  }, [entryId, remove, refresh, router, t]);

  const handleDateChange = useCallback(
    (_event: unknown, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    },
    []
  );

  const formatDisplayDate = (d: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return t('date.today');
    if (d.toDateString() === yesterday.toDateString()) return t('date.yesterday');

    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!entry) {
    return (
      <Screen style={[styles.container, styles.centered]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('editEntry.entryNotFound')}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: 120 },
        ]}
        bottomOffset={tabBarHeight}
        keyboardShouldPersistTaps="handled"
      >
          <ScreenHeader
            title={t('editEntry.title')}
            onBack={() => router.back()}
            style={{ marginBottom: spacing.xl }}
          />

          <ScreenSection>
          {/* Timer Warning */}
          {isTimerRunning && (
            <View
              style={[styles.warningBanner, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                {t('editEntry.timerWarning')}
              </Text>
            </View>
          )}

          {/* Project Selector */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t('form.project')}
            </Text>
            <View style={styles.projectList}>
              {projects.map((p) => {
                const isSelected = String(p.id) === projectId;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => !isTimerRunning && setProjectId(String(p.id))}
                    disabled={isTimerRunning}
                    style={({ pressed }) => [
                      styles.projectOption,
                      {
                        borderColor: isSelected
                          ? colors.textPrimary
                          : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                        backgroundColor: colors.surface,
                        opacity: pressed ? 0.8 : isTimerRunning ? 0.5 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[styles.projectDot, { backgroundColor: p.color }]}
                    />
                    <Text
                      style={[styles.projectName, { color: colors.textPrimary }]}
                    >
                      {p.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

      {/* Date Picker */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('form.date')}
        </Text>
        <Pressable
          onPress={() => !isTimerRunning && setShowDatePicker(true)}
          disabled={isTimerRunning}
          style={({ pressed }) => [
            styles.dateButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : isTimerRunning ? 0.5 : 1,
            },
          ]}
        >
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>
            {formatDisplayDate(date)}
          </Text>
          <Text style={[styles.dateSubtext, { color: colors.textSecondary }]}>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      {/* Duration */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('form.duration')}
        </Text>
        <View style={styles.durationRow}>
          <View style={styles.durationInput}>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: isTimerRunning ? 0.5 : 1,
                },
              ]}
            >
              <TextInput
                value={hours > 0 ? String(hours) : ''}
                onChangeText={(text) => {
                  const val = parseInt(text, 10);
                  setHours(isNaN(val) ? 0 : Math.max(0, Math.min(23, val)));
                }}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                editable={!isTimerRunning}
                style={[
                  styles.durationTextInput,
                  { color: colors.textPrimary },
                ]}
              />
              <Text
                style={[styles.durationUnit, { color: colors.textSecondary }]}
              >
                {t('duration.hrs')}
              </Text>
            </View>
          </View>
          <View style={styles.durationInput}>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: isTimerRunning ? 0.5 : 1,
                },
              ]}
            >
              <TextInput
                value={minutes > 0 ? String(minutes) : ''}
                onChangeText={(text) => {
                  const val = parseInt(text, 10);
                  setMinutes(isNaN(val) ? 0 : Math.max(0, Math.min(59, val)));
                }}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                editable={!isTimerRunning}
                style={[
                  styles.durationTextInput,
                  { color: colors.textPrimary },
                ]}
              />
              <Text
                style={[styles.durationUnit, { color: colors.textSecondary }]}
              >
                {t('duration.min')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('form.note')}{' '}
          <Text style={styles.optionalText}>{t('form.optional')}</Text>
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t('form.notePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={!isTimerRunning}
          style={[
            styles.noteInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
              opacity: isTimerRunning ? 0.5 : 1,
            },
          ]}
        />
      </View>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        disabled={!isValid || !hasChanges || isSaving || isTimerRunning}
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor:
              isValid && hasChanges && !isTimerRunning
                ? colors.textPrimary
                : colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.saveButtonText,
            {
              color:
                isValid && hasChanges && !isTimerRunning
                  ? colors.background
                  : colors.textSecondary,
            },
          ]}
        >
          {isSaving ? t('editEntry.saving') : t('editEntry.saveChanges')}
        </Text>
      </Pressable>

      {/* Delete Button */}
      {!showDeleteConfirm ? (
        <Pressable
          onPress={() => setShowDeleteConfirm(true)}
          disabled={isTimerRunning}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.7 : isTimerRunning ? 0.5 : 1 },
          ]}
        >
          <Text style={[styles.deleteButtonText, { color: colors.destructive }]}>
            {t('editEntry.deleteEntry')}
          </Text>
        </Pressable>
      ) : (
        <View
          style={[
            styles.deleteConfirm,
            { backgroundColor: colors.destructiveBackground },
          ]}
        >
          <Text
            style={[styles.deleteConfirmText, { color: colors.textPrimary }]}
          >
            {t('editEntry.deleteConfirm')}
          </Text>
          <View style={styles.deleteConfirmButtons}>
            <Pressable
              onPress={() => setShowDeleteConfirm(false)}
              style={({ pressed }) => [
                styles.confirmButton,
                {
                  backgroundColor: 'transparent',
                  borderColor: colors.border,
                  borderWidth: 1,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  { color: colors.textPrimary },
                ]}
              >
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.confirmButton,
                {
                  backgroundColor: colors.destructive,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={[styles.confirmButtonText, { color: colors.background }]}>
                {t('common.delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
          </ScreenSection>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: 0,
  },
  warningBanner: {
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  warningText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.sans,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  optionalText: {
    textTransform: 'none',
    fontFamily: fonts.sans,
    letterSpacing: 0,
  },
  projectList: {
    gap: 6,
  },
  projectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: radii.md,
  },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  projectName: {
    fontSize: 15,
    fontFamily: fonts.sansMedium,
  },
  dateButton: {
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    fontFamily: fonts.sansMedium,
  },
  dateSubtext: {
    fontSize: 13,
    fontFamily: fonts.sans,
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  durationInput: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  durationTextInput: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: fonts.sans,
    textAlign: 'center',
  },
  durationUnit: {
    paddingRight: 16,
    fontSize: 14,
    fontFamily: fonts.sans,
  },
  noteInput: {
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: fonts.sans,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    height: 56,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
  },
  deleteButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  deleteConfirm: {
    borderRadius: radii.md,
    padding: 18,
  },
  deleteConfirmText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    marginBottom: 14,
  },
  deleteConfirmButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
});
