import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';
import { projectColors } from '@/constants/colors';
import { ProjectColorPicker } from '@/components/Project/ProjectColorPicker';
import type { Project } from '@/db/schema';
import { AppScrollView } from '@/components/ui/AppScrollView';

interface Props {
  project?: Project;
  onSave: (data: { name: string; client: string | null; color: string }) => void;
  onDelete?: () => void;
  onCancel: () => void;
  hasTimeEntries?: boolean;
}

export function ProjectForm({
  project,
  onSave,
  onDelete,
  onCancel,
  hasTimeEntries = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState(project?.name ?? '');
  const [client, setClient] = useState(project?.client ?? '');
  const [color, setColor] = useState(project?.color ?? projectColors[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isValid = name.trim().length > 0;
  const isEditMode = !!project;

  const handleSave = () => {
    if (isValid) {
      onSave({ name: name.trim(), client: client.trim() || null, color });
    }
  };

  return (
    <AppScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Project Name Field */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('projectForm.projectName')}
          </Text>
        </View>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('projectForm.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          autoFocus={!isEditMode}
        />
      </View>

      {/* Client Field */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('projectForm.client')}
          </Text>
          <Text style={[styles.optional, { color: colors.textSecondary }]}>
            {t('form.optional')}
          </Text>
        </View>
        <TextInput
          value={client}
          onChangeText={setClient}
          placeholder={t('projectForm.clientPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
        />
      </View>

      {/* Color Picker */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('projectForm.color')}
          </Text>
        </View>
        <ProjectColorPicker value={color} onChange={setColor} />
      </View>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        disabled={!isValid}
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor: isValid ? colors.textPrimary : colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.saveButtonText,
            { color: isValid ? colors.background : colors.textSecondary },
          ]}
        >
          {isEditMode ? t('projectForm.saveChanges') : t('projectForm.createProject')}
        </Text>
      </Pressable>

      {/* Delete Section (Edit Mode Only) */}
      {onDelete && !showDeleteConfirm && (
        <Pressable
          onPress={() => setShowDeleteConfirm(true)}
          style={styles.deleteButton}
        >
          <Text style={[styles.deleteButtonText, { color: colors.destructive }]}>
            {t('projectForm.deleteProject')}
          </Text>
        </Pressable>
      )}

      {onDelete && showDeleteConfirm && (
        <View style={styles.deleteConfirm}>
          <Text style={[styles.deleteMessage, { color: colors.textPrimary }]}>
            {hasTimeEntries
              ? t('projectForm.deleteConfirmWithEntries')
              : t('projectForm.deleteConfirmNoEntries')}
          </Text>
          <View style={styles.deleteActions}>
            <Pressable
              onPress={() => setShowDeleteConfirm(false)}
              style={[
                styles.deleteActionButton,
                styles.deleteActionButtonCancel,
                { borderColor: colors.border },
              ]}
            >
              <Text style={[styles.deleteActionText, { color: colors.textPrimary }]}>
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={[
                styles.deleteActionButton,
                { backgroundColor: colors.destructive },
              ]}
            >
              <Text style={[styles.deleteActionText, { color: '#FFFFFF' }]}>
                {t('common.delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </AppScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  field: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  optional: {
    fontSize: 11,
    fontFamily: fonts.sans,
  },
  input: {
    padding: spacing.md,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: fonts.sans,
  },
  saveButton: {
    height: 56,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0.3,
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
    backgroundColor: '#FEF2F2',
    borderRadius: radii.md,
    padding: 18,
    marginTop: spacing.sm,
  },
  deleteMessage: {
    fontSize: 14,
    fontFamily: fonts.sans,
    marginBottom: 14,
    lineHeight: 20,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteActionButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  deleteActionText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
});
