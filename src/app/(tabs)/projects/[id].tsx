import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { useProjects } from '@/hooks/useProjects';
import { ProjectForm } from '@/components/Project/ProjectForm';

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getProject, updateProject, deleteProject, hasTimeEntries } = useProjects();

  const [hasEntries, setHasEntries] = useState(false);
  const project = getProject(Number(id));

  useEffect(() => {
    if (id) {
      hasTimeEntries(Number(id)).then(setHasEntries);
    }
  }, [id, hasTimeEntries]);

  const handleSave = async (data: { name: string; color: string }) => {
    await updateProject(Number(id), data);
    router.back();
  };

  const handleDelete = async () => {
    await deleteProject(Number(id));
    router.back();
  };

  if (!project) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.textSecondary }]}>
          {t('projects.notFound')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            {
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('projectForm.editProject')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form */}
      <ProjectForm
        project={project}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => router.back()}
        hasTimeEntries={hasEntries}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontFamily: fonts.sansSemiBold,
  },
  headerSpacer: {
    width: 40,
  },
  notFound: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontFamily: fonts.sans,
  },
});