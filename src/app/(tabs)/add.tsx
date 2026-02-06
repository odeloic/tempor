import { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { startOfDay } from 'date-fns';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import {
  DateSelector,
  DurationInput,
  NoteInput,
  ProjectSelector,
} from '@/components/AddEntry';
import { Screen } from '@/components/ui/Screen';
import { ScreenSection } from '@/components/ui/ScreenSection';
import { Toast } from '@/components/ui/Toast';
import { useProjects } from '@/hooks/useProjects';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { formatDuration, hoursMinutesToSeconds } from '@/lib/time';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function AddEntryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { projects } = useProjects();
  const { create } = useTimeEntries();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const duration = hoursMinutesToSeconds(hours, minutes);
  const isValid = selectedProjectId !== null && duration > 0;

  const resetForm = useCallback(() => {
    setSelectedProjectId(null);
    setSelectedDate(startOfDay(new Date()));
    setHours(0);
    setMinutes(0);
    setNote('');
  }, []);

  const handleSave = useCallback(async () => {
    if (!isValid || isSaving) return;

    setIsSaving(true);
    try {
      await create({
        projectId: String(selectedProjectId),
        date: selectedDate,
        duration,
        note: note.trim() || null,
      });

      const selectedProject = projects.find((p) => p.id === selectedProjectId);
      const projectName = selectedProject?.name ?? 'project';
      setToastMessage(t('addEntry.savedToast', { duration: formatDuration(duration), project: projectName }));
      setToastVisible(true);

      resetForm();
    } catch (error) {
      console.error('Failed to save entry:', error);
      setToastMessage(t('addEntry.failedToSave'));
      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  }, [
    isValid,
    isSaving,
    selectedProjectId,
    selectedDate,
    duration,
    note,
    create,
    projects,
    resetForm,
    t,
  ]);

  const handleHideToast = useCallback(() => setToastVisible(false), []);

  return (
    <Screen style={styles.container}>
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={handleHideToast}
      />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xl,
          paddingBottom: 120,
        }}
        bottomOffset={tabBarHeight}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenSection>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('addEntry.title')}
          </Text>

          <ProjectSelector
            projects={projects}
            selectedId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />

          <DateSelector value={selectedDate} onChange={setSelectedDate} />

          <DurationInput
            hours={hours}
            minutes={minutes}
            onHoursChange={setHours}
            onMinutesChange={setMinutes}
          />

          <NoteInput value={note} onChange={setNote} />

          <Pressable
            onPress={handleSave}
            disabled={!isValid || isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: isValid
                  ? colors.textPrimary
                  : colors.border,
                opacity: pressed && isValid ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.saveButtonText,
                {
                  color: isValid ? colors.background : colors.textSecondary,
                },
              ]}
            >
              {isSaving ? t('addEntry.saving') : t('addEntry.addEntry')}
            </Text>
          </Pressable>
        </ScreenSection>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.sansSemiBold,
    marginBottom: spacing.lg,
  },
  saveButton: {
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0.3,
  },
});
