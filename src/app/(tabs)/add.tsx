import {
  DateSelector,
  DurationInput,
  NoteInput,
} from '@/components/AddEntry';
import { ProjectPickerModal } from '@/components/Project/ProjectPickerModal';
import { Screen } from '@/components/ui/Screen';
import { ScreenSection } from '@/components/ui/ScreenSection';
import { SelectButton } from '@/components/ui/SelectButton';
import { Toast } from '@/components/ui/Toast';
import { type Project } from '@/db/schema';
import { useProjects } from '@/hooks/useProjects';
import { useProjectPicker } from '@/hooks/useProjectPicker';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { formatDuration, hoursMinutesToSeconds } from '@/lib/time';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

import { startOfDay } from 'date-fns';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddEntryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { projects } = useProjects();
  const { create } = useTimeEntries();
  const picker = useProjectPicker();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const duration = hoursMinutesToSeconds(hours, minutes);
  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
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

      const projectName = selectedProject?.name ?? 'project';
      setToastMessage(t('addEntry.savedToast', { duration: formatDuration(duration), project: projectName }));
      setToastVisible(true);

      resetForm();
    } catch {
      setToastMessage(t('addEntry.failedToSave'));
      setToastVisible(true);
    } finally {
      setIsSaving(false);
    }
  }, [
    isValid,
    isSaving,
    selectedProjectId,
    selectedProject,
    selectedDate,
    duration,
    note,
    create,
    resetForm,
    t,
  ]);

  const handleHideToast = useCallback(() => setToastVisible(false), []);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProjectId(project.id);
  }, []);

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

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t('form.project')}
            </Text>
            <SelectButton
              label={selectedProject?.name ?? ''}
              color={selectedProject?.color}
              placeholder={t('timer.selectProject')}
              onPress={picker.open}
            />
          </View>

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
      <ProjectPickerModal
        visible={picker.visible}
        projects={projects}
        selectedProjectId={selectedProjectId ?? undefined}
        onSelectProject={handleSelectProject}
        onCreateProject={picker.create}
        onDismiss={picker.dismiss}
      />
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
